import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserDashboardLayout } from './UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/context/UserAuthContext';
import { authApi } from '@/services/api';

export const ProfilePage = () => {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // stateless JWT — clear client state regardless
    }
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <UserDashboardLayout title="Profile" active="/dashboard/profile">
      <div className="max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Name</p>
            <p className="mt-1 font-medium text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Email</p>
            <p className="mt-1 font-medium text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Role</p>
            <p className="mt-1 font-medium capitalize text-gray-900">{user?.role}</p>
          </div>
        </div>
        <Button variant="outline" className="mt-6" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </UserDashboardLayout>
  );
};
