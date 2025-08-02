import React from 'react';
import { ArrowTrendingDownIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import type { TransactionDto } from '../../types/api';
import { TransactionType } from '../../types/api';

interface TopSpendingChartProps {
  transactions: TransactionDto[];
  loading?: boolean;
}

const TopSpendingChart: React.FC<TopSpendingChartProps> = ({ 
  transactions, 
  loading = false
}) => {
  // Calculate category spending
  const categorySpending = React.useMemo(() => {
    const categoryMap = new Map();

    // Filter only expense transactions
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.Expense);

    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.category.id;
      
      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId);
        categoryMap.set(categoryId, {
          ...existing,
          amount: existing.amount + transaction.amount,
          count: existing.count + 1
        });
      } else {
        categoryMap.set(categoryId, {
          name: transaction.category.name,
          amount: transaction.amount,
          color: transaction.category.color,
          count: 1
        });
      }
    });

    // Convert to array and sort by amount
    return Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3); 
  }, [transactions]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top Spending Categories</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-300 rounded"></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categorySpending.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top Spending Categories</h3>
        </div>
        <div className="text-center py-8">
          <CreditCardIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No expense transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Add some expenses to see your spending patterns</p>
        </div>
      </div>
    );
  }

  const maxAmount = categorySpending[0]?.amount || 1;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top Spending Categories</h3>
        </div>
        <div className="text-sm text-gray-500">
          {categorySpending.length} categories
        </div>
      </div>

      {/* Simple Bar Chart */}
    <div className="h-64 mb-4 flex flex-col justify-center overflow-y-auto">
      <div className="space-y-4">
        {categorySpending.map((category, index) => {
          const percentage = (category.amount / maxAmount) * 100;
          
          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({category.count} transactions)
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500 group-hover:opacity-80"
                  style={{ 
                    backgroundColor: category.color,
                    width: `${percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-lg font-semibold text-red-600">
              ${categorySpending.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-lg font-semibold text-gray-900">
              {categorySpending.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-lg font-semibold text-gray-900">
              {categorySpending.reduce((sum, cat) => sum + cat.count, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSpendingChart;