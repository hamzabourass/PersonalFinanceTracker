import React, { useEffect, useState, useMemo } from 'react';
import { PlusIcon, CreditCardIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { TransactionType } from '../types/api';
import type { TransactionDto } from '../types/api';
import Layout from '../components/Layout';
import TransactionCard from '../components/Transactions/TransactionCard';
import CreateTransactionModal from '../components/Transactions/CreateTransactionModal';
import TransactionDetailsModal from '../components/Transactions/TransactionDetailsModal';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionStats from '../components/Transactions/TransactionStats';
import Pagination from '../components/Transactions/Pagination';

const Transactions: React.FC = () => {
  const { 
    transactions, 
    transactionsLoading, 
    transactionsError, 
    fetchTransactions, 
    resetTransactionsError,
    categories,
    categoriesLoading,
    fetchCategories
  } = useAppStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Changed to array
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTransactions({ take: 1000 });
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  useEffect(() => {
    if (transactionsError) {
      toast.error(transactionsError);
      resetTransactionsError();
    }
  }, [transactionsError, resetTransactionsError]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => {
        const matchesDescription = transaction.description.toLowerCase().includes(searchLower);
        const matchesCategory = transaction.category.name.toLowerCase().includes(searchLower);
        const matchesNotes = transaction.notes?.toLowerCase().includes(searchLower);
        return matchesDescription || matchesCategory || matchesNotes;
      });
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedType);
    }

    // Updated to handle multiple categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(transaction => 
        selectedCategories.includes(transaction.category.id)
      );
    }

    if (dateRange.startDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return transactionDate >= dateRange.startDate;
      });
    }

    if (dateRange.endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return transactionDate <= dateRange.endDate;
      });
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [transactions, searchTerm, selectedType, selectedCategories, dateRange]); // Updated dependency

  const totalItems = filteredAndSortedTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, selectedCategories, dateRange, searchTerm, pageSize]); // Updated dependency

  const hasActiveFilters = searchTerm || selectedType !== 'all' || selectedCategories.length > 0 || 
                          dateRange.startDate || dateRange.endDate; // Updated condition

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategories([]); // Clear array
    setDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleTransactionClick = (transaction: TransactionDto) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleTypeChange = (type: string) => {
    if (type === 'all') {
      setSelectedType('all');
    } else {
      setSelectedType(parseInt(type) as TransactionType);
    }
    setSelectedCategories([]); // Clear categories when type changes
  };

  const getFilterCounts = () => {
    const allCount = transactions.length;
    const incomeCount = transactions.filter(t => t.type === TransactionType.Income).length;
    const expenseCount = transactions.filter(t => t.type === TransactionType.Expense).length;
    
    return {
      all: allCount,
      income: incomeCount,
      expense: expenseCount
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters 
                ? `${filteredAndSortedTransactions.length} of ${transactions.length} transactions (filtered)`
                : `${transactions.length} transactions`
              }
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                  {[
                    searchTerm, 
                    selectedType !== 'all', 
                    selectedCategories.length > 0, // Updated
                    dateRange.startDate, 
                    dateRange.endDate
                  ].filter(Boolean).length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={categoriesLoading || categories.length === 0}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>

        {!categoriesLoading && categories.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  No categories available
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    You need to create categories before adding transactions.{' '}
                    <a href="/categories" className="font-medium underline hover:text-amber-600">
                      Create categories first
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-gray-200">
          <div className="sm:hidden">
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types ({filterCounts.all})</option>
              <option value={TransactionType.Income}>Income ({filterCounts.income})</option>
              <option value={TransactionType.Expense}>Expenses ({filterCounts.expense})</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-8">
              <button
                onClick={() => handleTypeChange('all')}
                className={`${
                  selectedType === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors`}
              >
                All Types ({filterCounts.all})
              </button>
              <button
                onClick={() => handleTypeChange(TransactionType.Income.toString())}
                className={`${
                  selectedType === TransactionType.Income
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors`}
              >
                Income ({filterCounts.income})
              </button>
              <button
                onClick={() => handleTypeChange(TransactionType.Expense.toString())}
                className={`${
                  selectedType === TransactionType.Expense
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors`}
              >
                Expenses ({filterCounts.expense})
              </button>
            </nav>
          </div>
        </div>

        <TransactionStats transactions={filteredAndSortedTransactions} loading={transactionsLoading} />

        {showFilters && (
          <TransactionFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            selectedCategories={selectedCategories} // Updated prop
            onCategoriesChange={setSelectedCategories} // Updated prop
            categories={categories}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          {transactionsLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : paginatedTransactions.length > 0 ? (
            <>
              <div className="p-6">
                <div className="space-y-4">
                  {paginatedTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => handleTransactionClick(transaction)}
                    />
                  ))}
                </div>
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  loading={transactionsLoading}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {hasActiveFilters ? 'No matching transactions' : 'No transactions'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by adding your first transaction.'
                }
              </p>
              {!hasActiveFilters && categories.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Your First Transaction
                  </button>
                </div>
              )}
              {hasActiveFilters && (
                <div className="mt-6">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        transaction={selectedTransaction}
      />
    </Layout>
  );
};

export default Transactions;