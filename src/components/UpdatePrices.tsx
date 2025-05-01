import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

const UpdatePrices = () => {
  const { user } = useAuth();
  const { getScrapper, updateScrapper } = useSupabase();

  const [scrapTypes, setScrapTypes] = useState<string[]>([]);  // State for scrap types
  const [prices, setPrices] = useState<{ [key: string]: string }>({}); // State for prices
  const [previousPrices, setPreviousPrices] = useState<{ [key: string]: string }>({}); // State for previous prices

  // Use effect to fetch scrap types and prices when component mounts
  useEffect(() => {
    const fetchScrapTypes = async () => {
      if (user) {
        try {
          const scrapperData = await getScrapper(user.email!);

          // Ensure scrap_types is always an array (split string if necessary)
          const types = Array.isArray(scrapperData.scrap_types)
            ? scrapperData.scrap_types
            : (scrapperData.scrap_types as string)?.split(",") || [];

          setScrapTypes(types);

          // Initialize prices with existing data or empty strings
          const initialPrices = types.reduce((acc, type) => {
            acc[type] = scrapperData.scrap_prices?.[type] !== undefined ? String(scrapperData.scrap_prices[type]) : "";  // Convert to string or default to empty string
            return acc;
          }, {} as { [key: string]: string });

          // Initialize previousPrices with existing prices
          setPreviousPrices(initialPrices);

          // Only update prices if they are not already set (to prevent resetting on every render)
          if (Object.keys(prices).length === 0) {
            setPrices(initialPrices); // Set the initial prices in state only if prices is empty
          }
        } catch (error) {
          console.error("Error fetching scrapper data:", error);
          toast.error("Failed to load scrap types and prices. Please try again.");
        }
      }
    };

    fetchScrapTypes();
  }, [user, getScrapper, prices]); // Include 'prices' in dependencies to prevent resetting

  // Handle change in price for each scrap type
  const handlePriceChange = (type: string, value: string) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [type]: value, // Update the price for the specific scrap type
    }));
  };

  // Submit updated prices to the backend
  const handleSubmit = async () => {
    if (Object.keys(prices).length === 0) {
      toast.error("No scrap types available to update.");
      return;
    }
  
    try {
      // Log the data being submitted for debugging
      const updatedPrices = Object.fromEntries(
        Object.entries(prices).map(([key, value]) => [key, parseFloat(value) || 0])
      );
  
      console.log("Updated Prices:", updatedPrices); // Log prices to check the format
  
      const { error } = await updateScrapper(user.email!, { scrap_prices: updatedPrices });
  
      if (error) {
        console.error("Error updating prices:", error); // Log any error details for debugging
        throw error;
      }
  
      toast.success("Prices updated successfully!");
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error("Failed to update prices. Please try again.");
    }
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Scrap Prices
          <p className="text-sm text-gray-500"><strong>Update the prices for each scrap type.</strong></p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scrapTypes.length > 0 ? (
          scrapTypes.map((type) => (
            <div key={type} className="flex items-center gap-4">
              <p className="w-24 font-medium">{type}</p>
              {/* Display Previous Price */}
              <p className="w-24 text-gray-500">{previousPrices[type] || "N/A"}</p>  {/* Previous Price */}
              {/* Input for New Price */}
              <Input
                placeholder="Enter price per kg"
                type="number"
                value={prices[type] || ""}  // Bind value to prices
                onChange={(e) => handlePriceChange(type, e.target.value)}  // Update price on change
                className="w-48"
              />
            </div>
          ))
        ) : (
          <p>No scrap types available to update.</p>
        )}
        <Button onClick={handleSubmit} className="bg-green-600 text-white mt-4">
          Save Prices
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdatePrices;
