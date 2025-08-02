import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon } from '@heroicons/react/24/outline';
import type { TransactionDto } from '../../types/api';
import { TransactionType } from '../../types/api';

interface TransactionStatsProps {
  transactions: TransactionDto[];
  loading?: boolean;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions, loading = false }) => {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.Income)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === TransactionType.Expense)
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Income',
      value: `${totalIncome.toFixed(2)}`,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: transactions.filter(t => t.type === TransactionType.Income).length
    },
    {
      title: 'Total Expenses',
      value: `${totalExpenses.toFixed(2)}`,
      icon: ArrowTrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      count: transactions.filter(t => t.type === TransactionType.Expense).length
    },
    {
      title: 'Net Balance',
      value: `${netBalance.toFixed(2)}`,
      icon: ScaleIcon,
      color: netBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netBalance >= 0 ? 'bg-green-50' : 'bg-red-50',
      count: transactions.length
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stat.count} {stat.count === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionStats;