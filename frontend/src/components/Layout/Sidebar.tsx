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
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      } group flex items-center px-4 py-3 ${
        mobile ? 'text-base' : 'text-sm'
      } font-medium transition-all duration-200 ease-in-out`}
      onClick={() => mobile && setSidebarOpen(false)}
    >
      <item.icon 
        className={`${mobile ? 'mr-4 h-6 w-6' : 'mr-3 h-5 w-5'} ${
          isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
        } transition-colors duration-200`} 
      />
      {item.name}
    </Link>
  );

  return (
    <>
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-4">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-gray-600 hover:bg-gray-500 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-6 py-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Finance Tracker</h1>
          </div>
          
          <nav className="mt-6 flex-1 px-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} mobile />
            ))}
          </nav>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30">
        <div className="flex flex-col w-72">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm h-screen">
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Personal Finance Tracker
              </Link>
            </div>
            
            <nav className="mt-8 flex-1 px-2 space-y-2 overflow-y-auto">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>

            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                © 2025 Finance Tracker
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;