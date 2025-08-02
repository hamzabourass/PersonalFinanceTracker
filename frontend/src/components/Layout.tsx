import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-72">
        {/* Header - fixed at top */}
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-8 px-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;