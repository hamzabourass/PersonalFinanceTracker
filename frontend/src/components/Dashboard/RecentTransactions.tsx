import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCardIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { TransactionType } from '../../types/api';
import type { TransactionDto } from '../../types/api';

interface RecentTransactionsProps {
  transactions: TransactionDto[];
  loading: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link 
          to="/transactions" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View all
        </Link>
      </div>
      
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${transaction.category.color}20` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: transaction.category.color }}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category.name}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === TransactionType.Income ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{transaction.currency}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCardIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No transactions yet</p>
          <p className="text-sm text-gray-400 mb-4">Start tracking your finances by adding your first transaction</p>
          <Link 
            to="/transactions" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Transaction
          </Link>
        </div>
      )}
    </div>
  );
};
export default RecentTransactions;