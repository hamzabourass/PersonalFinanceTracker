import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
  HomeIcon,
  CreditCardIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink: React.FC<{ item: typeof navigation[0]; mobile?: boolean }> = ({ item, mobile = false }) => (
    <Link
      to={item.href}
      className={`${
        isActive(item.href)
          ? 'bg-blue-50 border-blue-500 text-blue-700'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } group flex items-center px-2 py-2 ${
        mobile ? 'text-base' : 'text-sm'
      } font-medium border-l-4 transition-colors`}
      onClick={() => mobile && setSidebarOpen(false)}
    >
      <item.icon className={`${mobile ? 'mr-4 h-6 w-6' : 'mr-3 h-5 w-5'}`} />
      {item.name}
    </Link>
  );

  return (
    <>
      {/* Mobile menu */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        {/* Mobile sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Mobile logo */}
          <div className="flex-shrink-0 flex items-center px-4">
            <h1 className="text-lg font-bold text-gray-900">Finance Tracker</h1>
          </div>
          
          {/* Mobile navigation */}
          <nav className="mt-5 flex-shrink-0 h-full divide-y divide-gray-200 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} mobile />
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto border-r border-gray-200">
            {/* Desktop logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Personal Finance Tracker
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="mt-8 flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto">
              <div className="px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;