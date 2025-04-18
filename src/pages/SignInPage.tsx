
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthHeader } from '@/components/AuthHeader';
import { FormDivider } from '@/components/FormDivider';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    console.log('Sign-in data:', data);
    setErrorMessage(null);
    
    // In a real app, this would validate with an API
    // For demo, we'll simulate different dashboards based on email pattern
    
    setTimeout(() => {
      if (data.email.includes('scrapper')) {
        navigate('/scrapper-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="scrap-container">
        <AuthHeader />
        
        <div className="scrap-card">
          <h1 className="scrap-heading">
            Sign In to ScrapEasy
          </h1>

          <GoogleAuthButton type="login" className="mb-4" />
          <FormDivider />

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {errorMessage}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" className="scrap-input" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error" />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-scrap-blue hover:underline text-sm">
                  Forgot Password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full scrap-btn-secondary mt-6"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-scrap-blue hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
