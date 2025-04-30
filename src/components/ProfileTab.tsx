import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Select from "react-select";

const scrapTypeOptions = [
  { label: "Paper", value: "paper" },
  { label: "Plastic", value: "plastic" },
  { label: "Metal", value: "metal" },
  { label: "Glass", value: "glass" },
  { label: "Rubber", value: "rubber" },
  { label: "Textiles", value: "textiles" },
  { label: "Organic", value: "organic" },
  { label: "eWaste", value: "eWaste" },
  { label: "Other", value: "other" },
];

const ProfileTab = () => {
  const { user } = useAuth();
  const { getScrapper, updateScrapper } = useSupabase();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getScrapper(user.email);
        setProfile(data);
      } catch (error) {
        toast.error("Error fetching profile");
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        ...profile,
        scrap_types: profile.scrap_types.map((type: any) => type.value),
      };
      await updateScrapper(profile.id, updatedProfile);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Email</label>
        <input
          name="email"
          value={profile.email || ""}
          disabled
          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block font-medium">Phone</label>
        <input
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Vehicle Type</label>
        <input
          name="vehicle_type"
          value={profile.vehicle_type || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Availability Hours</label>
        <input
          name="availability_hours"
          value={profile.availability_hours || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Scrap Types</label>
        <Select
          isMulti
          isDisabled={!isEditing}
          name="scrap_types"
          options={scrapTypeOptions}
          value={(typeof profile.scrap_types === "string"
            ? profile.scrap_types.split(",").map((type: string) => {
                const trimmed = type.trim();
                return (
                  scrapTypeOptions.find((opt) => opt.value === trimmed) || {
                    label: trimmed,
                    value: trimmed,
                  }
                );
              })
            : profile.scrap_types) || []}
          onChange={(selected) =>
            setProfile({ ...profile, scrap_types: selected })
          }
        />
      </div>

      <div className="flex gap-4 mt-4">
        {!isEditing ? (
          <Button
            className="bg-green-600 text-white"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button className="bg-blue-600 text-white" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;

