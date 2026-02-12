
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
