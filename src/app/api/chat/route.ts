import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, listings } = await request.json();

    // Initialize the new Google Gen AI client
    // It automatically reads from GEMINI_API_KEY environment variable
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Limit listings context to avoid huge payloads
    // const listingsContext = listings ? JSON.stringify(listings.slice(0, 50)) : "[]";

    // Format messages for the @google/genai SDK
    // SDK expects: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
    //     const contents = messages.map((m: any) => ({
    //       role: m.role === "assistant" ? "model" : m.role,
    //       parts: [{ text: m.content }]
    //     }));

    //     const response = await ai.models.generateContent({
    //       model: "gemini-3-flash-preview",
    //       contents,
    //       config: {
    //         systemInstruction: `You are an AI House Agent for a real estate platform called NestAI. 
    // Your job is to analyze the provided property listings and help the user find the best fit based on their queries.
    // Here are the current properties in JSON format:
    // ${listingsContext}

    // Only recommend properties from the provided listings. Be helpful, concise, and engaging. If they ask about prices, convert strings back to numbers for comparison. DO NOT make up properties that aren't in the list.`
    // }
    // });
    console.log(messages);

    const response2 = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.content,
    });
    console.log(response2);

    return NextResponse.json({
      role: "assistant",
      content: response2.text
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { error: "Agent failed to respond. Ensure your GEMINI_API_KEY is set." },
      { status: 500 }
    );
  }
}
