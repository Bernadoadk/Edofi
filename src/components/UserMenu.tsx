import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleMyEvents = () => {
    setIsOpen(false);
    navigate('/my-events');
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  // Get user initials for avatar
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Avatar with initials */}
        <div className="w-10 h-10 bg-assignment-1yellow rounded-full flex items-center justify-center">
          <span className="text-assignment-1dark-navy-blue font-semibold text-sm">
            {getInitials()}
          </span>
        </div>
        
        {/* User info */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-assignment-1white font-medium text-sm">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-assignment-1white/70 text-xs">
            {user.email}
          </span>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-assignment-1white transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User info in dropdown */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-assignment-1yellow rounded-full flex items-center justify-center">
                <span className="text-assignment-1dark-navy-blue font-semibold text-xs">
                  {getInitials()}
                </span>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu options */}
          <div className="py-1">
            <button
              onClick={handleProfile}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            
            <button
              onClick={handleMyEvents}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Events
            </button>
            
            <button
              onClick={handleSettings}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>

          {/* Logout button */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 