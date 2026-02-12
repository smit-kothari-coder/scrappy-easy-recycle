import { useState, useEffect } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ScrapperProfilePage = () => {
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { getScrapper, updateScrapper } = useSupabase();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.email) {
        toast.error("User not authenticated or email missing.");
        return;
      }

      setIsLoading(true); // Start loading state

      try {
        const profileData = await getScrapper(user.email);

        if (!profileData) {
          toast.error("No profile found.");
          return;
        }

        // Parse scrap_types from string to array if it exists
        const scrapTypes = profileData.scrap_types
          ? Array.isArray(profileData.scrap_types)
            ? profileData.scrap_types
            : typeof profileData.scrap_types === "string"
            ? (profileData.scrap_types as string).split(",")
            : []
          : [];

        setInitialData({
          id: profileData.id || "", // Added fallback for id
          name: profileData.name || "", // Added fallback for name
          email: profileData.email || "", // Added fallback for email
          phone: profileData.phone || "",
          vehicleType: profileData.vehicle_type || "",
          hours: profileData.availability_hours || "",
          scrapTypes: scrapTypes,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Could not load profile data. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading state
      }
    };

    fetchProfile();
  }, [user, getScrapper]);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    const { password, scrapTypes, vehicleType, hours, ...profileData } = data;

    try {
      const result = await updateScrapper(initialData.email, {
        ...profileData,
        vehicle_type: vehicleType,
        availability_hours: hours,
        scrap_types: scrapTypes,
      });

      if (!result || result instanceof Error) {
        console.error(
          "Supabase update error:",
          result instanceof Error ? result.message : "Unknown error"
        );
        toast.error("Failed to update profile. Please try again.");
        return;
      }

      // If password is entered, handle it separately here
      if (password?.trim()) {
        // password update logic here, if any
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <ProfileForm
      type="scrapper"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default ScrapperProfilePage;
