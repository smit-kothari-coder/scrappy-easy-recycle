import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthHeader } from '@/components/AuthHeader';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      // Error is already handled by useAuth hook
      form.reset({ email: data.email, password: '' });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 animate-fade-in">
      <div className="scrap-container max-w-[600px] mx-auto">
        <AuthHeader />
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="scrap-card bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h1 className="scrap-heading text-center mb-6 text-2xl md:text-3xl">
            Login to ScrapEasy
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="scrap-input text-base py-2" 
                        {...field} 
                        disabled={loading}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="scrap-label text-base">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="scrap-input text-base py-2" 
                        {...field} 
                        disabled={loading}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-scrap-blue hover:underline text-base"
                  tabIndex={loading ? -1 : 0}
                >
                  Forgot Password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-scrap-blue hover:bg-scrap-blue/90 text-white mt-6 text-lg py-3 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
          
          <p className="mt-6 text-center text-gray-600 text-base">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-scrap-blue hover:underline font-medium"
              tabIndex={loading ? -1 : 0}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
