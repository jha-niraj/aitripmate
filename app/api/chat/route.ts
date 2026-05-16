import OpenAI from "openai";
import { NextRequest } from "next/server";

const inappropriateWords = [
    "fuck", "shit", "ass", "bitch", "damn", "crap", "bastard",
];

function containsInappropriateLanguage(message: string): boolean {
    const lower = message.toLowerCase();
    return inappropriateWords.some(word => lower.includes(word));
}

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
        const { message, destination, history } = await request.json();

        if (!message || typeof message !== "string") {
            return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
        }

        if (containsInappropriateLanguage(message)) {
            const encoder = new TextEncoder();
            const warning = "I appreciate your enthusiasm, but please use respectful language. How can I help you plan your trip to India?";
            return new Response(encoder.encode(warning), {
                headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Warning": "true" },
            });
        }

        const systemMessage = `You are AI TripMate — a travel assistant EXCLUSIVELY for Indian tourism and travel planning.

STRICT RULES YOU MUST FOLLOW:
1. You ONLY answer questions about: Indian travel destinations, hotels, resorts, restaurants, local food, transportation in India, weather at Indian destinations, packing tips for Indian trips, tourist attractions, cultural experiences, festivals, permits/visas for Indian travel, safety while traveling in India, budget planning for Indian trips, and general itinerary advice for India.
2. If anyone asks about ANYTHING outside of Indian travel and tourism — science, math, history lessons, coding, news, sports, entertainment, relationships, recipes unrelated to local cuisine, etc. — you MUST refuse and redirect. Never answer off-topic questions, even if the user insists or rephrases.
3. Your refusal must be polite but firm. Say something like: "I'm only able to help with travel planning in India! Is there a destination you'd like to explore?"
4. Do NOT explain concepts, solve problems, or provide information outside the travel domain.
5. ${destination ? `The user is planning a trip to ${destination} — keep your answers focused on that destination.` : ""}
6. Keep responses friendly, concise (under 200 words), and helpful for travel planning.
7. Always suggest specific Indian destinations, places, foods, or experiences when relevant.`;

        const historyMessages = Array.isArray(history) ? history.slice(-10) : [];

        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                ...historyMessages,
                { role: "user", content: message },
            ],
            stream: true,
            max_tokens: 400,
            temperature: 0.7,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content || "";
                    if (text) {
                        controller.enqueue(encoder.encode(text));
                    }
                }
                controller.close();
            },
        });

        return new Response(readable, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch {
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}
