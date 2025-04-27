import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Settings, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

const ScrapperDashboard = () => {
  const navigate = useNavigate(); // ✅ Move useNavigate here

  const handleLogout = () => {
    // Clear session or authentication tokens (adjust as needed)
    sessionStorage.clear();  // or localStorage.clear();
    
    // Redirect the user to the home page
    navigate('/'); // This redirects to the home page
};
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-green-50">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Welcome, Scrapper!</h1>

        {/* Logout Button */}
        <Button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </Button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vehicle Info */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="w-5 h-5 text-green-600" /> Vehicle Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Vehicle Type: <strong>Mini Truck</strong>
            </p>
            <p className="text-sm text-gray-700">
              Registered No: <strong>GJ01AB1234</strong>
            </p>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-green-600" /> Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Available: <strong>9:00 AM - 9:00 PM</strong>
            </p>
          </CardContent>
        </Card>

        {/* Scrap Types */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="w-5 h-5 text-green-600" /> Scrap Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Plastic', 'Glass', 'Metal', 'E-Waste'].map(type => (
                <Badge key={type} className="bg-green-100 text-green-800 border border-green-300">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="shadow-xl rounded-2xl col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-green-600" /> Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              Manage your availability, scrap types, and update password from the profile section.
            </p>
            <Link 
              to="/profile" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow inline-block"
            >
              Go to Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScrapperDashboard;
