import { NextRequest, NextResponse } from "next/server";

// REPLACE THIS with your own Geoapify API Key
const GEOAPIFY_API_KEY = '5dd7d61fd67c49589d95cee862668a95'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng } = body;
    console.log("Received coordinates:", lat, lng);

    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        { success: false, message: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    // Geoapify Reverse Geocoding API
    const REVERSE_GEO_URL = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    
    // Geoapify Static Map URL (The Map Image)
    // Style OSM-Bright-Smooth, Width 600, Height 400
    const STATIC_MAP_URL = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat};color:%23c1f32a;size:medium&apiKey=${GEOAPIFY_API_KEY}`;

    try {
      const response = await fetch(REVERSE_GEO_URL);
      const result = await response.json();
      console.log("Geoapify Response:", result);

      if (result.results && result.results.length > 0) {
        const locationData = result.results[0];
        
        // NEW: Trigger House Search nearby
        const searchRes = await fetch(`${request.nextUrl.origin}/api/search-houses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng, address: locationData.formatted })
        });
        const searchData = await searchRes.json();

        return NextResponse.json({
          success: true,
          message: "Geoapify location & House Search successful",
          sent_data: { lat, lng },
          result: {
            formatted_address: locationData.formatted,
            city: locationData.city,
            country: locationData.country,
            postcode: locationData.postcode,
            map_url: STATIC_MAP_URL,
            listings: searchData.listings || [], // Include listings in response
            raw: result
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: `Geoapify error: No results found for these coordinates`,
          error_details: result
        }, { status: 404 });
      }

    } catch (apiError) {
      console.error("Geoapify API call failed:", apiError);
      return NextResponse.json({
        success: false, 
        message: "Failed to connect to Geoapify API",
      }, { status: 502 });
    }

  } catch (error) {
    console.error("Internal submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
