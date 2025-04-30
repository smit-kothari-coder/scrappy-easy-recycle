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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="scrap-container max-w-[600px] mx-auto">
        <h1 className="scrap-heading text-2xl md:text-3xl">User Dashboard</h1>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mb-6">
          <Link to="/profile">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-base w-full sm:w-auto transition-transform hover:scale-105"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
          <Link to="/faq">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-base w-full sm:w-auto transition-transform hover:scale-105"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-base text-red-600 hover:bg-red-50 w-full sm:w-auto transition-transform hover:scale-105"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-2">
            <TabsTrigger
              value="schedule"
              className="text-base py-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-md transition"
            >
              Schedule Pickup
            </TabsTrigger>
            <TabsTrigger
              value="find"
              className="text-base py-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-md transition"
            >
              Nearby Scrappers
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-base py-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-md transition"
            >
              History
            </TabsTrigger>

            <TabsTrigger
              value="impact"
              className="text-base py-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 rounded-md transition"
            >
              Impact
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="find" className="animate-fade-in">
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
