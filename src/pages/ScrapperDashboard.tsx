
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
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from '@/hooks/useSupabase';
import type { Pickup, Scrapper } from '@/types';

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
        // In a real app, we would get the email from auth
        const scrapperData = await getScrapper(mockEmail);
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
  }, []);
  
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
      <div className="scrap-container">
        <h1 className="scrap-heading">Scrapper Dashboard</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <p className="font-medium">Availability:</p>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={toggleAvailability} 
              className="scale-125"
            />
            <span className={isAvailable ? "text-green-600" : "text-gray-500"}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          
          <div className="flex gap-4">
            <Link to="/scrapper-profile">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </Link>
          </div>
        </div>

        {showRequests ? (
          <Card>
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
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{request.profiles?.name || "User"}</h3>
                            <p className="text-gray-500">{request.time_slot} - {request.date}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <p className="text-sm">{request.address}</p>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">{request.weight} kg</span> of {request.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="w-1/2" 
                            onClick={() => handleAccept(request)}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-1/2 text-red-600 border-red-300 hover:bg-red-50" 
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
                  <p>No requests available</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Pickup Details</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
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
                          <h3 className="font-medium">{activePickup?.profiles?.name || "User"}</h3>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <p className="text-sm">{activePickup?.time_slot || "Morning"} - {activePickup?.date || "Today"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <p>{activePickup?.address || "Address not available"}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <PhoneCall className="w-4 h-4 text-green-500" />
                          <p>{activePickup?.profiles?.phone || "Phone not available"}</p>
                        </div>
                        <p>
                          <span className="font-medium">{activePickup?.weight || 0} kg</span> of {activePickup?.type || "waste"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        ETA: 10 minutes
                      </h3>
                      <p className="text-sm text-gray-600">Distance: 3.2 km</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button
                        className={activePickupStatus === 'En Route' ? 'bg-blue-600' : ''}
                        onClick={() => updateStatus('En Route')}
                      >
                        En Route
                      </Button>
                      <Button
                        className={activePickupStatus === 'Arrived' ? 'bg-blue-600' : ''}
                        onClick={() => updateStatus('Arrived')}
                      >
                        Arrived
                      </Button>
                      <Button
                        className={activePickupStatus === 'Completed' ? 'bg-green-600' : ''}
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
                    <div className="bg-gray-200 rounded-lg w-full aspect-video flex items-center justify-center">
                      <p className="text-gray-500">Map View (Google Maps API integration required)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        Destination: {activePickup?.address || "Address not available"}
                      </h3>
                      <p className="text-sm text-gray-600">ETA: 10 minutes • 3.2 km</p>
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
