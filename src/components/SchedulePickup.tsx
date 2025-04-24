import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';
import WasteTypeSelector from './WasteTypeSelector';
import { useAuth } from '@/hooks/useAuth';

const pickupSchema = z.object({
  weight: z.coerce.number().min(7, { message: "Minimum 7kg required for pickup." }),
  address: z.string().min(10, { message: "Please enter a complete address." }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time_slot: z.string().min(1, { message: "Please select a time slot." }),
  type: z.array(z.string()).min(1, { message: "Please select at least one waste type." }),
});

type PickupFormValues = z.infer<typeof pickupSchema>;

const timeSlots = [
  "Morning (8AM - 11AM)",
  "Afternoon (12PM - 3PM)",
  "Evening (4PM - 7PM)",
];

const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
  if (!selectedDate) return timeSlots;

  const today = new Date();
  const isToday = selectedDate.getDate() === today.getDate() &&
                  selectedDate.getMonth() === today.getMonth() &&
                  selectedDate.getFullYear() === today.getFullYear();

  if (!isToday) return timeSlots;

  const currentHour = today.getHours();
  
  return timeSlots.filter(slot => {
    const slotHour = parseInt(slot.match(/\d+/)?.[0] || "0");
    const isPM = slot.includes("PM");
    const hour24 = isPM && slotHour !== 12 ? slotHour + 12 : slotHour;

    // Allow booking if current time is at least 2 hours before the slot
    return currentHour + 2 < hour24;
  });
};

const SchedulePickup = () => {
  const { user } = useAuth();
  const { createPickupRequest } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      weight: 0,
      address: '',
      date: undefined,
      time_slot: '',
      type: [],
    },
  });

  const onSubmit = async (data: PickupFormValues) => {
    if (!user) {
      toast.error("You must be logged in to schedule a pickup");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting form data:', data);
      
      const result = await createPickupRequest({
        user_id: user.id,
        weight: data.weight,
        address: data.address,
        date: format(data.date, 'yyyy-MM-dd'),
        time_slot: data.time_slot,
        type: data.type,
      });
      
      console.log('Pickup request created:', result);
      toast.success("Pickup scheduled successfully!");
      form.reset();
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      toast.error(error instanceof Error ? error.message : "Failed to schedule pickup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-scrap-blue">Schedule a Pickup</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Waste Weight (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter waste weight" 
                    {...field} 
                    min={7}
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
                {field.value < 7 && field.value > 0 && (
                  <p className="text-amber-500 text-sm mt-1">
                    Minimum 7kg required for pickup.
                  </p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Pickup Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter full address" 
                    {...field} 
                    className="bg-gray-50 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-medium">Preferred Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-200 bg-gray-50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        // Get current date with time set to midnight
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // Get the selected date with time set to midnight
                        const selectedDate = new Date(date);
                        selectedDate.setHours(0, 0, 0, 0);

                        // Get current time
                        const currentHour = new Date().getHours();

                        // If it's the current date, check if it's too late for today's slots
                        if (selectedDate.getTime() === today.getTime()) {
                          // If it's after 4 PM (16:00), disable today
                          return currentHour >= 16;
                        }

                        // Disable past dates and dates more than 30 days in the future
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setDate(today.getDate() + 30);
                        
                        return date < today || date > thirtyDaysFromNow;
                      }}
                      initialFocus
                      fromDate={new Date()} // Set minimum date to today
                      toDate={new Date(new Date().setDate(new Date().getDate() + 30))} // Set maximum date to 30 days from now
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time_slot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Preferred Time</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!form.watch('date')} // Disable if no date is selected
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getAvailableTimeSlots(form.watch('date')).map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {!form.watch('date') && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Please select a date first
                  </p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Waste Types</FormLabel>
                <FormControl>
                  <WasteTypeSelector 
                    value={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-scrap-green hover:bg-scrap-green/90 mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Pickup"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SchedulePickup;
