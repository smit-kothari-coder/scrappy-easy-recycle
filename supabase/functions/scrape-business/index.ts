
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log(`Processing URL: ${url}`);
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Scrape the website content
    console.log("Starting web scraping...");
    const webContent = await scrapeWebsite(url);
    console.log("Web scraping complete");

    // Step 2: Extract useful information
    const businessData = extractBusinessInfo(webContent);
    console.log("Extracted business info:", businessData);

    // Step 3: Use OpenAI to summarize the description
    console.log("Summarizing with OpenAI...");
    const summarizedDescription = await summarizeWithOpenAI(businessData.description);
    businessData.summary = summarizedDescription;
    console.log("Summary generated");

    // Step 4: Geocode the address
    console.log("Geocoding address...");
    const geocodedData = await geocodeAddress(businessData.address);
    console.log("Geocoding complete:", geocodedData);

    // Combine all data - NOT storing in Supabase, just returning to client
    const result = {
      ...businessData,
      latitude: geocodedData.latitude,
      longitude: geocodedData.longitude
    };

    console.log("Final result:", result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function scrapeWebsite(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

function extractBusinessInfo(html: string) {
  const $ = cheerio.load(html);
  
  // Try to extract business name - look for common patterns
  const nameSelectors = [
    'h1', 'header h1', '.business-name', '.company-name', 
    '[itemprop="name"]', '.brand-name', '.site-title', 'title'
  ];
  
  let name = '';
  for (const selector of nameSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      name = element.text().trim();
      break;
    }
  }
  
  // Try to extract address - look for common patterns
  const addressSelectors = [
    '[itemprop="address"]', '.address', '.location', '.contact-address',
    'address', '.store-address', '.office-address', '.contact-info address'
  ];
  
  let address = '';
  for (const selector of addressSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      address = element.text().trim().replace(/\\n/g, ' ').replace(/\s+/g, ' ');
      break;
    }
  }
  
  // Extract description - get a large chunk of text from the page
  const descriptionSelectors = [
    '[itemprop="description"]', '.description', '.about-us', '.about', 
    'p', 'article', 'main', '#main', '.main-content'
  ];
  
  let description = '';
  for (const selector of descriptionSelectors) {
    const elements = $(selector);
    if (elements.length) {
      description = elements.text().trim().substring(0, 2000);
      break;
    }
  }
  
  // If we couldn't extract proper data, use fallbacks
  if (!name) name = $('title').text().trim() || "Unknown Business";
  if (!address) address = "Unknown Address";
  if (!description) description = $('body').text().trim().substring(0, 2000) || "No description available";

  return {
    name,
    address,
    description
  };
}

async function summarizeWithOpenAI(text: string) {
  if (!openAIApiKey) {
    console.warn("OpenAI API key not found");
    return "Summary not available (API key missing)";
  }

  try {
    const prompt = `Summarize this business description in 2-3 sentences: "${text.substring(0, 1000)}"`;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes business descriptions concisely." },
          { role: "user", content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error summarizing with OpenAI:", error);
    return "Summary not available (API error)";
  }
}

async function geocodeAddress(address: string) {
  try {
    // URL encode the address
    const encodedAddress = encodeURIComponent(address);
    
    // Call Nominatim API (respecting usage policy with format=json)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "ScrapEasy Location Scraper/1.0"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Add a 1 second delay to respect Nominatim usage policy
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.length === 0) {
      console.warn("No geocoding results found for address:", address);
      // Return a default location if geocoding fails
      return { latitude: 51.505, longitude: -0.09 }; // London coordinates as fallback
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error("Error geocoding address:", error);
    // Return a default location if geocoding fails
    return { latitude: 51.505, longitude: -0.09 }; // London coordinates as fallback
  }
}
