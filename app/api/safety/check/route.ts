import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
        }

        let body: { destination?: string; destinationType?: string; tripId?: string };
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { destination, destinationType, tripId } = body;

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

        const prompt = `Provide a travel safety assessment for ${destination}, India (destination type: ${destType}).
Focus on these risk categories: ${priorities.join(", ")}.

Return a JSON object with this structure:
{
  "riskLevel": "low|medium|high",
  "riskSummary": "1-2 sentence overall assessment",
  "alerts": [
    { "type": "string", "severity": "low|medium|high", "title": "string", "description": "string", "icon": "emoji" }
  ],
  "safetyTips": ["string"],
  "bestTimeToVisit": "string",
  "localEmergencyInfo": "string"
}

Generate 3-5 specific, practical alerts for ${destination}.`;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a travel safety expert for India. Respond with valid JSON only." },
                { role: "user", content: prompt },
            ],
            temperature: 0.5,
            max_tokens: 2000,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
            return NextResponse.json({ error: "AI returned empty response. Please try again." }, { status: 500 });
        }

        let safetyData: { riskLevel?: string; [key: string]: unknown };
        try {
            safetyData = JSON.parse(responseText);
        } catch {
            console.error("Failed to parse safety response:", responseText.slice(0, 200));
            return NextResponse.json({ error: "AI returned malformed data. Please try again." }, { status: 500 });
        }

        if (tripId) {
            await prisma.trip.update({
                where: { id: tripId },
                data: { riskLevel: String(safetyData.riskLevel || "unknown"), destinationType: destType },
            });
        }

        return NextResponse.json({ safety: safetyData }, { status: 200 });
    } catch (err) {
        console.error("Safety check error:", err);
        const message = err instanceof Error ? err.message : "Failed to check safety";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
