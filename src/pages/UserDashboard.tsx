import { User, Map, History, Gift, LogOut, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateRecyclingImpact } from "@/lib/conversions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AppUser, ScrapType } from "@/types";
import PickupHistory from "@/components/PickupHistory";
import SchedulePickup from "@/components/SchedulePickup";
import ScrapperSearch from "@/components/ScrapperSearch";

const UserDashboard = () => {
  const { signOut, user } = useAuth();
  const appUser = user as unknown as AppUser;

  const totalKg = appUser.scrapKg || 0;
  const types = appUser.scrapType || [];
  const weightPerType = types.length > 0 ? totalKg / types.length : 0;

  const totalImpact = types.reduce(
    (acc, type) => {
      const impact = calculateRecyclingImpact(weightPerType, type as ScrapType);
      return {
        treesSaved: acc.treesSaved + impact.treesSaved,
        co2Reduction: acc.co2Reduction + impact.co2Reduction,
        energySaved: acc.energySaved + impact.energySaved,
      };
    },
    { treesSaved: 0, co2Reduction: 0, energySaved: 0 }
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
          User Dashboard
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mb-6">
          <Link to="/profile" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex justify-center items-center gap-2 text-base transition hover:scale-105"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
          <Link to="/faq" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex justify-center items-center gap-2 text-base transition hover:scale-105"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto flex justify-center items-center gap-2 text-base text-red-600 hover:bg-red-50 transition hover:scale-105"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 w-full mb-4">
            <TabsTrigger
              value="schedule"
              className="text-sm sm:text-base px-4 py-2 rounded-md data-[state=active]:bg-green-100 data-[state=active]:text-green-800 text-center flex-1 sm:flex-none min-w-[140px]"
            >
              Schedule Pickup
            </TabsTrigger>
            <TabsTrigger
              value="find"
              className="text-sm sm:text-base px-4 py-2 rounded-md data-[state=active]:bg-green-100 data-[state=active]:text-green-800 text-center flex-1 sm:flex-none min-w-[140px]"
            >
              Nearby Scrappers
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-sm sm:text-base px-4 py-2 rounded-md data-[state=active]:bg-green-100 data-[state=active]:text-green-800 text-center flex-1 sm:flex-none min-w-[140px]"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="impact"
              className="text-sm sm:text-base px-4 py-2 rounded-md data-[state=active]:bg-green-100 data-[state=active]:text-green-800 text-center flex-1 sm:flex-none min-w-[140px]"
            >
              Impact
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Schedule a Pickup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SchedulePickup />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Pickup History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PickupHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="find">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Nearby Scrappers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrapperSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  🌳 Trees Saved: {totalImpact.treesSaved}
                </p>
                <p className="text-base text-gray-700">
                  💨 CO₂ Reduced: {totalImpact.co2Reduction.toFixed(2)} kg
                </p>
                <p className="text-base text-gray-700">
                  ⚡ Energy Saved: {totalImpact.energySaved.toFixed(2)} kWh
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
