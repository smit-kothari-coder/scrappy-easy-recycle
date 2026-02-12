import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Star } from "lucide-react";
import { toast } from "sonner";

// Type definitions
type ScrapType = {
  type: string;
  price: number;
};

type Scrapper = {
  id: string;
  name: string;
  address: string;
  rating: number;
  pincode: string;
  services: string[];
  scrapTypes: ScrapType[]; // Array of scrap types and prices
  type?: string; // Optional type field for scrapper type
};

interface ScrapperSearchProps {
  selectedPincode?: string;
  onSelectScrapper?: (scrapper: Scrapper) => void;
}

export const ScrapperSearch: React.FC<ScrapperSearchProps> = ({
  selectedPincode = "",
  onSelectScrapper,
}) => {
  const [pincode, setPincode] = useState(selectedPincode);
  const [scrappers, setScrappers] = useState<Scrapper[]>([]);
  const [loading, setLoading] = useState(false);

  // Trigger search if selectedPincode changes (from outside or manual entry)
  useEffect(() => {
    if (selectedPincode && selectedPincode !== pincode) {
      setPincode(selectedPincode);
      handleSearch();
    }
  }, [selectedPincode]);

  const handleSearch = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setLoading(true);
      setScrappers([]); // Clear previous results

      // Search scrappers from database based on the pincode
      const { data, error } = await supabase
        .from("scrappers")
        .select("id, name, address, rating, pincode, scrap_types, scrap_prices")
        .eq("pincode", pincode); // Query scrappers with the matching pincode

      if (error) throw error;
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      console.log("Raw data from Supabase:", data); // Debugging log

      const formattedScrappers = data.map((item: any) => {
        // Combine scrap_types and scrap_prices into a single array
        const scrapTypes = Array.isArray(item.scrap_types) && item.scrap_prices
          ? item.scrap_types.map((type: string, index: number) => ({
              type: type || "Unknown Type", // Fallback for missing type
              price: item.scrap_prices[type] ?? 0, // Match price by type key or default to 0
            }))
          : [];

        console.log("Scrap Types for scrapper:", item.name, scrapTypes); // Debugging log

        return {
          id: item.id?.toString() || "",
          name: item.name || "Unknown Scrapper",
          address: item.address || "",
          rating: Number(item.rating) || 0,
          pincode: item.pincode?.toString() || "",
          services: Array.isArray(item.services) ? item.services : [],
          scrapTypes, // Combined scrap types and prices
          type: item.type || undefined,
        };
      });

      console.log("Formatted scrappers:", formattedScrappers); // Debugging log

      if (formattedScrappers.length === 0) {
        toast.info("No scrappers found in this area");
        return;
      }

      setScrappers(formattedScrappers);
      toast.success(`Found ${formattedScrappers.length} scrappers nearby`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error instanceof Error ? error.message : "Search failed");
      setScrappers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && pincode.length === 6) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2 max-w-md mx-auto">
        <Input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={handleKeyDown}
          placeholder="Enter 6-digit pincode"
          maxLength={6}
          className="scrap-input"
          aria-label="Pincode"
          disabled={loading}
        />
        <Button
          onClick={handleSearch}
          disabled={loading || pincode.length !== 6}
          className="scrap-btn-primary"
          type="button"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2 h-4 w-4" />
              Searching...
            </>
          ) : (
            "Find Scrappers"
          )}
        </Button>
      </div>

      {scrappers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scrappers.map((scrapper) => (
            <div
              key={scrapper.id}
              className="scrap-card hover-lift"
              onClick={() => onSelectScrapper?.(scrapper)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{scrapper.name}</h3>
                <div className="flex items-center gap-1">
                  <Star
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                  />
                  <span className="font-medium">
                    {scrapper.rating.toFixed(1)}/5
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                {scrapper.address}
              </p>

              {/* Display scrap types and prices */}
              <div className="mt-4">
                <h4 className="font-medium text-sm">Scrap Types & Prices:</h4>
                {scrapper.scrapTypes.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {scrapper.scrapTypes.map((scrap, index) => (
                      <li
                        key={scrap.type || index}
                        className="text-sm flex justify-between"
                      >
                        <span className="capitalize">
                          {scrap.type || "Unknown Type"}
                        </span>
                        <span className="font-medium text-green-600">
                          ₹{(scrap.price ?? 0).toFixed(2)} / kg
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No scrap types available.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrapperSearch;