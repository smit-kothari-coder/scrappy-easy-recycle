
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import WasteTypeSelector from './WasteTypeSelector';
import { Card, CardContent, CardHeader } from './ui/card';

const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().optional(),
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
  initialData?: UserFormData | ScrapperFormData;
  onSubmit: (data: UserFormData | ScrapperFormData) => void;
}

export function ProfileForm({ type, initialData, onSubmit }: ProfileFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = type === 'user' ? userSchema : scrapperSchema;
  const form = useForm<UserFormData | ScrapperFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      password: '',
      ...(type === 'user' ? { address: '' } : { 
        vehicleType: '', 
        hours: '',
        scrapTypes: [] 
      }),
    },
  });

  const handleSubmit = async (data: UserFormData | ScrapperFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
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

        <h1 className="scrap-heading mb-6">Edit Profile</h1>
        
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{type === 'user' ? 'User Profile' : 'Scrapper Profile'}</h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
                
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="scrapTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="scrap-label">Scrap Types Collected</FormLabel>
                          <FormControl>
                            <WasteTypeSelector 
                              value={field.value || []}
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
                  className="scrap-btn-primary w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
