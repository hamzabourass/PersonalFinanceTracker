import React, { useState } from 'react';
import { format } from 'date-fns';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAppStore } from '../../store';
import type { TransactionDto } from '../../types/api';
import { TransactionType } from '../../types/api';
import EditTransactionModal from './EditTransactionModal';
import DeleteConfirmationModal from '../Common/DeleteConfirmationModal';

interface TransactionCardProps {
  transaction: TransactionDto;
  onClick?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction: initialTransaction, onClick }) => {
  const { deleteTransaction, transactions } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Get the latest transaction data from the store
  const transaction = transactions.find(t => t.id === initialTransaction.id) || initialTransaction;
  
  const isIncome = transaction.type === TransactionType.Income;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction(transaction.id);
      toast.success('Transaction deleted successfully!');
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error('Failed to delete transaction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete transaction';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  return (
    <>
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
          <div className="relative ml-2">
            <button 
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleActionsClick}
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            
            {/* Actions Dropdown */}
            {showActions && (
              <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={transaction}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        itemName={transaction.description}
        loading={isDeleting}
        type="danger"
      />

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
};

export default TransactionCard;