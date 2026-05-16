import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const { imageBase64, mimeType } = await request.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "Image data is required" }, { status: 400 });
        }

        const type = mimeType || "image/jpeg";
        const dataUrl = `data:${type};base64,${imageBase64}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `You are an expert travel guide and location identifier specializing in India.

Analyze this image and provide:
1. **Location Identification**: What place/landmark/location is this? Be as specific as possible (city, state, exact landmark if identifiable).
2. **About this Place**: 2-3 sentences describing the place, its significance, and what makes it special.
3. **Travel Tips**: 2-3 practical tips for visiting this location.
4. **Best Time to Visit**: When is the ideal time to visit?
5. **Nearby Attractions**: 2-3 nearby places worth visiting.
6. **Local Food**: What local food or cuisine should a traveler try here?

If the image does NOT show an identifiable Indian location or landmark, still describe what you see and suggest similar places in India to visit.

Format your response in a clear, traveler-friendly way.`,
                        },
                        {
                            type: "image_url",
                            image_url: { url: dataUrl, detail: "high" },
                        },
                    ],
                },
            ],
            max_tokens: 800,
        });

        const analysis = response.choices[0].message.content || "Unable to analyze the image.";
        return NextResponse.json({ analysis }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message || "Failed to analyze image" }, { status: 500 });
    }
}
