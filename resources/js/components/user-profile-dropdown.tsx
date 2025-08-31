import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    roles?: Array<{ name: string }>;
  };
  className?: string;
}

export default function UserProfileDropdown({ user, className = '' }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none"
      >
        {/* Avatar */}
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user.name)}
          </div>
        )}
        
        {/* User Name */}
        <span className="hidden sm:block truncate max-w-[120px]">
          {user.name}
        </span>
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Dashboard */}
            <Link
              href={getDashboardUrl()}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              {t('dashboard')}
            </Link>

            {/* Profile (if you have a profile page) */}
            {/* Uncomment if you add a profile page
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              Profile
            </Link>
            */}

            {/* Logout */}
            <hr className="my-1" />
            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-400" />
              {t('logout')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}