
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthHeader } from '@/components/AuthHeader';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log('Forgot password request:', data);
    
    // In a real app, this would send a password reset email
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="scrap-container">
        <AuthHeader />
        
        <div className="scrap-card">
          <h1 className="scrap-heading">
            Reset Your Password
          </h1>

          {isSubmitted ? (
            <div className="text-center">
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-scrap-green rounded-lg">
                Password reset instructions have been sent to your email.
              </div>
              <p className="text-gray-600 mb-6">Please check your inbox and follow the instructions.</p>
              <Link to="/signin">
                <Button className="scrap-btn-secondary">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Enter your email address below and we'll send you instructions to reset your password.
              </p>

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
                  
                  <Button 
                    type="submit" 
                    className="w-full scrap-btn-secondary mt-6"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
                  </Button>
                </form>
              </Form>
              
              <p className="mt-6 text-center text-gray-600">
                Remember your password?{' '}
                <Link to="/signin" className="text-scrap-blue hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
