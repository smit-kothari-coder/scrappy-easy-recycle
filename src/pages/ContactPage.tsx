
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log('Contact form data:', data);
    
    // In a real app, this would send the message to backend
    // For now, we'll just create a mailto link
    const mailtoUrl = `mailto:smit.kothari@aissmsioit.org,parin.jain@aissmsioit.org?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;
    window.location.href = mailtoUrl;
    
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="scrap-container">
        <h1 className="scrap-heading">Contact Support</h1>
        
        <div className="scrap-card mb-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-scrap-green rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. We'll get back to you as soon as possible.
              </p>
              <Link to="/">
                <Button className="scrap-btn-secondary">
                  Return to Home
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-6">
                Have a question or need assistance? Fill out the form below and our support team will get back to you shortly.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Your Name</FormLabel>
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
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What is your query about?" className="scrap-input" {...field} />
                        </FormControl>
                        <FormMessage className="scrap-error" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="scrap-label">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your issue or question in detail..." 
                            className="scrap-input min-h-[150px]" 
                            {...field} 
                          />
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
                    {form.formState.isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
        
        {/* Contact information */}
        <div className="scrap-card mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us Directly</h2>
          <div className="flex flex-col gap-3">
            <a 
              href="mailto:smit.kothari@aissmsioit.org" 
              className="flex items-center gap-2 text-scrap-blue hover:underline"
            >
              <Mail className="w-4 h-4" />
              smit.kothari@aissmsioit.org
            </a>
            
            <a 
              href="mailto:parin.jain@aissmsioit.org" 
              className="flex items-center gap-2 text-scrap-blue hover:underline"
            >
              <Mail className="w-4 h-4" />
              parin.jain@aissmsioit.org
            </a>
          </div>
        </div>
        
        {/* FAQ link */}
        <div className="text-center">
          <p className="mb-4 text-gray-700">Looking for quick answers?</p>
          <Link to="/faq">
            <Button variant="outline" className="mb-6">
              Check our FAQ
            </Button>
          </Link>
          
          <div className="mt-4">
            <Link to="/" className="text-scrap-blue hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
