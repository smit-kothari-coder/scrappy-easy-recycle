import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";

type ScrapperHistory = {
  id: string;
  type: string;
  weight: number;
  address: string;
  status: string;
  pincode: string;
  date: string;
  time_slot: string;
};

const ScrapperHistory = () => {
  const [requests, setRequests] = useState<ScrapperHistory[]>([]);
  const [scrapperPincode, setScrapperPincode] = useState<string | null>(null);
  const { getCurrentUser, getScrapper, acceptPickup, rejectPickup } =
    useSupabase();

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const scrapper = await getScrapper(user.email!);
      if (!scrapper) return;

      setScrapperPincode(scrapper.pincode.toString());
    };

    init();
  }, [getCurrentUser, getScrapper]);

  useEffect(() => {
    if (!scrapperPincode) return;

    fetchRequests();

    const channel = supabase
      .channel("pickups-requested")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pickups",
        },
        (payload) => {
          console.log("Realtime pickup event:", payload);
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scrapperPincode]);

  const fetchRequests = async () => {
    if (!scrapperPincode) return;

    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("pickups")
      .select("*")
      .in("status", ["Completed","Rejected"])
      .eq("pincode", scrapperPincode)
      .eq("scrapper_id", user.id);

    if (error) {
      console.error("Error fetching pickup requests:", error.message);
    } else {
      setRequests(data || []);
    }
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 && (
        <p className="text-center text-gray-500">
          No pickup requests in your area.
        </p>
      )}
      {requests.map((req) => (
        <Card key={req.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              Pickup Request #{req.id.slice(0, 6)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Type:</strong> {req.type}
            </p>
            <p>
              <strong>Weight:</strong> {req.weight} kg
            </p>
            <p>
              <strong>Address:</strong> {req.address}
            </p>
            <p>
              <strong>Date:</strong> {req.date}
            </p>
            <p>
              <strong>Time Slot:</strong> {req.time_slot}
            </p>
            <p>
              <strong>Status:</strong> {req.status}
            </p>
            
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScrapperHistory;
