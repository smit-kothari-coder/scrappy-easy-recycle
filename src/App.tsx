import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

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
import { AuthProvider } from "./hooks/useAuth";
import RequireAuth from "./components/RequireAuth";
import "./styles/scrap.css";
import PickupSummary from "./pages/PickupSummary"; // <- Add this at the top

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/login" element={<SignInPage />} />{" "}
            {/* Alias for signin */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Route for User Dashboard */}
            <Route path="/userdashboard" element={<UserDashboard />} />
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
                  <UserProfilePage />
                </RequireAuth>
              }
            />
            <Route path="/pickup-summary" element={<PickupSummary />} />
            <Route path="/profile" element={<ScrapperProfilePage />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
