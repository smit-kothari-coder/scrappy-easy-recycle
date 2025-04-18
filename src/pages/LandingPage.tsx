
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with recycling background */}
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
          
          <div className="relative z-10 scrap-container flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              ScrapEasy
            </h1>
            <p className="text-xl text-white mb-8 text-center max-w-md">
              Recycle smarter, earn rewards, and help the planet with our easy-to-use platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/signup" className="w-full sm:w-auto">
                <button className="scrap-btn-primary">
                  Sign Up
                </button>
              </Link>
              <Link to="/signin" className="w-full sm:w-auto">
                <button className="scrap-btn-secondary">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features highlight */}
      <div className="bg-white py-12">
        <div className="scrap-container">
          <h2 className="text-2xl font-bold text-center mb-8">How ScrapEasy Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="scrap-card">
              <h3 className="text-xl font-semibold mb-2 text-scrap-green">Schedule a Pickup</h3>
              <p>Book a convenient time for scrappers to collect your recyclables</p>
            </div>
            
            <div className="scrap-card">
              <h3 className="text-xl font-semibold mb-2 text-scrap-green">Get Paid</h3>
              <p>Earn money for your recyclable materials at transparent rates</p>
            </div>
            
            <div className="scrap-card">
              <h3 className="text-xl font-semibold mb-2 text-scrap-green">Earn Points</h3>
              <p>Collect rewards and see your environmental impact grow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="scrap-container text-center">
          <p className="text-gray-600">© 2025 ScrapEasy. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/faq" className="text-scrap-blue hover:underline">FAQ</Link>
            <Link to="/contact" className="text-scrap-blue hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
