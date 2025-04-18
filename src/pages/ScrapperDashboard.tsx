
import { Link } from 'react-router-dom';

const ScrapperDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="scrap-container">
        <h1 className="scrap-heading">Scrapper Dashboard</h1>
        <div className="scrap-card">
          <p className="text-center text-gray-600 mb-4">
            Welcome to your Scrapper dashboard! This is a placeholder.
          </p>
          <div className="flex justify-center">
            <Link to="/" className="text-scrap-blue hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapperDashboard;
