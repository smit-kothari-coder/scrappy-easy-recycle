
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { AuthHeader } from '@/components/AuthHeader';
import { FormDivider } from '@/components/FormDivider';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';

const indianCities = [
  "Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", 
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow"
];

const vehicleTypes = [
  "Bicycle", "Motorcycle", "Auto Rickshaw", "Small Truck", "Large Truck"
];

// Create schema based on role
// Define our schema types for better TypeScript support
type BaseFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
};

type ScrapperFormValues = BaseFormValues & {
  vehicleType: string;
  workingHours: string;
};

// Union type for our form
type FormValues = BaseFormValues | ScrapperFormValues;

const createSignUpSchema = (role: string) => {
  const baseSchema = {
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    city: z.string().min(1, "Please select a city"),
  };

  if (role === "scrapper") {
    return z.object({
      ...baseSchema,
      vehicleType: z.string().min(1, "Please select a vehicle type"),
      workingHours: z.string().min(1, "Please specify your working hours"),
    }).refine(data => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }

  return z.object(baseSchema).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
};

const SignUpPage = () => {
  const [role, setRole] = useState<'user' | 'scrapper'>('user');
  const navigate = useNavigate();
  const schema = createSignUpSchema(role);

  const form = useForm<ScrapperFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      city: '',
      vehicleType: '',
      workingHours: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Sign-up data:', data);
    
    // In a real app, this would send the data to an API
    // For now, we'll simulate success and redirect
    setTimeout(() => {
      const redirectPath = role === 'user' ? '/user-dashboard' : '/scrapper-dashboard';
      navigate(redirectPath);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="scrap-container">
        <AuthHeader />
        
        <div className="scrap-card">
          <h1 className="scrap-heading text-center mb-6">
            Create Your Account
          </h1>

          {/* Role selection */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              type="button" 
              onClick={() => setRole('user')}
              className={`flex-1 py-3 text-lg ${role === 'user' ? 'bg-scrap-green hover:bg-scrap-green/90' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              I need recycling
            </Button>
            <Button 
              type="button" 
              onClick={() => setRole('scrapper')}
              className={`flex-1 py-3 text-lg ${role === 'scrapper' ? 'bg-scrap-green hover:bg-scrap-green/90' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              I'm a scrapper
            </Button>
          </div>

          <GoogleAuthButton type="signup" className="mb-4" />
          <FormDivider />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="10-digit mobile number" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">City</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="scrap-input">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />

              {role === 'scrapper' && (
                <>
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Vehicle Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="scrap-input">
                              <SelectValue placeholder="Select your vehicle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleTypes.map((vehicle) => (
                              <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="scrap-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Working Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 9 AM - 6 PM" className="scrap-input" {...field} />
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
                      <Input type="password" placeholder="Create a password" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full scrap-btn-primary mt-6"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-scrap-blue hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
