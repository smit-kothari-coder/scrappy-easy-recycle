
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthHeader } from '@/components/AuthHeader';
import { useAuth } from '@/hooks/useAuth';

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { signIn, loading } = useAuth();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    await signIn(data.email, data.password, false); // Assuming 'false' for isPhoneLogin
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 animate-fade-in">
      <div className="scrap-container max-w-[600px] mx-auto">
        <AuthHeader />
        
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
                      <Input type="email" placeholder="Enter your email" className="scrap-input text-base py-2" {...field} />
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
                      <Input type="password" placeholder="Enter your password" className="scrap-input text-base py-2" {...field} />
                    </FormControl>
                    <FormMessage className="scrap-error text-base" />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-scrap-blue hover:underline text-base">
                  Forgot Password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-scrap-blue hover:bg-scrap-blue/90 text-white mt-6 text-lg py-3 transition-transform hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </form>
          </Form>
          
          <p className="mt-6 text-center text-gray-600 text-base">
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
