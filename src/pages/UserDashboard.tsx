import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Map, History, Gift, LogOut, HelpCircle, MapPin } from 'lucide-react';
import SchedulePickup from '@/components/SchedulePickup';
import PickupHistory from '@/components/PickupHistory';
import PointsSection from '@/components/PointsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NearbyScrappers from '../components/NearbyScrappers';
import { useAuth } from '@/hooks/useAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    console.log('Current user:', user);
    if (!loading && !user) {
      toast.error('Please sign in to access the dashboard');
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null; // RequireAuth component will handle the redirect
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="scrap-container max-w-[600px] mx-auto">
        <h1 className="scrap-heading text-2xl md:text-3xl">User Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mb-6">
          <Link to="/profile">
            <Button variant="outline" className="flex items-center gap-2 text-base w-full sm:w-auto transition-transform hover:scale-105">
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
          <Link to="/faq">
            <Button variant="outline" className="flex items-center gap-2 text-base w-full sm:w-auto transition-transform hover:scale-105">
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-base text-red-600 hover:bg-red-50 w-full sm:w-auto transition-transform hover:scale-105"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule" className="text-base py-2">Schedule Pickup</TabsTrigger>
            <TabsTrigger value="history" className="text-base py-2">History</TabsTrigger>
            <TabsTrigger value="points" className="text-base py-2">Points</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="animate-fade-in">
            <ErrorBoundary>
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
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Find Nearby Scrappers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NearbyScrappers />
                </CardContent>
              </Card>
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <ErrorBoundary>
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
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="points" className="animate-fade-in">
            <ErrorBoundary>
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
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
