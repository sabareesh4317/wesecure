import React, { useState, useEffect, useRef } from 'react';
import { ShieldIcon, UserIcon, LogoutIcon } from './icons';
import type { User, CurrentPage } from '../types';

interface HeaderProps {
  user: User | null;
  onNavigate: (page: CurrentPage) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = user?.email.substring(0, 2).toUpperCase() || '..';

  return (
    <header className="sticky top-0 z-20 bg-[#0a0e1a]/60 backdrop-blur-lg header-glow header-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 group" aria-label="Go to dashboard">
              <ShieldIcon className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors animate-[pulse-subtle_2.5s_ease-in-out_infinite]" />
            </button>
          </div>

          {/* Center: Title */}
          <div className="flex-grow flex items-center justify-center">
             <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-glow">
               Wesecure
             </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-sm font-bold text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
                id="user-menu-button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                {userInitials}
              </button>

              {isDropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <button
                    onClick={() => { onNavigate('account'); setIsDropdownOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    role="menuitem"
                  >
                    <UserIcon className="w-4 h-4" /> Account
                  </button>
                  <button
                    onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    role="menuitem"
                  >
                    <LogoutIcon className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;