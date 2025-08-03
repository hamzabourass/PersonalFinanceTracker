import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppStore } from '../../store';
import { TransactionType } from '../../types/api';
import type { TransactionDto } from '../../types/api';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionDto | null;
}

const editTransactionSchema = z.object({
  description: z.string()
    .min(1, 'Description is required')
    .max(100, 'Description cannot exceed 100 characters'),
  amount: z.number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large'),
  currency: z.string()
    .min(1, 'Currency is required')
    .default('USD'),
  date: z.string()
    .min(1, 'Date is required'),
  categoryId: z.string()
    .min(1, 'Category is required'),
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
});

type EditTransactionForm = z.infer<typeof editTransactionSchema>;

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction: initialTransaction
}) => {
  const { categories, fetchCategories, updateTransaction, transactions } = useAppStore();

  // Get the latest transaction data from the store
  const transaction = initialTransaction ? 
    transactions.find(t => t.id === initialTransaction.id) || initialTransaction : 
    null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EditTransactionForm>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      currency: 'USD'
    }
  });

  // Load transaction data when modal opens
  useEffect(() => {
    if (transaction && isOpen) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
        date: new Date(transaction.date).toISOString().split('T')[0],
        categoryId: transaction.category.id,
        notes: transaction.notes || ''
      });
    }
  }, [transaction, isOpen, reset]);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const filteredCategories = categories.filter(
    cat => cat.type === transaction?.type
  );

  const onSubmit = async (data: EditTransactionForm) => {
    if (!transaction) return;

    try {
      const dateObj = new Date(data.date + 'T00:00:00.000Z');
      const isoDate = dateObj.toISOString();
      
      const updateData = {
        description: data.description,
        amount: Number(data.amount),
        currency: data.currency,
        date: isoDate,
        categoryId: data.categoryId,
        notes: data.notes || undefined
      };
      
      await updateTransaction(transaction.id, updateData);
      toast.success('Transaction updated successfully!');
      handleClose();
    } catch (error: any) {
      console.error('Failed to update transaction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update transaction';
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!transaction) return null;

  const isIncomeTransaction = transaction.type === TransactionType.Income;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold leading-6 text-gray-900">
                    Edit Transaction
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Transaction Type Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Type
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isIncomeTransaction ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isIncomeTransaction ? 'Income' : 'Expense'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Transaction type cannot be changed</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('categoryId')}
                      id="categoryId"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"
                    >
                      <option value="">Select a category</option>
                      {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-2 text-sm text-red-600">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          {...register('amount', { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          min="0"
                          id="amount"
                          className="block w-full pl-7 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.amount && (
                        <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Currency */}
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        {...register('currency')}
                        id="currency"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"
                      >
                        <option value="USD">USD</option>
                      </select>
                      {errors.currency && (
                        <p className="mt-2 text-sm text-red-600">{errors.currency.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      {...register('description')}
                      type="text"
                      id="description"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"
                      placeholder="e.g., Grocery shopping, Salary payment"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      {...register('date')}
                      type="date"
                      id="date"
                      max={new Date().toISOString().split('T')[0]}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      {...register('notes')}
                      id="notes"
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"
                      placeholder="Additional notes (optional)"
                    />
                    {errors.notes && (
                      <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </span>
                      ) : (
                        'Update Transaction'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditTransactionModal;