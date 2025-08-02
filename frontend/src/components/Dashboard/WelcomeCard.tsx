import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface WelcomeCardProps {
  currentMonth: string;
  hasData: boolean;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ currentMonth, hasData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100 text-lg">
            {hasData 
              ? `Here's your financial overview for ${currentMonth}`
              : `Let's get started with your financial tracking for ${currentMonth}`
            }
          </p>
        </div>
        <div className="hidden md:block">
          <CalendarIcon className="h-16 w-16 text-blue-200" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;