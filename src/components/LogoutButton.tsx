
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const LogoutButton = ({ variant = 'outline', size = 'default' }: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useSupabase();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await logout();
      toast.success('You have been logged out');
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? 'Logging out...' : 'Log Out'}
    </Button>
  );
};

export default LogoutButton;
