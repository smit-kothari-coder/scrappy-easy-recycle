import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RequireAuthProps {
  children: JSX.Element;
  userType?: 'user' | 'scrapper';
}

const RequireAuth = ({ children, userType }: RequireAuthProps) => {
  const { user, loading, userType: currentUserType } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to signin page but save the current location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If userType is specified, check if the user has the correct type
  if (userType && currentUserType !== userType) {
    // Redirect to the appropriate dashboard
    if (currentUserType === 'user') {
      return <Navigate to="/user-dashboard" replace />;
    } else {
      return <Navigate to="/scrapper-dashboard" replace />;
    }
  }

  return children;
};

export default RequireAuth;
