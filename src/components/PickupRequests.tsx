import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type PickupRequest = {
  id: number;
  type: string;
  quantity: string;
  address: string;
  status: string;
  name: string; // Added name field
};

const PickupRequests = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);

  useEffect(() => {
    fetchRequests();

    // Set up Supabase real-time subscription
    const channel = supabase
      .channel("pickup-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pickup_requests" },
        (payload) => {
          console.log("Realtime event:", payload);
          fetchRequests(); // Refresh list on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("pickup_requests")
      .select("*")
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching requests:", error.message);
    } else {
      setRequests(data || []);
    }
  };

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("pickup_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error.message);
    }
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 && (
        <p className="text-center text-gray-500">No pending requests.</p>
      )}
      {requests.map((req) => (
        <Card key={req.id}>
          <CardHeader>
            <CardTitle className="text-lg">Pickup Request #{req.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {req.name}</p> {/* Display name */}
            <p><strong>Type:</strong> {req.type}</p>
            <p><strong>Quantity:</strong> {req.quantity}</p>
            <p><strong>Address:</strong> {req.address}</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => updateStatus(req.id, "accepted")} className="bg-green-500 text-white">Accept</Button>
              <Button onClick={() => updateStatus(req.id, "rejected")} variant="destructive">Reject</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PickupRequests;
