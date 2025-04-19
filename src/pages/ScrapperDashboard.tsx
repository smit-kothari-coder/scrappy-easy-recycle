
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  User, 
  HelpCircle, 
  MapPin, 
  Navigation,
  Clock,
  PhoneCall,
  Box,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from '@/hooks/useSupabase';
import type { Pickup, Scrapper } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// Mock scrapper data for demo purposes
const mockScrapperId = "1";
const mockEmail = "john@scrapeasy.com";

const ScrapperDashboard = () => {
  const { 
    getScrapper, 
    updateScrapper,
    getPickupRequests,
    acceptPickup,
    rejectPickup,
    getActivePickup,
    updatePickupStatus
  } = useSupabase();
  
  const { signOut, user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activePickupStatus, setActivePickupStatus] = useState<'En Route' | 'Arrived' | 'Completed' | null>('En Route');
  const [scrapper, setScrapper] = useState<Scrapper | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [activePickup, setActivePickup] = useState<any>(null);
  const [showRequests, setShowRequests] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch scrapper data and pickup requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current email from auth user
        const email = user?.email || mockEmail;
        
        const scrapperData = await getScrapper(email);
        setScrapper(scrapperData);
        setIsAvailable(scrapperData.available);
        
        // Check if there's an active pickup
        const active = await getActivePickup(scrapperData.id);
        if (active) {
          setActivePickup(active);
          setShowRequests(false);
          setActivePickupStatus(active.status as any);
        }
        
        // Get pickup requests
        const pickupRequests = await getPickupRequests();
        setRequests(pickupRequests);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, getScrapper, getActivePickup, getPickupRequests]);
  
  const toggleAvailability = async () => {
    if (!scrapper) return;
    
    try {
      const updatedScrapper = await updateScrapper(scrapper.id, { available: !isAvailable });
      setIsAvailable(!isAvailable);
      setScrapper(updatedScrapper);
      toast.success(`You are now ${!isAvailable ? 'available' : 'unavailable'} for pickups`);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };
  
  const handleAccept = async (request: any) => {
    if (!scrapper) return;
    
    try {
      const accepted = await acceptPickup(request.id, scrapper.id);
      setActivePickup(accepted);
      setShowRequests(false);
      setActivePickupStatus('En Route');
      toast.success("Pickup accepted!");
    } catch (error) {
      console.error("Error accepting pickup:", error);
      toast.error("Failed to accept pickup");
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await rejectPickup(id);
      setRequests(requests.filter(request => request.id !== id));
      toast.success("Pickup rejected");
    } catch (error) {
      console.error("Error rejecting pickup:", error);
      toast.error("Failed to reject pickup");
    }
  };
  
  const updateStatus = async (status: 'En Route' | 'Arrived' | 'Completed') => {
    if (!activePickup) return;
    
    try {
      await updatePickupStatus(activePickup.id, status);
      setActivePickupStatus(status);
      
      if (status === 'Completed') {
        toast.success("Pickup completed!");
        setTimeout(() => {
          setShowRequests(true);
          setActivePickupStatus(null);
          setActivePickup(null);
        }, 3000);
      } else {
        toast.success(`Status updated: ${status.replace('-', ' ')}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="scrap-container max-w-[600px] mx-auto">
        <h1 className="scrap-heading text-2xl md:text-3xl">Scrapper Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <p className="font-medium text-base">Availability:</p>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={toggleAvailability} 
              className="scale-125"
            />
            <span className={isAvailable ? "text-green-600 text-base" : "text-gray-500 text-base"}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link to="/scrapper-profile">
              <Button variant="outline" className="flex items-center gap-2 text-base transition-transform hover:scale-105">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" className="flex items-center gap-2 text-base transition-transform hover:scale-105">
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-base text-red-600 hover:bg-red-50 transition-transform hover:scale-105" 
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>

        {showRequests ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                Pickup Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-base">{request.users?.name || "User"}</h3>
                            <p className="text-gray-500 text-base">{request.time_slot} - {request.date}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <p className="text-base">{request.address}</p>
                          </div>
                          <div className="flex gap-2 items-center mt-1">
                            <a 
                              href={`https://www.google.com/maps?q=${encodeURIComponent(request.address)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-scrap-blue hover:underline text-sm"
                            >
                              View in Google Maps
                            </a>
                          </div>
                          <p className="text-base">
                            <span className="font-medium">{request.weight} kg</span> of {request.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="w-1/2 text-base transition-transform hover:scale-105" 
                            onClick={() => handleAccept(request)}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-1/2 text-base text-red-600 border-red-300 hover:bg-red-50 transition-transform hover:scale-105" 
                            onClick={() => handleReject(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p className="text-base">No requests available</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="details" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="text-base py-2">Pickup Details</TabsTrigger>
              <TabsTrigger value="navigation" className="text-base py-2">Navigation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="w-5 h-5" />
                    Active Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-base">{activePickup?.users?.name || "User"}</h3>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <p className="text-base">{activePickup?.time_slot || "Morning"} - {activePickup?.date || "Today"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <p className="text-base">{activePickup?.address || "Address not available"}</p>
                        </div>
                        <div className="flex gap-2 items-center mt-1">
                          <a 
                            href={`https://www.google.com/maps?q=${encodeURIComponent(activePickup?.address || '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-scrap-blue hover:underline text-sm"
                          >
                            View in Google Maps
                          </a>
                        </div>
                        <div className="flex gap-2 items-center">
                          <PhoneCall className="w-4 h-4 text-green-500" />
                          <p className="text-base">{activePickup?.users?.phone || "Phone not available"}</p>
                        </div>
                        <p className="text-base">
                          <span className="font-medium">{activePickup?.weight || 0} kg</span> of {activePickup?.type || "waste"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2 text-base">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        ETA: 10 minutes
                      </h3>
                      <p className="text-gray-600 text-base">Distance: 3.2 km</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button
                        className={`${activePickupStatus === 'En Route' ? 'bg-blue-600' : ''} text-base py-3 transition-transform hover:scale-105`}
                        onClick={() => updateStatus('En Route')}
                      >
                        En Route
                      </Button>
                      <Button
                        className={`${activePickupStatus === 'Arrived' ? 'bg-blue-600' : ''} text-base py-3 transition-transform hover:scale-105`}
                        onClick={() => updateStatus('Arrived')}
                      >
                        Arrived
                      </Button>
                      <Button
                        className={`${activePickupStatus === 'Completed' ? 'bg-green-600' : ''} text-base py-3 transition-transform hover:scale-105`}
                        onClick={() => updateStatus('Completed')}
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="navigation">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2 text-base">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        Destination: {activePickup?.address || "Address not available"}
                      </h3>
                      <p className="text-gray-600 text-base">ETA: 10 minutes • 3.2 km</p>
                      
                      <div className="mt-3">
                        <a 
                          href={`https://www.google.com/maps?q=${encodeURIComponent(activePickup?.address || '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white bg-scrap-blue hover:bg-scrap-blue/90 py-2 px-4 rounded-md inline-flex items-center gap-2 transition-transform hover:scale-105"
                        >
                          <Navigation className="w-4 h-4" />
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ScrapperDashboard;
