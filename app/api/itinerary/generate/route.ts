import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { destination, days, budget, travelType, interests } = await request.json();

        if (!destination || !days || !budget || !travelType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const interestsList = Array.isArray(interests) ? interests.join(", ") : interests;

        const prompt = `You are an expert Indian travel planner. Create a detailed ${days}-day travel itinerary for ${destination}, India.

Trip details:
- Duration: ${days} days
- Budget level: ${budget} (Budget = under ₹2000/day, Mid-range = ₹2000-5000/day, Luxury = above ₹5000/day)
- Travel type: ${travelType}
- Interests: ${interestsList || "General sightseeing"}

Return ONLY valid JSON in this exact structure (no markdown, no extra text):
{
  "tripName": "string",
  "destination": "string",
  "summary": "string (2-3 sentences about the trip)",
  "totalBudget": "string (estimated total cost in INR)",
  "destinationType": "string (one of: hill_station, city, beach, forest, desert, heritage)",
  "days": [
    {
      "day": 1,
      "theme": "string (theme for this day)",
      "activities": [
        {
          "time": "string (e.g. 9:00 AM)",
          "name": "string",
          "location": "string",
          "description": "string (1-2 sentences)",
          "duration": "string (e.g. 2 hours)",
          "cost": "string (estimated cost in INR)",
          "category": "string (sightseeing|food|transport|accommodation|activity|shopping)"
        }
      ],
      "meals": {
        "breakfast": "string",
        "lunch": "string",
        "dinner": "string"
      },
      "accommodation": "string",
      "tips": "string"
    }
  ],
  "packingList": ["string"],
  "importantNotes": ["string"],
  "emergencyNumbers": {
    "police": "100",
    "ambulance": "108",
    "tourist_helpline": "1800-111-363"
  }
}`;

        const numDays = Number(days);
        const maxTokens = Math.min(16000, numDays * 1200 + 2500);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Indian travel planner. Always respond with valid JSON only. You MUST generate exactly ${numDays} days in the "days" array — no more, no fewer.`,
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0].message.content || "";
        let itineraryData;
        try {
            itineraryData = JSON.parse(responseText);
        } catch {
            throw new Error("AI returned malformed JSON. Please try again.");
        }

        if (!Array.isArray(itineraryData.days) || itineraryData.days.length < numDays) {
            throw new Error(`AI only generated ${itineraryData.days?.length ?? 0} of ${numDays} days. Please try again.`);
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                date: new Date(),
                userId: session.user.id,
                days: Number(days),
                budget,
                travelType,
                interests: Array.isArray(interests) ? interests : [],
                itinerary: itineraryData,
                destinationType: itineraryData.destinationType || "city",
                riskLevel: "unknown",
                confirmed: false,
            },
        });

        return NextResponse.json({ itinerary: itineraryData, tripId: trip.id }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "Failed to generate itinerary" }, { status: 500 });
    }
}
