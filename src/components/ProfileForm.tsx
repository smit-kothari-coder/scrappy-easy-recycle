
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import WasteTypeSelector from './WasteTypeSelector';

const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().optional().refine(val => !val || val.length >= 6, {
    message: "Password must be at least 6 characters if provided",
  }),
});

const userSchema = baseSchema.extend({
  address: z.string().min(5, "Address must be at least 5 characters"),
});

const scrapperSchema = baseSchema.extend({
  vehicleType: z.string().min(1, "Please select a vehicle type"),
  hours: z.string().min(1, "Please enter your working hours"),
  scrapTypes: z.array(z.string()).min(1, "Please select at least one scrap type"),
});

type BaseFormData = z.infer<typeof baseSchema>;
type UserFormData = z.infer<typeof userSchema>;
type ScrapperFormData = z.infer<typeof scrapperSchema>;

interface ProfileFormProps {
  type: 'user' | 'scrapper';
  initialData?: Partial<UserFormData | ScrapperFormData>;
  onSubmit: (data: UserFormData | ScrapperFormData) => Promise<void>;
}

export function ProfileForm({ type, initialData, onSubmit }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = type === 'user' ? userSchema : scrapperSchema;
  const form = useForm<UserFormData | ScrapperFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      ...(type === 'user' ? { address: '' } : {}),
      ...(type === 'scrapper' ? { 
        vehicleType: '',
        hours: '',
        scrapTypes: []
      } : {}),
      ...initialData,
    },
  });

  // Update form when initial data changes (e.g., after data is loaded)
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as any, value);
        }
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: UserFormData | ScrapperFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="scrap-container">
        <div className="mb-6">
          <Link 
            to={type === 'user' ? '/user-dashboard' : '/scrapper-dashboard'} 
            className="inline-flex items-center text-scrap-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="scrap-heading">Edit Profile</h1>
        
        <div className="scrap-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />

              {type === 'user' && (
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="scrap-label">Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your address" className="scrap-input" {...field} />
                      </FormControl>
                      <FormMessage className="scrap-error" />
                    </FormItem>
                  )}
                />
              )}

              {type === 'scrapper' && (
                <>
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="scrap-input">
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bike">Bike</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="truck">Small Truck</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="scrap-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Working Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 9 AM - 5 PM" className="scrap-input" {...field} />
                        </FormControl>
                        <FormMessage className="scrap-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scrapTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Scrap Types You Collect</FormLabel>
                        <FormControl>
                          <WasteTypeSelector 
                            value={field.value} 
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="scrap-error" />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter new password (leave blank to keep current)" 
                        className="scrap-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit"
                className="scrap-btn-primary mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
