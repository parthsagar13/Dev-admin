'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { UserDashboardLayout } from './UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/context/UserAuthContext';
import { authApi } from '@/services/api';

export const ProfilePage = () => {
  const { user, logout } = useUserAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // stateless JWT — clear client state regardless
    }
    logout();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <UserDashboardLayout title="Profile" active="/dashboard/profile">
      <div className="max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border border-gray-100 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Sign-in method</p>
            <p className="mt-1 font-medium capitalize text-gray-900">{user?.provider || 'email'}</p>
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
