
import React from 'react';
import BusinessLocationSearch from '@/components/BusinessLocationSearch';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BusinessSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Business Location Finder</h1>
          <BusinessLocationSearch />
        </div>
      </div>
    </div>
  );
};

export default BusinessSearchPage;
