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
    const { lat, lng, address, maxBudget, filter, targetSource } = body;
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

    if (!FIRECRAWL_API_KEY) {
      console.warn("Firecrawl API key missing. Returning no apartment.");
      return NextResponse.json({
        success: true,
        source: "none",
        count: 0,
        listings: [],
        message: "no apartment"
      });
    }

    const app = new Firecrawl({ apiKey: FIRECRAWL_API_KEY });

    const configsToScrape = targetSource 
      ? SCRAPE_CONFIGS.filter(c => c.name === targetSource)
      : SCRAPE_CONFIGS;

    // Map through our configs to create an array of fetch promises
    const scrapePromises = configsToScrape.map(async (site) => {
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
    let allListings = resultsArray.flat();
    
    // Apply bed filter if provided
    if (filter && filter !== "All") {
      const matchText = filter.toLowerCase().replace('+', '');
      const numBeds = parseInt(matchText);
      allListings = allListings.filter(listing => {
        const text = `${listing.title} ${listing.description}`.toLowerCase();
        if (numBeds) {
          if (filter === "3+ Bed") {
            return text.includes("3 bed") || text.includes("4 bed") || text.includes("5 bed") || text.includes("3 room") || text.includes("4 room");
          }
          return text.includes(`${numBeds} bed`) || text.includes(`${numBeds} room`) || text.includes(`${numBeds} bedroom`);
        } else if (filter === "Studio") {
          return text.includes("studio") || text.includes("self contain") || text.includes("self-contain") || text.includes("mini flat");
        }
        return true;
      });
    }
    
    // Apply budget filter if provided
    if (maxBudget) {
      allListings = allListings.filter(listing => {
        const numericPrice = parseInt(listing.price.replace(/\\D/g, ''));
        if (isNaN(numericPrice)) return true; // Keep if we can't parse
        return numericPrice <= maxBudget;
      });
    }

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


