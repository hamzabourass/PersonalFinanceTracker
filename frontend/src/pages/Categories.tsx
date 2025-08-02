import React, { useEffect, useState } from 'react';
import { PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { TransactionType } from '../types/api';
import type { CategoryDto } from '../types/api';
import CategoryCard from '../components/Categories/CategoryCard';
import CreateCategoryModal from '../components/Categories/CreateCategoryModal';
import CategoryDetailsModal from '../components/Categories/CategoryDetailsModal';
import Layout from '../components/Layout';

const Categories: React.FC = () => {
  const { 
    categories, 
    categoriesLoading, 
    categoriesError, 
    fetchCategories, 
    resetCategoriesError 
  } = useAppStore();
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | TransactionType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Show error toast if there's an error
  useEffect(() => {
    if (categoriesError) {
      toast.error(categoriesError);
      resetCategoriesError();
    }
  }, [categoriesError, resetCategoriesError]);

  // Filter categories based on selected filter
  const filteredCategories = categories.filter(category => {
    if (selectedFilter === 'all') return true;
    return category.type === selectedFilter;
  });

  // Count categories by type
  const incomeCount = categories.filter(c => c.type === TransactionType.Income).length;
  const expenseCount = categories.filter(c => c.type === TransactionType.Expense).length;

  const handleCategoryClick = (category: CategoryDto) => {
    setSelectedCategory(category);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCategory(null);
  };

  const filterTabs = [
    { id: 'all' as const, name: 'All Categories', count: categories.length },
    { id: TransactionType.Income, name: 'Income', count: incomeCount },
    { id: TransactionType.Expense, name: 'Expense', count: expenseCount },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl">
              Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your income and expense categories
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <div className="sm:hidden">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as 'all' | TransactionType)}
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              {filterTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.name} ({tab.count})
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-8">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`${
                    selectedFilter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {categoriesLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        )}

        {/* Categories Grid */}
        {!categoriesLoading && (
          <>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-12">
                <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {selectedFilter === 'all' ? 'No categories' : `No ${selectedFilter === TransactionType.Income ? 'income' : 'expense'} categories`}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedFilter === 'all' 
                    ? 'Get started by creating your first category.' 
                    : `Create your first ${selectedFilter === TransactionType.Income ? 'income' : 'expense'} category.`
                  }
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Category
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Category Details Modal */}
      <CategoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        category={selectedCategory}
      />
    </Layout>
  );
};

export default Categories;