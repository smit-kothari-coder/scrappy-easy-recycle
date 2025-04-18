
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

const SchedulePickup = () => {
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('');
  
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
    // TODO: Implement with Supabase
    toast.success("Pickup scheduled successfully!");
  };

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
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
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
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
            <SelectItem value="afternoon">Afternoon (2 PM - 5 PM)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <Input placeholder="Enter pickup address" required />
      </div>

      {weight && type && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-green-700">Estimated Price: ₹{calculatePrice()}</p>
        </div>
      )}

      <Button type="submit" className="w-full">
        Schedule Pickup
      </Button>
    </form>
  );
};

export default SchedulePickup;
