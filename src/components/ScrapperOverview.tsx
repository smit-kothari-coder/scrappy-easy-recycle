import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Leaf, Package, Weight, ShieldCheck } from "lucide-react";
import { supabase as importedSupabase } from "@/integrations/supabase/client";

const supabase = importedSupabase;

type ScrapperOverviewProps = {
  user: any;
};

const ScrapperOverview: React.FC<ScrapperOverviewProps> = ({ user }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScrapperData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("scrappers")
          .select(
            "vehicle_type, availability_hours, scrap_types,registration_number"
          )
          .eq("email", user.email)
          .single();

        if (error) throw error;

        const scrapTypes = data.scrap_types
          ? Array.isArray(data.scrap_types)
            ? data.scrap_types
            : data.scrap_types.split(",")
          : [];

        setProfile({
          vehicleType: data.vehicle_type || "Not set",
          hours: data.availability_hours || "Not set",
          registrationNumber: data.registration_number || "Not set", // Handle registration_number

          scrapTypes,
        });
      } catch (error) {
        console.error("Error loading scrapper profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapperData();
  }, [user]);

  if (loading || !profile) return <p className="p-6">Loading Dashboard...</p>;

  return (
    <TabsContent value="dashboard">
      <section className="bg-white p-6 rounded-xl shadow-md text-gray-700">
        <h2 className="text-xl font-semibold text-green-700 mb-6">
          <strong>Dashboard Overview</strong>
        </h2>
        <h4 className="text-xl font-semibold text-green-700 mb-6">
          Update the profile if not shon in dashboard section{" "}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Vehicle Info */}
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="w-5 h-5 text-green-600" /> Vehicle Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Vehicle Type: <strong>{profile.vehicleType}</strong>
              </p>
              <p className="text-sm">
                Reg. No: <strong>{profile.registrationNumber}</strong>
              </p>{" "}
              {/* Placeholder */}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-green-600" /> Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Available: <strong>{profile.hours}</strong>
              </p>
            </CardContent>
          </Card>

          {/* Scrap Types */}
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="w-5 h-5 text-green-600" /> Scrap Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.scrapTypes.length > 0 ? (
                  profile.scrapTypes.map((type: string) => (
                    <Badge
                      key={type}
                      className="bg-green-100 text-green-800 border"
                    >
                      {type}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm">No scrap types added</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </TabsContent>
  );
};
export default ScrapperOverview;
