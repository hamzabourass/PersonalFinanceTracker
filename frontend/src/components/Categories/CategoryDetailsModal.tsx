import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TagIcon, CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format, isThisMonth, isThisYear, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import type { CategoryDto } from '../../types/api';
import { TransactionType } from '../../types/api';
import { useAppStore } from '../../store';
import CategoryStatistics from './CategoryStatistics';
import EditCategoryModal from './EditCategoryModal';
import DeleteConfirmationModal from '../Common/DeleteConfirmationModal';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryDto | null; // This will be the initial category data
}

interface CategoryStats {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  thisMonthAmount: number;
  thisMonthCount: number;
  thisYearAmount: number;
  lastTransactionDate: string | null;
  highestTransaction: number;
  lowestTransaction: number;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  isOpen,
  onClose,
  category: initialCategory
}) => {
  const { transactions, fetchTransactions, deleteCategory, categories } = useAppStore();
  
  // Get the latest category data from the store
  const category = initialCategory ? categories.find(c => c.id === initialCategory.id) || initialCategory : null;
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      loadCategoryStatistics();
    }
  }, [isOpen, category, transactions]);

  const loadCategoryStatistics = async () => {
    if (!category) return;
    
    setLoading(true);
    
    // Make sure we have all transactions loaded
    if (transactions.length === 0) {
      await fetchTransactions({ take: 1000 });
    }
    
    // Filter transactions for this category
    const categoryTransactions = transactions.filter(t => t.category.id === category.id);
    
    if (categoryTransactions.length === 0) {
      setStats({
        totalAmount: 0,
        transactionCount: 0,
        averageAmount: 0,
        thisMonthAmount: 0,
        thisMonthCount: 0,
        thisYearAmount: 0,
        lastTransactionDate: null,
        highestTransaction: 0,
        lowestTransaction: 0
      });
      setLoading(false);
      return;
    }

    // Calculate statistics
    const amounts = categoryTransactions.map(t => t.amount);
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    const averageAmount = totalAmount / categoryTransactions.length;
    
    // This month statistics
    const thisMonthTransactions = categoryTransactions.filter(t => 
      isThisMonth(parseISO(t.date))
    );
    const thisMonthAmount = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // This year statistics
    const thisYearTransactions = categoryTransactions.filter(t => 
      isThisYear(parseISO(t.date))
    );
    const thisYearAmount = thisYearTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Find latest transaction
    const sortedByDate = [...categoryTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastTransactionDate = sortedByDate[0]?.date || null;
    
    setStats({
      totalAmount,
      transactionCount: categoryTransactions.length,
      averageAmount,
      thisMonthAmount,
      thisMonthCount: thisMonthTransactions.length,
      thisYearAmount,
      lastTransactionDate,
      highestTransaction: Math.max(...amounts),
      lowestTransaction: Math.min(...amounts)
    });
    
    setLoading(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!category) return;

    setIsDeleting(true);
    try {
      await deleteCategory(category.id);
      toast.success('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    // No need to reload statistics manually since category data updates automatically
  };

  if (!category) return null;

  const isIncomeCategory = category.type === TransactionType.Income;

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                      
                      <div>
                        <Dialog.Title className="text-3xl font-bold leading-6 text-gray-900 mb-2">
                          {category.name}
                        </Dialog.Title>
                        <span 
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            isIncomeCategory
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <TagIcon className="w-4 h-4 mr-2" />
                          {isIncomeCategory ? 'Income Category' : 'Expense Category'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleEdit}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Category Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Description */}
                      {category.description && (
                        <div className="lg:col-span-2">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                          <p className="text-gray-700 bg-gray-50 p-6 rounded-xl leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      )}

                      {/* Category Details */}
                      <div className={category.description ? "lg:col-span-1" : "lg:col-span-3"}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Category Details</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                              <CalendarIcon className="w-5 h-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">Created</span>
                            </div>
                            <p className="text-gray-900 font-semibold">
                              {format(new Date(category.createdAt), 'MMMM d, yyyy')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(category.createdAt), 'h:mm a')}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                              <div 
                                className="w-5 h-5 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm font-medium text-gray-700">Color</span>
                            </div>
                            <p className="text-gray-900 font-mono font-semibold">
                              {category.color.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    <CategoryStatistics
                      stats={stats}
                      loading={loading}
                      categoryColor={category.color}
                      isIncomeCategory={isIncomeCategory}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Category ID: <span className="font-mono">{category.id}</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        category={category}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action will permanently remove the category from your account."
        itemName={category.name}
        loading={isDeleting}
        type="danger"
      />
    </>
  );
};

export default CategoryDetailsModal;