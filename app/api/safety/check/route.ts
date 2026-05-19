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

        const { destination, destinationType, tripId } = await request.json();

        if (!destination) {
            return NextResponse.json({ error: "Destination is required" }, { status: 400 });
        }

        const destType = destinationType || "city";

        const priorityMap: Record<string, string[]> = {
            hill_station: ["Landslides", "Weather warnings", "Roadblocks", "Flash floods"],
            city: ["Crowd density", "Petty theft", "Traffic congestion", "Air quality"],
            beach: ["High tides", "Rip currents", "Jellyfish warnings", "Storm warnings"],
            forest: ["Wildlife encounters", "Trail safety", "Flash floods", "Getting lost"],
            desert: ["Extreme heat", "Sandstorms", "Dehydration", "Flash floods"],
            heritage: ["Crowd management", "Heat exposure", "Local scams", "Restricted areas"],
        };

        const priorities = priorityMap[destType] || priorityMap.city;

        const prompt = `You are a travel safety expert for India. Provide a realistic safety assessment for traveling to ${destination}.

Destination type: ${destType}
Key risk categories to prioritize for this destination type: ${priorities.join(", ")}

Return ONLY valid JSON in this exact structure (no markdown):
{
  "riskLevel": "string (low|medium|high)",
  "riskSummary": "string (1-2 sentences overall assessment)",
  "alerts": [
    {
      "type": "string (category name)",
      "severity": "string (low|medium|high)",
      "title": "string",
      "description": "string (1-2 sentences)",
      "icon": "string (emoji)"
    }
  ],
  "safetyTips": ["string"],
  "bestTimeToVisit": "string",
  "localEmergencyInfo": "string"
}

Generate 3-5 realistic alerts specific to ${destination}. Be specific and practical, not generic. Base alerts on actual geographical and seasonal realities of the location.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a travel safety expert for India. Always respond with valid JSON only." },
                { role: "user", content: prompt },
            ],
            temperature: 0.5,
            max_tokens: 2000,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0].message.content || "";
        let safetyData;
        try {
            safetyData = JSON.parse(responseText);
        } catch {
            throw new Error("Failed to parse safety response. Please try again.");
        }

        if (tripId) {
            await prisma.trip.update({
                where: { id: tripId },
                data: { riskLevel: safetyData.riskLevel, destinationType: destType },
            });
        }

        return NextResponse.json({ safety: safetyData }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "Failed to check safety" }, { status: 500 });
    }
}
