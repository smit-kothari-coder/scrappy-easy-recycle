
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const ScrapperDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="scrap-container">
        <h1 className="scrap-heading">Scrapper Dashboard</h1>
        
        <div className="grid gap-6">
          <div className="scrap-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="grid gap-4">
              <Link to="/scrapper-profile">
                <Button className="scrap-btn-secondary w-full flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
              <Link to="/faq" className="text-scrap-blue hover:underline text-center">
                Need Help?
              </Link>
            </div>
          </div>
          
          <div className="scrap-card">
            <p className="text-center text-gray-600">
              Your scrapper dashboard content will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapperDashboard;
