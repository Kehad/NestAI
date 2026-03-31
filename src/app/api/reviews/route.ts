import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ success: false, message: "Property ID required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    // Fallback to empty if table doesn't exist yet
    return NextResponse.json({ success: true, reviews: [] });
  }

  return NextResponse.json({ success: true, reviews: data });
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId, rating, comment, userName } = await request.json();

    if (!propertyId || !rating || !comment) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        { 
          property_id: propertyId, 
          rating, 
          comment, 
          user_name: userName || "Anonymous",
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, message: "Failed to save review" }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
