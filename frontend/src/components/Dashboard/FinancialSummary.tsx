import React from 'react';
import { 
  ScaleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  totalCategories: number;
  totalTransactions: number;
  hasData: boolean;
  loading?: boolean;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalIncome,
  totalExpenses,
  totalCategories,
  totalTransactions,
  hasData,
  loading = false
}) => {
  const netBalance = totalIncome - totalExpenses;
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const isPositiveBalance = netBalance >= 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
        <div className="flex items-center space-x-3 mb-4">
          <ChartBarIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100 mt-7">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-7">
        <div className="p-3 bg-blue-50 rounded-lg">
          <ChartBarIcon className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
      </div>

      <div className="space-y-6">
        {/* Net Balance */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ScaleIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Net Balance</span>
            </div>
            <span className={`text-xl font-bold ${
              isPositiveBalance ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositiveBalance ? '+' : ''}${netBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Expense Ratio */}
        {totalIncome > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Expense Ratio</span>
              <span className="text-sm font-semibold text-blue-600">
                {expenseRatio.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(expenseRatio, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Summary Text */}
        <div className="pt-6 border-t border-gray-200">
          {hasData ? (
            <p className="text-sm text-gray-600">
              {totalTransactions > 0 
                ? `You have ${totalTransactions} transactions across ${totalCategories} categories.`
                : `You have ${totalCategories} categories ready for transactions.`
              }
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Start by creating categories and adding your first transactions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;