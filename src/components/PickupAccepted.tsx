import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";

type OngoingRequests = {
  id: string;
  type: string;
  weight: number;
  address: string;
  status: string;
  pincode: string;
  date: string;
  time_slot: string;
};

const OngoingRequests = () => {
  const [requests, setRequests] = useState<OngoingRequests[]>([]);
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
      .eq("status", "Accepted")
      .eq("pincode", scrapperPincode)
      .eq("scrapper_id", user.id);

    if (error) {
      console.error("Error fetching pickup requests:", error.message);
    } else {
      setRequests(data || []);
    }
  };

  const handleAccept = async (pickupId: string) => {
    try {
      pickupId = pickupId.replace(" ", "");
      const { error } = await supabase
        .from("pickups") // Replace with your actual table name
        .update({ status: "Completed" }) // Update the status to "Accepted"
        .eq("id", pickupId); // Match the record by pickupId

      if (error) {
        console.error("Error updating pickup status:", error.message);
        console.error("Failed to accept the pickup request.");
        return;
      }
      console.log("Pickup request accepted successfully!");
      fetchRequests(); // Refresh the list of requests
    } catch (err) {
      console.error("Unexpected error accepting pickup request:", err);
      console.error("An unexpected error occurred.");
    }
  };

  const handleReject = async (pickupId: string) => {
    try {
      pickupId = pickupId.replace(" ", "");
      const { error } = await supabase
        .from("pickups") // Replace with your actual table name
        .update({ status: "Rejected" }) // Update the status to "Rejected"
        .eq("id", pickupId); // Match the record by pickupId

      if (error) {
        console.error("Error updating pickup status:", error.message);
        console.error("Failed to reject the pickup request.");
        return;
      }

      console.log("Pickup request rejected successfully!");
      fetchRequests(); // Refresh the list of requests
    } catch (err) {
      console.error("Unexpected error rejecting pickup request:", err);
      console.error("An unexpected error occurred.");
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
            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => handleAccept(req.id)}
                className="bg-green-500 text-white"
              >
                Completed
              </Button>
              <Button
                onClick={() => handleReject(req.id)}
                variant="destructive"
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OngoingRequests;
