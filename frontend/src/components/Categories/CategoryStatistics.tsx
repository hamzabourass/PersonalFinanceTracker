import React from 'react';
import { 
  CreditCardIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

interface CategoryStatisticsProps {
  stats: {
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
    thisMonthAmount: number;
    thisMonthCount: number;
    thisYearAmount: number;
    lastTransactionDate: string | null;
    highestTransaction: number;
    lowestTransaction: number;
  } | null;
  loading: boolean;
  categoryColor: string;
  isIncomeCategory: boolean;
}

const CategoryStatistics: React.FC<CategoryStatisticsProps> = ({
  stats,
  loading,
  isIncomeCategory
}) => {
  const colorClasses = isIncomeCategory 
    ? {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-900',
        textSecondary: 'text-green-700',
        icon: 'text-green-600',
        accent: 'bg-green-100'
      }
    : {
        bg: 'bg-blue-50',
        border: 'border-blue-200', 
        text: 'text-blue-900',
        textSecondary: 'text-blue-700',
        icon: 'text-blue-600',
        accent: 'bg-blue-100'
      };

  if (loading) {
    return (
      <div className={`${colorClasses.bg} p-6 rounded-xl ${colorClasses.border} border`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 ${colorClasses.accent} rounded-lg`}>
            <ChartBarIcon className={`w-6 h-6 ${colorClasses.icon}`} />
          </div>
          <h3 className={`text-xl font-semibold ${colorClasses.text}`}>Usage Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.transactionCount === 0) {
    return (
      <div className={`${colorClasses.bg} p-6 rounded-xl ${colorClasses.border} border`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 ${colorClasses.accent} rounded-lg`}>
            <ChartBarIcon className={`w-6 h-6 ${colorClasses.icon}`} />
          </div>
          <h3 className={`text-xl font-semibold ${colorClasses.text}`}>Usage Statistics</h3>
        </div>
        
        <div className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses.accent} rounded-full mb-4`}>
            <CreditCardIcon className={`w-8 h-8 ${colorClasses.icon}`} />
          </div>
          <h4 className={`text-lg font-medium ${colorClasses.text} mb-2`}>No transactions yet</h4>
          <p className={`${colorClasses.textSecondary} text-sm max-w-sm mx-auto`}>
            Statistics will appear once you add transactions in this category. 
            Start tracking your {isIncomeCategory ? 'income' : 'expenses'} to see insights here.
          </p>
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      icon: CurrencyDollarIcon,
      label: 'Total Amount',
      value: `$${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: CreditCardIcon,
      label: 'Total Transactions',
      value: stats.transactionCount.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: ChartBarIcon,
      label: 'Average Amount',
      value: `$${stats.averageAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CalendarIcon,
      label: 'This Month',
      value: `$${stats.thisMonthAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const detailStats = [
    {
      icon: CalendarIcon,
      label: 'This Month Transactions',
      value: stats.thisMonthCount.toLocaleString(),
    },
    {
      icon: ChartBarIcon,
      label: 'This Year Total',
      value: `$${stats.thisYearAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      icon: ArrowTrendingUpIcon,
      label: 'Highest Transaction',
      value: `$${stats.highestTransaction.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      icon: ArrowTrendingDownIcon,
      label: 'Lowest Transaction',
      value: `$${stats.lowestTransaction.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    }
  ];

  return (
    <div className={`${colorClasses.bg} p-6 rounded-xl ${colorClasses.border} border`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${colorClasses.accent} rounded-lg`}>
            <ChartBarIcon className={`w-6 h-6 ${colorClasses.icon}`} />
          </div>
          <h3 className={`text-xl font-semibold ${colorClasses.text}`}>Usage Statistics</h3>
        </div>
        <div className={`px-3 py-1 ${colorClasses.accent} rounded-full`}>
          <span className={`text-sm font-medium ${colorClasses.textSecondary}`}>
            {isIncomeCategory ? 'Income' : 'Expense'} Category
          </span>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mainStats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {detailStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${colorClasses.accent} rounded-lg`}>
                  <stat.icon className={`w-4 h-4 ${colorClasses.icon}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
              </div>
              <span className={`text-lg font-semibold ${colorClasses.text}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Last Transaction */}
      {stats.lastTransactionDate && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${colorClasses.accent} rounded-lg`}>
                <ClockIcon className={`w-4 h-4 ${colorClasses.icon}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Last Transaction</span>
            </div>
            <span className={`text-lg font-semibold ${colorClasses.text}`}>
              {format(parseISO(stats.lastTransactionDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      )}

      {/* Summary Insight */}
      <div className={`mt-4 p-4 ${colorClasses.accent} rounded-lg`}>
        <div className="flex items-start space-x-3">
          <div className={`p-1 bg-white rounded-lg mt-0.5`}>
            <ChartBarIcon className={`w-4 h-4 ${colorClasses.icon}`} />
          </div>
          <div>
            <h4 className={`text-sm font-medium ${colorClasses.text} mb-1`}>Quick Insight</h4>
            <p className={`text-sm ${colorClasses.textSecondary}`}>
              You have <span className="font-semibold">{stats.transactionCount}</span> transactions 
              in this category with an average of{' '}
              <span className="font-semibold">${stats.averageAmount.toFixed(2)}</span> per transaction.
              {stats.thisMonthCount > 0 && (
                <> This month you've had <span className="font-semibold">{stats.thisMonthCount}</span> transactions
                totaling <span className="font-semibold">${stats.thisMonthAmount.toFixed(2)}</span>.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStatistics;