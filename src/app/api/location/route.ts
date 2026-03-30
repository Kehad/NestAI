import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = 'AIzaSyArji7LEVeeXDdZb2nKCaPKHzb57HZQ-HM';

export async function GET(request: NextRequest) {
  try {
    // Note: Google's Geolocation API is a POST request

    if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log(pos); // Latitude and Longitude
    }
  );
}

    // const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ considerIp: true })
    // });
    
    // const data = await response.json();
    // console.log(data)

    // if (data.location) {
    //   // Since Google Geolocation only returns lat/lng, we'll return that.
    //   // For city/country, it would require an additional Reverse Geocode call.
    //   return NextResponse.json({
    //     success: true,
    //     lat: data.location.lat,
    //     lon: data.location.lng,
    //     accuracy: data.accuracy
    //   });
    // } else {
    //   console.log(data)
    //   return NextResponse.json({ success: false, message: "Google could not geolocate IP" }, { status: 404 });
    // }
  } catch (error) {
    console.error("Error fetching location via Google:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
