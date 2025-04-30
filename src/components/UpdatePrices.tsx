import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

const UpdatePrices = () => {
  const { user } = useAuth(); // Get current user from authentication hook
  const { getScrapper } = useSupabase(); // Get scrapper details from Supabase
  const [scrapTypes, setScrapTypes] = useState<string[]>([]); // State to store scrap types
  const [prices, setPrices] = useState<{ [key: string]: string }>({}); // State to store prices

  // Fetch scrap types from the scrapper profile on component mount
  useEffect(() => {
    const fetchScrapTypes = async () => {
      if (user) {
        try {
          const scrapperData = await getScrapper(user.email!);
          // Ensure scrap_types is an array (even if it's a string in the database)
          const types = Array.isArray(scrapperData.scrap_types)
            ? scrapperData.scrap_types
            : scrapperData.scrap_types.split(","); // If it's a comma-separated string
          setScrapTypes(types);
          // Initialize the prices state based on the fetched scrap types
          const initialPrices = types.reduce((acc, type) => {
            acc[type] = ""; // Initialize empty string for each scrap type
            return acc;
          }, {} as { [key: string]: string });
          setPrices(initialPrices);
        } catch (error) {
          console.error("Error fetching scrapper data:", error);
          toast.error("Failed to load scrap types. Please try again.");
        }
      }
    };

    fetchScrapTypes();
  }, [user, getScrapper]);

  // Handle price change for each scrap type
  const handleChange = (type: string, value: string) => {
    setPrices((prev) => ({ ...prev, [type]: value }));
  };

  // Handle form submission to save updated prices
  const handleSubmit = async () => {
    if (Object.keys(prices).length === 0) {
      toast.error("No scrap types available to update.");
      return;
    }
    try {
      console.log("Updated Prices:", prices);
      // Here, you can call your backend API or Supabase function to save the updated prices
      toast.success("Prices updated successfully!");
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error("Failed to update prices. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Scrap Prices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render input fields dynamically based on the user's scrap types */}
        {scrapTypes.length > 0 ? (
          scrapTypes.map((type) => (
            <div key={type} className="flex items-center gap-4">
              <p className="w-24 font-medium">{type}</p>
              <Input
                placeholder="Enter price per kg"
                value={prices[type] || ""}
                onChange={(e) => handleChange(type, e.target.value)}
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
