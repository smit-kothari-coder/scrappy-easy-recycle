import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Leaf } from "lucide-react";

const ScrapperOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="w-5 h-5 text-green-600" /> Vehicle Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">Vehicle Type: <strong>Mini Truck</strong></p>
          <p className="text-sm text-gray-700">Registered No: <strong>GJ01AB1234</strong></p>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-green-600" /> Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">Available: <strong>9:00 AM - 9:00 PM</strong></p>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-5 h-5 text-green-600" /> Scrap Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["Plastic", "Glass", "Metal", "E-Waste"].map(type => (
              <Badge key={type} className="bg-green-100 text-green-800 border">{type}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapperOverview;
