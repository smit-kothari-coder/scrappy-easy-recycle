
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BusinessLocationSearch from '@/components/BusinessLocationSearch';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col">
        <div 
          className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-scrap-light-green"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          <div className="relative z-10 scrap-container flex flex-col items-center max-w-[600px]">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              ScrapEasy
            </h1>
            <p className="text-xl text-white mb-8 text-center max-w-md">
              Search, scrape and visualize business locations easily
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-6">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button className="scrap-btn-primary w-full text-lg py-6 px-8">
                  Go to Dashboard
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="bg-white bg-opacity-20 text-white border-white w-full text-lg py-6 px-8 hover:bg-opacity-30 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = 'mailto:smit.kothari@aissmsioit.org,parin.jain@aissmsioit.org?subject=Scrap%20Easy%20Inquiry';
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search section */}
      <div className="bg-white py-12">
        <div className="scrap-container max-w-[800px] mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Search Business Locations</h2>
          <BusinessLocationSearch />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="scrap-container text-center max-w-[600px] mx-auto">
          <p className="text-gray-600 text-base">© 2025 ScrapEasy. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/dashboard" className="text-scrap-blue hover:underline text-base">Dashboard</Link>
            <a 
              href="mailto:smit.kothari@aissmsioit.org,parin.jain@aissmsioit.org?subject=Contact%20from%20ScrapEasy" 
              className="text-scrap-blue hover:underline text-base"
            >
              Contact Us
            </a>
            <a 
              href="https://www.openstreetmap.org/copyright" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-scrap-blue hover:underline text-base"
            >
              Map Attribution
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
