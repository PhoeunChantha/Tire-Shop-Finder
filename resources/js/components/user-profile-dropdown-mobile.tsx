import React from 'react';
import { Link } from '@inertiajs/react';
import { Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserProfileDropdownMobileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    roles?: Array<{ name: string }>;
  };
  onLinkClick?: () => void;
}

export default function UserProfileDropdownMobile({ user, onLinkClick }: UserProfileDropdownMobileProps) {
  const { t } = useTranslation();

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    return user?.roles?.some(role => ['admin', 'super-admin'].includes(role.name)) 
      ? "/admin/dashboard" 
      : "/user-dashboard";
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="pt-4 pb-3 border-t border-gray-200">
      {/* User Info Header */}
      <div className="flex items-center px-3 py-2 space-x-3">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-3 space-y-1">
        <Link 
          href={getDashboardUrl()}
          className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50"
          onClick={onLinkClick}
        >
          <Settings className="w-5 h-5 mr-3 text-gray-400" />
          {t('dashboard')}
        </Link>
        
        <Link 
          href="/logout" 
          method="post" 
          as="button"
          className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50"
          onClick={onLinkClick}
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400" />
          {t('logout')}
        </Link>
      </div>
    </div>
  );
}