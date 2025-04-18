
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  HelpCircle, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Box,
  Navigation,
  Clock,
  PhoneCall
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const ScrapperDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activePickupStatus, setActivePickupStatus] = useState<'en-route' | 'arrived' | 'completed' | null>('en-route');
  
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(`You are now ${!isAvailable ? 'available' : 'unavailable'} for pickups`);
  };
  
  const mockRequests = [
    {
      id: 1,
      user: "Rahul Kumar",
      address: "123 Main St, Jaipur",
      weight: "10",
      type: "Metal",
      time: "Tomorrow Morning",
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      user: "Priya Singh",
      address: "456 Park Ave, Jaipur",
      weight: "15",
      type: "Paper",
      time: "Tomorrow Afternoon",
      phone: "+91 87654 32109"
    }
  ];
  
  const [activePickup, setActivePickup] = useState(mockRequests[0]);
  const [showRequests, setShowRequests] = useState(true);
  
  const handleAccept = (request: any) => {
    setActivePickup(request);
    setShowRequests(false);
    toast.success("Pickup accepted!");
  };
  
  const handleReject = (id: number) => {
    toast.success("Pickup rejected");
  };
  
  const updateStatus = (status: 'en-route' | 'arrived' | 'completed') => {
    setActivePickupStatus(status);
    if (status === 'completed') {
      toast.success("Pickup completed!");
      setTimeout(() => {
        setShowRequests(true);
        setActivePickupStatus(null);
      }, 3000);
    } else {
      toast.success(`Status updated: ${status.replace('-', ' ')}`);
    }
  };
  
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
              {mockRequests.length > 0 ? (
                <div className="space-y-4">
                  {mockRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{request.user}</h3>
                            <p className="text-gray-500">{request.time}</p>
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
                          <h3 className="font-medium">{activePickup.user}</h3>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <p className="text-sm">{activePickup.time}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <p>{activePickup.address}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <PhoneCall className="w-4 h-4 text-green-500" />
                          <p>{activePickup.phone}</p>
                        </div>
                        <p>
                          <span className="font-medium">{activePickup.weight} kg</span> of {activePickup.type}
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
                        className={activePickupStatus === 'en-route' ? 'bg-blue-600' : ''}
                        onClick={() => updateStatus('en-route')}
                      >
                        En Route
                      </Button>
                      <Button
                        className={activePickupStatus === 'arrived' ? 'bg-blue-600' : ''}
                        onClick={() => updateStatus('arrived')}
                      >
                        Arrived
                      </Button>
                      <Button
                        className={activePickupStatus === 'completed' ? 'bg-green-600' : ''}
                        onClick={() => updateStatus('completed')}
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
                      <p className="text-gray-500">Map View (Google Maps API required)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        Destination: {activePickup.address}
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
