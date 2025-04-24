import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { SupabaseProvider } from "./hooks/useSupabase";
import RequireAuth from "./components/RequireAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// ScrapEasy pages
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import ScrapperDashboard from "./pages/ScrapperDashboard";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import UserProfilePage from "./pages/UserProfilePage";
import ScrapperProfilePage from "./pages/ScrapperProfilePage";
import BusinessSearchPage from "./pages/BusinessSearchPage";
import NotFound from "./pages/NotFound";
import { ProfileForm } from '@/components/ProfileForm';

import "./styles/scrap.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SupabaseProvider>
              <AuthProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/login" element={<SignInPage />} /> {/* Alias for signin */}
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/business-search" element={<BusinessSearchPage />} />
                  
                  {/* Protected User Routes */}
                  <Route 
                    path="/user-dashboard" 
                    element={
                      <RequireAuth userType="user">
                        <UserDashboard />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <RequireAuth userType="user">
                        <ProfileForm />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Protected Scrapper Routes */}
                  <Route 
                    path="/scrapper-dashboard" 
                    element={
                      <RequireAuth userType="scrapper">
                        <ScrapperDashboard />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/scrapper-profile" 
                    element={
                      <RequireAuth userType="scrapper">
                        <ScrapperProfilePage />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* 404 catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </SupabaseProvider>
          </BrowserRouter>
        </TooltipProvider>
      </Suspense>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
