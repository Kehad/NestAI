import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, listings } = await request.json();
    const lastMessage = messages[messages.length - 1].content;

    // AI logic (Mock for now, can be replaced with OpenAI/Anthropic)
    // It analyzes the listings and answers the user query.
    
    let aiResponse = "I'm analyzing the available listings for you... ";

    if (lastMessage.toLowerCase().includes("cheapest") || lastMessage.toLowerCase().includes("price")) {
      const cheapest = [...listings].sort((a,b) => {
        const pA = parseInt(a.price.replace(/\D/g, '')) || 0;
        const pB = parseInt(b.price.replace(/\D/g, '')) || 0;
        return pA - pB;
      })[0];
      aiResponse = `The cheapest option I found is the "${cheapest.title}" at ${cheapest.price}. It's located in ${cheapest.location}.`;
    } else if (lastMessage.toLowerCase().includes("best") || lastMessage.toLowerCase().includes("recommend")) {
      aiResponse = `Based on current reviews and price-to-value ratio, I'd recommend the "${listings[0]?.title}". It has great feedback and is in a prime location.`;
    } else {
      aiResponse = `I found ${listings.length} houses for you. You can see them on the map. Most are in the Lagos area with prices ranging from ₦1.2M to ₦8M. Would you like me to compare specific ones?`;
    }

    return NextResponse.json({
      role: "assistant",
      content: aiResponse
    });

  } catch (error) {
    return NextResponse.json({ error: "Agent failed to respond" }, { status: 500 });
  }
}
