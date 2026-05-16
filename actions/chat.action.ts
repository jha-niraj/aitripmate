"use server";

import OpenAI from "openai";

// Define inappropriate words detection
const inappropriateWords = [
    "fuck", "shit", "ass", "bitch", "damn", "crap", "bastard",
    // Add more inappropriate words as needed
];

// Check if the message contains inappropriate language
function containsInappropriateLanguage(message: string): boolean {
    const lowercaseMessage = message.toLowerCase();
    return inappropriateWords.some(word =>
        lowercaseMessage.includes(word)
    );
}

export async function processChatMessage(formData: FormData) {
    try {
        // Get only the user input - no need to parse the entire message history
        const input = formData.get("input");
        const destination = formData.get("destination");

        // Validate input
        if (!input || typeof input !== "string") {
            return {
                success: false,
                error: "Input is required",
                warning: false
            };
        }

        // Check for inappropriate language
        const hasInappropriateLanguage = containsInappropriateLanguage(input);
        if (hasInappropriateLanguage) {
            return {
                success: true,
                message: "I appreciate your enthusiasm, but please refrain from using inappropriate language. How can I help you plan your trip to India?",
                warning: true
            };
        }

        // Build the system message
        let systemMessage = "You are an AI travel assistant specializing in Indian tourism. ";
        systemMessage += "You provide helpful, accurate, and concise information about destinations, attractions, ";
        systemMessage += "accommodations, local cuisine, cultural events, transportation, weather, and travel tips across India. ";

        if (destination && typeof destination === "string") {
            systemMessage += `Focus particularly on ${destination} as the user's chosen destination. `;
        }

        systemMessage += "Respond in a friendly and engaging manner. Keep responses under 150 words unless more detail is necessary. ";
        systemMessage += "If asked about non-travel topics, politely redirect the conversation back to Indian travel.";

        // Call OpenAI API with just the system prompt and user input
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: input }
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        // Extract the response
        const responseText = completion.choices[0].message.content;

        // Return the response
        return {
            success: true,
            message: responseText || "I'm not sure how to respond to that. Would you like some information about traveling in India?",
            warning: false
        };
    } catch (error) {
        console.error("Error processing chat message:", error);
        return {
            success: false,
            error: "Failed to process your request. Please try again later.",
            warning: false
        };
    }
}