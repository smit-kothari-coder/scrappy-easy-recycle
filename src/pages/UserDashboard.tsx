
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Map, History, Gift } from 'lucide-react';
import SchedulePickup from '@/components/SchedulePickup';
import PickupHistory from '@/components/PickupHistory';
import PointsSection from '@/components/PointsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const UserDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="scrap-container">
        <h1 className="scrap-heading">User Dashboard</h1>
        
        <div className="flex justify-end space-x-4 mb-6">
          <Link to="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
          <Link to="/faq">
            <Button variant="outline" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Help
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule Pickup</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
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
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Points & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PointsSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
