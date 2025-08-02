import React from 'react';
import { Bars3Icon, UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {title && (
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
              <span className="text-sm font-medium text-gray-900">Welcome back!</span>
              <span className="text-xs text-gray-500">Finance Manager</span>
            </div>
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 transition-colors">
              <span className="sr-only">User menu</span>
              <UserCircleIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;