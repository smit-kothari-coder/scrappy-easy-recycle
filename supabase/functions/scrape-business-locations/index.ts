
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import OpenAI from "https://esm.sh/openai@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    // Scrape webpage
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Simple scraping strategy - adjust as needed
    const businessName = $('h1').first().text().trim() || 'Unknown Business';
    const businessDescription = $('p').first().text().trim() || 'No description available';
    const businessAddress = $('[data-address], .address').first().text().trim() || 'Address not found';

    // Initialize OpenAI for description summarization
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    });

    // Summarize description
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a concise business description summarizer. Provide a clear, professional summary in 2-3 sentences."
        },
        {
          role: "user",
          content: businessDescription
        }
      ],
      response_format: { type: "json_object" }
    });

    const summary = JSON.parse(
      summaryResponse.choices[0].message.content || '{}'
    ).summary || businessDescription;

    // Geocode address using Nominatim
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit protection
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(businessAddress)}`
    );
    const geocodeData = await geocodeResponse.json();

    const location = geocodeData[0] || {};
    const latitude = parseFloat(location.lat);
    const longitude = parseFloat(location.lon);

    // Return scraped and processed data
    return new Response(
      JSON.stringify({
        name: businessName,
        address: businessAddress,
        description: businessDescription,
        summary,
        latitude,
        longitude
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
