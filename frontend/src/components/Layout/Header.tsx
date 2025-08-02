import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200 lg:border-none">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Header content */}
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1">
          {title && (
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>
        
        {/* Right side of header - could add user menu, notifications, etc. */}
        <div className="flex items-center space-x-4">
          {/* Placeholder for future features like user avatar, notifications */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Welcome back!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;