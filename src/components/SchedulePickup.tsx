import { useState, useEffect } from 'react';
import { string, z } from 'zod';
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
import { ScrapperSearch } from '@/components/ScrapperSearch';

const pickupSchema = z.object({
  weight: z.coerce.number().min(7, { message: "Minimum 7kg required for pickup." }),
  streetAddress: z.string().min(10, { message: "Please enter a complete street address." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Please enter a valid 6-digit pincode" }),
  date: z.date({ required_error: "Please select a date." }),
  time_slot: z.string().min(1, { message: "Please select a time slot." }),
  type: z.array(z.string()).min(1, { message: "Please select at least one waste type." }),
});

type PickupFormValues = z.infer<typeof pickupSchema>;

const timeSlots = [
  "Morning (8AM - 11AM)",
  "Afternoon (12PM - 3PM)",
  "Evening (4PM - 7PM)",
];

const timeSlotMap = {
  "Morning (8AM - 11AM)": { start: "08:00:00", end: "11:00:00" },
  "Afternoon (12PM - 3PM)": { start: "12:00:00", end: "15:00:00" },
  "Evening (4PM - 7PM)": { start: "16:00:00", end: "19:00:00" },
};

export const getLatLongFromAddress = async () => {

  let latitude = 0;
  let longitude = 0;

  if (navigator.geolocation) {


    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // Use latitude and longitude as needed
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
      },
      async function (error) {
        // Handle errors
        console.error("Error getting location:", error);
      }
    );
  } else {
    // Geolocation is not supported
    console.log("Geolocation is not supported by this browser.");
  }
  return { latitude, longitude };

};
const SchedulePickup = () => {


  const { user } = useAuth();
  const { createPickupRequest } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrapperSearch, setShowScrapperSearch] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      weight: 0,
      streetAddress: '',
      pincode: '',
      date: undefined,
      time_slot: '',
      type: [],
    },
  });

  const currentPincode = form.watch('pincode');

  useEffect(() => {
    if (searchTriggered && !currentPincode) {
      setShowScrapperSearch(false);
      setSearchTriggered(false);
    }
  }, [currentPincode, searchTriggered]);

  const onSubmit = async (data: PickupFormValues) => {
    if (!user) {
      toast.error("You must be logged in to schedule a pickup");
      return;
    }

    const timeDetails = timeSlotMap[data.time_slot as keyof typeof timeSlotMap];
    // timeDetails = {start:"abc", end:"xyz"}; // Reset timeDetails to avoid undefined error
    const fullAddress = `${data.streetAddress}, ${data.pincode}`;

    if (!timeDetails) {
      toast.error("Invalid time slot selection");
      return;
    }

    const { latitude, longitude } = await getLatLongFromAddress();


    setIsSubmitting(true);
    try {
      await createPickupRequest({
        user_id: user.id,
        weight: Number(data.weight),
        address: data.streetAddress,
        date: format(data.date, 'yyyy-MM-dd'),
        time_slot: timeDetails,
        type: data.type.toString(),
        pincode: data.pincode,
        latitude: latitude,
        longitude: longitude,
      });

      toast.success("Pickup scheduled successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Failed to schedule pickup. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrapperSearch = () => {
    if (!form.getValues('pincode')) {
      form.setError('pincode', { message: 'Enter pincode to search scrappers' });
      return;
    }
    if (form.formState.errors.pincode) return;

    setSearchTriggered(true);
    setShowScrapperSearch(true);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
      <section>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter street address"
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
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Pincode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit pincode"
                      {...field}
                      maxLength={6}
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
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal border-gray-200 bg-gray-50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
      </section>

      <section className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Find Nearby Scrappers</h3>
          <Button
            onClick={handleScrapperSearch}
            className="bg-scrap-blue hover:bg-scrap-blue/90"
            disabled={!currentPincode || !!form.formState.errors.pincode || isSubmitting}
            variant="outline"
          >
            {isSubmitting ? "Searching..." : (showScrapperSearch ? "Refresh Results" : "Search Scrappers")}
          </Button>
        </div>

        {form.formState.errors.pincode?.message && searchTriggered && (
          <div className="text-red-500 text-sm mb-4">
            {form.formState.errors.pincode.message}
          </div>
        )}

        {showScrapperSearch ? (
          <ScrapperSearch
            key={currentPincode}
            selectedPincode={currentPincode}
            onSelectScrapper={(scrapper) => {
              toast.success(`Scrapper ${scrapper.name} assigned!`);
              setShowScrapperSearch(false);
            }}
          />
        ) : (
          <div className="text-gray-500 text-center py-4">
            {currentPincode
              ? "Click 'Search Scrappers' to view available partners"
              : "Enter a pincode to search for scrappers"}
          </div>
        )}
      </section>
    </div>
  );
};

export default SchedulePickup;