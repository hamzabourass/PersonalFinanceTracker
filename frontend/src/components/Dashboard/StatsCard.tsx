import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  subtitle?: string;
  loading?: boolean;
  bubbles?: Array<{
    label: string;
    value: number;
    color: 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'gray';
  }>;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconColor,
  subtitle,
  loading = false,
  bubbles
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          )}
          
          {bubbles && !loading ? (
            <div className="mt-1 flex items-center gap-2">
              {bubbles.map((bubble, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getColorClasses(bubble.color)} whitespace-nowrap`}
                >
                  <span className="font-semibold mr-1">{bubble.value}</span>
                  <span>{bubble.label}</span>
                </div>
              ))}
            </div>
          ) : (
            subtitle && !loading && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )
          )}
          
          {change && !loading && (
            <div className="mt-2">
              <span 
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}{change.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;