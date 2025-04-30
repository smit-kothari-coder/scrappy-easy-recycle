import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dummyRequests = [
  { id: 1, type: "Plastic", quantity: "20kg", address: "123 Street A" },
  { id: 2, type: "E-Waste", quantity: "10kg", address: "456 Road B" },
];

const PickupRequests = () => {
  const handleAccept = (id: number) => {
    console.log("Accepted request:", id);
  };

  const handleReject = (id: number) => {
    console.log("Rejected request:", id);
  };

  return (
    <div className="space-y-4">
      {dummyRequests.map((req) => (
        <Card key={req.id}>
          <CardHeader>
            <CardTitle className="text-lg">Pickup Request #{req.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Type:</strong> {req.type}</p>
            <p><strong>Quantity:</strong> {req.quantity}</p>
            <p><strong>Address:</strong> {req.address}</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => handleAccept(req.id)} className="bg-green-500 text-white">Accept</Button>
              <Button onClick={() => handleReject(req.id)} variant="destructive">Reject</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PickupRequests;
