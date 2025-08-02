import React from 'react';
import { format } from 'date-fns';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { TransactionDto } from '../../types/api';
import { TransactionType } from '../../types/api';

interface TransactionCardProps {
  transaction: TransactionDto;
  onClick?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
  const isIncome = transaction.type === TransactionType.Income;

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Category Color Indicator */}
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${transaction.category.color}20` }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: transaction.category.color }}
            />
          </div>
          
          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {transaction.description}
              </h3>
              <span 
                className={`text-lg font-semibold ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{transaction.category.name}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-400">
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </span>
              </div>
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isIncome
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {isIncome ? 'Income' : 'Expense'}
              </span>
            </div>
            
            {transaction.notes && (
              <p className="text-sm text-gray-500 mt-2 truncate">
                {transaction.notes}
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <button 
          className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            // Handle actions menu
          }}
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;