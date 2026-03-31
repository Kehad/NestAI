import { NextRequest, NextResponse } from "next/server";
import Firecrawl from "@mendable/firecrawl-js";
import { supabase } from "@/lib/supabase";

const SCRAPE_CONFIGS = [
  {
    name: "Jiji",
    baseUrl: "https://jiji.ng",
    searchPath: "/ife/houses-apartments-for-rent?query=",
  },
  {
    name: "PropertyPro",
    baseUrl: "https://www.propertypro.ng",
    searchPath: "/property-for-rent?search=",
  },
  {
    name: "Twitter",
    baseUrl: "https://twitter.com",
    searchPath: "/search?q=house+for+rent+",
  },
  {
    name: "Facebook",
    baseUrl: "https://www.facebook.com",
    searchPath: "/search/top?q=house+for+rent+",
  },
  {
    name: "Instagram",
    baseUrl: "https://www.instagram.com",
    searchPath: "/explore/search/keyword/?q=house+for+rent+",
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, address } = body;
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

    if (!FIRECRAWL_API_KEY) {
      console.warn("Firecrawl API key missing. Returning mock data.");
      return NextResponse.json({
        success: true,
        source: "mock",
        listings: generateMockListings(lat, lng, address)
      });
    }

    const app = new Firecrawl({ apiKey: FIRECRAWL_API_KEY });

    // Map through our configs to create an array of fetch promises
    const scrapePromises = SCRAPE_CONFIGS.map(async (site) => {
      try {
        const searchUrl = `${site.baseUrl}${site.searchPath}${encodeURIComponent(address || "")}`;
        
        // Scrape with structured data extraction using v2 format
        const scrapeResult = await app.scrape(searchUrl, {
          formats: [
            {
              type: "json",
              schema: {
                type: "object",
                properties: {
                  properties: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        price: { type: "string" },
                        location: { type: "string" },
                        description: { type: "string" },
                        link: { type: "string" }
                      },
                      required: ["title", "price", "link"]
                    }
                  }
                }
              }
            }
          ]
        });

        if (!scrapeResult || !scrapeResult.json) {
          return [];
        }

        const rawListings = (scrapeResult.json as any).properties || [];

        // Map and normalize the data
        return rawListings.slice(0, 5).map((item: any, index: number) => ({
          id: `${site.name.toLowerCase()}-${index}-${Date.now()}`,
          source: site.name,
          title: item.title,
          price: item.price,
          location: item.location || address,
          description: item.description || "View details for more info",
          link: item.link.startsWith("http") ? item.link : `${site.baseUrl}${item.link}`,
          lat: (lat || 6.5244) + (Math.random() - 0.5) * 0.015,
          lng: (lng || 3.3792) + (Math.random() - 0.5) * 0.015
        }));
      } catch (siteError) {
        console.error(`Error scraping ${site.name}:`, siteError);
        return [];
      }
    });

    // Run all scrapes in parallel
    const resultsArray = await Promise.all(scrapePromises);

    // Flatten the array of arrays into one single list
    const allListings = resultsArray.flat();
    console.log("allListings", allListings);

    // Sync listings to database in the background
    if (allListings.length > 0) {
      // Create an array mapping our structured data directly into the DB format
      const dbListings = allListings.map(listing => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        location: listing.location,
        description: listing.description,
        link: listing.link,
        lat: listing.lat,
        lng: listing.lng,
        source: listing.source,
        created_at: new Date().toISOString()
      }));

      // Insert into supabase
      supabase.from("listings").insert(dbListings)
        .then(({ error }) => {
          if (error) console.error("Database sync error (listings):", error);
          else console.log(`Successfully synced ${dbListings.length} listings to the database.`);
        });
    }

    return NextResponse.json({ 
      success: true, 
      source: "firecrawl",
      count: allListings.length, 
      listings: allListings 
    });

  } catch (error: any) {
    console.error("Firecrawl Search error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Failed to crawl house listings" 
    }, { status: 500 });
  }
}

function generateMockListings(lat: number, lng: number, address: string) {
  return [
    {
      id: "mock-1",
      title: "Luxury 3-Bedroom Apartment",
      price: "₦4,500,000/yr",
      location: address || "Near you",
      description: "Beautiful modern apartment with 24/7 security and power.",
      lat: lat + 0.002,
      lng: lng + 0.003
    },
    {
      id: "mock-2",
      title: "Cozy Studio Flat",
      price: "₦1,200,000/yr",
      location: address || "Near you",
      description: "Perfect for young professionals. Close to the city center.",
      lat: lat - 0.001,
      lng: lng + 0.005
    },
    {
      id: "mock-3",
      title: "Spacious 4-Bedroom Duplex",
      price: "₦8,000,000/yr",
      location: address || "Near you",
      description: "Family-sized home with large backyard and garage.",
      lat: lat + 0.005,
      lng: lng - 0.002
    }
  ];
}
