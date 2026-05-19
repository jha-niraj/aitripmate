import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Please sign in to generate an itinerary" }, { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "AI service not configured. Please contact support." }, { status: 500 });
        }

        let body: { destination?: string; days?: number | string; budget?: string; travelType?: string; interests?: string[] };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { destination, days, budget, travelType, interests } = body;

        if (!destination || !days || !budget || !travelType) {
            return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
        }

        const numDays = Number(days);
        if (isNaN(numDays) || numDays < 1) {
            return NextResponse.json({ error: "Invalid number of days" }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const interestsList = Array.isArray(interests) && interests.length > 0 ? interests.join(", ") : "General sightseeing";
        const maxTokens = Math.min(16000, numDays * 1200 + 2500);

        const prompt = `Create a detailed ${numDays}-day travel itinerary for ${destination}, India.

Trip details:
- Duration: ${numDays} days
- Budget level: ${budget} (Budget = under ₹2000/day, Mid-range = ₹2000-5000/day, Luxury = above ₹5000/day)
- Travel type: ${travelType}
- Interests: ${interestsList}

Return a JSON object with this exact structure. The "days" array MUST have exactly ${numDays} entries (one per day):
{
  "tripName": "string",
  "destination": "string",
  "summary": "string",
  "totalBudget": "string (e.g. ₹15,000 total)",
  "destinationType": "string (hill_station|city|beach|forest|desert|heritage)",
  "days": [
    {
      "day": 1,
      "theme": "string",
      "activities": [
        {
          "time": "9:00 AM",
          "name": "string",
          "location": "string",
          "description": "string",
          "duration": "2 hours",
          "cost": "₹200",
          "category": "sightseeing"
        }
      ],
      "meals": { "breakfast": "string", "lunch": "string", "dinner": "string" },
      "accommodation": "string",
      "tips": "string"
    }
  ],
  "packingList": ["string"],
  "importantNotes": ["string"],
  "emergencyNumbers": { "police": "100", "ambulance": "108", "tourist_helpline": "1800-111-363" }
}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Indian travel planner. You must respond with valid JSON only. Always include exactly ${numDays} day objects in the "days" array.`,
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
            return NextResponse.json({ error: "AI returned an empty response. Please try again." }, { status: 500 });
        }

        let itineraryData: Record<string, unknown>;

        try {
            itineraryData = JSON.parse(responseText);
        } catch {
            console.error("Failed to parse AI response:", responseText.slice(0, 200));
            return NextResponse.json({ error: "AI returned malformed data. Please try again." }, { status: 500 });
        }

        if (!Array.isArray(itineraryData.days) || itineraryData.days.length === 0) {
            console.error("AI response missing days array:", JSON.stringify(itineraryData).slice(0, 200));
            return NextResponse.json({ error: "AI did not return day-by-day data. Please try again." }, { status: 500 });
        }

        const trip = await prisma.trip.create({
            data: {
                destination: String(destination),
                date: new Date(),
                userId: session.user.id,
                days: numDays,
                budget: String(budget),
                travelType: String(travelType),
                interests: Array.isArray(interests) ? interests : [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itinerary: itineraryData as any,
                destinationType: String(itineraryData.destinationType || "city"),
                riskLevel: "unknown",
                confirmed: false,
            },
        });

        return NextResponse.json({ itinerary: itineraryData, tripId: trip.id }, { status: 200 });
    } catch (err) {
        console.error("Itinerary generation error:", err);
        const message = err instanceof Error ? err.message : "Failed to generate itinerary";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
