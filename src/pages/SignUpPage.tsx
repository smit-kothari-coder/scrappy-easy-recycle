import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { AuthHeader } from '@/components/AuthHeader';
import { useAuth } from '@/hooks/useAuth';
import WasteTypeSelector from '@/components/WasteTypeSelector';
import { useSupabase } from '@/hooks/useSupabase';

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
  address: string;
};

type ScrapperFormValues = BaseFormValues & {
  vehicleType: string;
  workingHours: string;
  serviceArea: string;
  scrapTypes: string[];
  latitude: string;
  longitude: string;
  aadharNumber: string;
  panNumber: string;
  aadharImage: File | null;
  panImage: File | null;
};


// Union type for our form
type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  address: string;
} & (
    | { role: 'user' }
    | {
      role: 'scrapper';
      vehicleType: string;
      workingHours: string;
      serviceArea: string;
      scrapTypes: string[];
      latitude?: string;
      longitude?: string;
      aadharNumber: string;
      panNumber: string;
      aadharImage: File | null;
      panImage: File | null;
    }
  );

const createSignUpSchema = (role: 'user' | 'scrapper') => {
  const baseSchema = {
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    city: z.string().min(1, "Please select a city"),
    address: z.string().min(5, "Please enter a valid address"),
  };

  return role === 'scrapper'
    ? z.object({
      ...baseSchema,
      role: z.literal('scrapper'),
      vehicleType: z.string().min(1, "Please select a vehicle type"),
      workingHours: z.string().min(1, "Please specify your working hours"),
      serviceArea: z.string().min(1, "Please specify your service area"),
      scrapTypes: z.array(z.string()).min(1, "Please select at least one scrap type"),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      aadharNumber: z.string().regex(/^\d{12}$/, "Please enter a valid 12-digit Aadhar number"),
      panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"),
      aadharImage: z.instanceof(File).nullable(),
      panImage: z.instanceof(File).nullable(),
    }).refine(data => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    : z.object({
      ...baseSchema,
      role: z.literal('user'),
    }).refine(data => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
};

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('type') === 'scrapper' ? 'scrapper' : 'user';
  const [role, setRole] = useState<'user' | 'scrapper'>(initialRole as 'user' | 'scrapper');
  const { signUp, loading } = useAuth();
  const { supabase } = useSupabase();
  const schema = createSignUpSchema(role);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      city: '',
      address: '',
      ...(role === 'scrapper' ? {
        role: 'scrapper',
        vehicleType: '',
        workingHours: '',
        serviceArea: '',
        scrapTypes: [],
        latitude: '',
        longitude: '',
        aadharNumber: '',
        panNumber: '',
        aadharImage: null,
        panImage: null,
      } : {
        role: 'user'
      })
    },
  });

  useEffect(() => {
    // Update role when URL params change
    if (searchParams.get('type') === 'scrapper') {
      setRole('scrapper');
    } else {
      setRole('user');
    }
  }, [searchParams]);

  const uploadKYCImage = async (file: File, path: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase.storage
      .from('kyc-docs')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;
    return data?.path;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      let processedData = { ...data };

      // Type guard to check if it's a scrapper
      if (role === 'scrapper') {
        const scrapperData = data as Extract<FormValues, { role: 'scrapper' }>;

        // 1. Upload Aadhar image
        let aadharPath = '';
        if (scrapperData.aadharImage) {
          aadharPath = `aadhar/${Date.now()}-${scrapperData.aadharImage.name}`;
          await uploadKYCImage(scrapperData.aadharImage, aadharPath);
        }

        // 2. Upload PAN image
        let panPath = '';
        if (scrapperData.panImage) {
          panPath = `pan/${Date.now()}-${scrapperData.panImage.name}`;
          await uploadKYCImage(scrapperData.panImage, panPath);
        }

        // 3. Replace file objects with image URLs or paths
        processedData = {
          ...processedData,
          scrapTypes: scrapperData.scrapTypes.join(','),
          aadhar_image_url: aadharPath,
          pan_image_url: panPath,
        };
      }

      // Only exclude password and confirmPassword, keep the image paths
      const { password, confirmPassword, ...userDataToSubmit } = processedData;

      await signUp(
        data.email,
        password,
        userDataToSubmit,
        role === 'scrapper'
      );
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  const pageTitle = role === 'user' ? 'Sign Up as User' : 'Sign Up as Scrapper';

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 animate-fade-in">
      <div className="scrap-container max-w-[600px] mx-auto">
        <AuthHeader />

        <div className="scrap-card bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h1 className="scrap-heading text-center mb-6 text-2xl md:text-3xl">
            {pageTitle}
          </h1>

          {/* Role selection */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-3 text-lg transition-transform hover:scale-105 ${role === 'user' ? 'bg-scrap-green hover:bg-scrap-green/90' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Sign Up as User
            </Button>
            <Button
              type="button"
              onClick={() => setRole('scrapper')}
              className={`flex-1 py-3 text-lg transition-transform hover:scale-105 ${role === 'scrapper' ? 'bg-scrap-green hover:bg-scrap-green/90' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Sign Up as Scrapper
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="10-digit mobile number" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full address" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="scrap-input text-base py-2">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="scrap-error text-base" />
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
                        <FormLabel className="scrap-label text-base">Type of Vehicle</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="scrap-input text-base py-2">
                              <SelectValue placeholder="Select your vehicle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleTypes.map((vehicle) => (
                              <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">Working Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 9 AM - 6 PM" className="scrap-input text-base py-2" {...field} />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">Service Area</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., North Mumbai" className="scrap-input text-base py-2" {...field} />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scrapTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">Scrap Types You Collect</FormLabel>
                        <FormControl>
                          <WasteTypeSelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {role === 'scrapper' && (
                <>
                  {/* KYC - Aadhar Number */}
                  <FormField
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">Aadhar Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Aadhar Number" className="scrap-input text-base py-2" {...field} />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />

                  {/* KYC - PAN Number */}
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">PAN Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PAN Number" className="scrap-input text-base py-2" {...field} />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />

                  {/* KYC - Upload Aadhar Image */}
                  <FormField
                    control={form.control}
                    name="aadharImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">Upload Aadhar Card</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" className="scrap-input text-base py-2" onChange={(e) => field.onChange(e.target.files?.[0])} />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
                      </FormItem>
                    )}
                  />

                  {/* KYC - Upload PAN Image */}
                  <FormField
                    control={form.control}
                    name="panImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label text-base">Upload PAN Card</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" className="scrap-input text-base py-2" onChange={(e) => field.onChange(e.target.files?.[0])} />
                        </FormControl>
                        <FormMessage className="scrap-error text-base" />
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
                    <FormLabel className="scrap-label text-base">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password (min 6 characters)" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full scrap-btn-primary mt-6 text-lg py-3 transition-transform hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-gray-600 text-base">
            Already have an account?{' '}
            <Link to="/signin" className="text-scrap-blue hover:underline font-medium">
              Login
            </Link>
          </p>

          <div className="mt-6 text-center">
            <p className="text-gray-600">For any queries, please contact:</p>
            <p className="font-medium text-scrap-blue">smit.kothari@aissmsioit.org</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
