import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import type { CategoryDto } from '../../types/api';
import { TransactionType } from '../../types/api';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryDto | null;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  if (!category) return null;

  const isIncomeCategory = category.type === TransactionType.Income;

  return (
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    
                    <div>
                      <Dialog.Title className="text-2xl font-semibold leading-6 text-gray-900">
                        {category.name}
                      </Dialog.Title>
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                          isIncomeCategory
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <TagIcon className="w-4 h-4 mr-1" />
                        {isIncomeCategory ? 'Income' : 'Expense'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {category.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {category.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <h3 className="text-sm font-medium text-gray-900">Created</h3>
                      </div>
                      <p className="text-gray-600">
                        {format(new Date(category.createdAt), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(category.createdAt), 'h:mm a')}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div 
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="text-sm font-medium text-gray-900">Color</h3>
                      </div>
                      <p className="text-gray-600 font-mono text-sm">
                        {category.color.toUpperCase()}
                      </p>
                    </div>
                  </div>
{/* 
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Category ID</h3>
                    <p className="text-xs text-gray-500 font-mono break-all">
                      {category.id}
                    </p>
                  </div> */}

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Usage Statistics</h3>
                    <p className="text-sm text-blue-700">
                      Transaction statistics will be available once transactions are implemented.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Close
                  </button>
                  
                  <button
                    disabled
                    className="px-6 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                  >
                    Edit (Coming Soon)
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CategoryDetailsModal;