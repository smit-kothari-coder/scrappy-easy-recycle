
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Check, MapPin, Star } from 'lucide-react';

type Step = 'form' | 'map' | 'confirmation';

const SchedulePickup = () => {
  const [step, setStep] = useState<Step>('form');
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [selectedScrapper, setSelectedScrapper] = useState<number | null>(null);
  
  const scrappers = [
    { id: 1, name: 'Scrapper 1', distance: '2 km', rating: 4.8 },
    { id: 2, name: 'Scrapper 2', distance: '3.5 km', rating: 4.5 },
    { id: 3, name: 'Scrapper 3', distance: '1.7 km', rating: 4.2 },
  ];
  
  const calculatePrice = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) return 0;
    
    const prices = {
      metal: 10,
      paper: 5,
      plastic: 8
    };
    
    return weightNum * (prices[type as keyof typeof prices] || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(weight) < 7) {
      toast.error("Weight must be greater than 7 kg");
      return;
    }
    if (!address) {
      toast.error("Please enter your address");
      return;
    }
    if (!type) {
      toast.error("Please select a waste type");
      return;
    }
    if (!timeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setStep('map');
  };

  const handleSelectScrapper = (scrapperID: number) => {
    setSelectedScrapper(scrapperID);
  };

  const handleConfirmPickup = () => {
    const scrapper = scrappers.find(s => s.id === selectedScrapper);
    toast.success("Pickup scheduled successfully!");
    setStep('confirmation');
  };

  const handleStartOver = () => {
    setStep('form');
    setSelectedScrapper(null);
    setWeight('');
    setType('');
    setTimeSlot('');
    setAddress('');
  };

  if (step === 'form') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
            min="7"
            className="text-base"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Must be greater than 7 kg</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select waste type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metal">Metal (₹10/kg)</SelectItem>
              <SelectItem value="paper">Paper (₹5/kg)</SelectItem>
              <SelectItem value="plastic">Plastic (₹8/kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date/Time</label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tomorrow-morning">Tomorrow - Morning (9 AM - 12 PM)</SelectItem>
              <SelectItem value="tomorrow-afternoon">Tomorrow - Afternoon (2 PM - 5 PM)</SelectItem>
              <SelectItem value="tomorrow-evening">Tomorrow - Evening (6 PM - 9 PM)</SelectItem>
              <SelectItem value="day-after-morning">Day After - Morning (9 AM - 12 PM)</SelectItem>
              <SelectItem value="day-after-afternoon">Day After - Afternoon (2 PM - 5 PM)</SelectItem>
              <SelectItem value="day-after-evening">Day After - Evening (6 PM - 9 PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input 
            placeholder="Enter pickup address" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-base"
            required 
          />
        </div>

        {weight && type && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-700">Estimated Price: ₹{calculatePrice()}</p>
          </div>
        )}

        <Button type="submit" className="w-full">
          Find Scrappers
        </Button>
      </form>
    );
  } else if (step === 'map') {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 rounded-lg w-full aspect-video flex items-center justify-center">
          <p className="text-gray-500">Map View (Google Maps API required)</p>
        </div>

        <div className="grid gap-4">
          <h3 className="text-xl font-medium">Available Scrappers</h3>
          {scrappers.map((scrapper) => (
            <Card key={scrapper.id} className={selectedScrapper === scrapper.id ? "border-2 border-green-500" : ""}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{scrapper.name}</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{scrapper.distance}</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-500">{scrapper.rating}</span>
                  </div>
                </div>
                <Button
                  variant={selectedScrapper === scrapper.id ? "default" : "outline"}
                  onClick={() => handleSelectScrapper(scrapper.id)}
                >
                  {selectedScrapper === scrapper.id ? (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="w-full" onClick={() => setStep('form')}>
            Back
          </Button>
          <Button 
            className="w-full" 
            disabled={selectedScrapper === null}
            onClick={handleConfirmPickup}
          >
            Confirm Pickup
          </Button>
        </div>
      </div>
    );
  } else {
    // Confirmation step
    const scrapper = scrappers.find(s => s.id === selectedScrapper);
    
    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Pickup Scheduled!</h3>
          
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <p className="font-medium">{scrapper?.name}</p>
            <p className="text-gray-500">ETA: ~25 minutes</p>
            <p className="text-gray-500">Phone: +91 98765 43210</p>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Weight: {weight} kg of {type}</p>
            <p>Price: ₹{calculatePrice()}</p>
            <p>Address: {address}</p>
            <p>Time Slot: {timeSlot.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</p>
          </div>
        </div>
        
        <Button onClick={handleStartOver} className="w-full">
          Schedule Another Pickup
        </Button>
      </div>
    );
  }
};

export default SchedulePickup;
