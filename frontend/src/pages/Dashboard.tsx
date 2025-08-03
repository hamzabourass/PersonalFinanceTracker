// Updated Dashboard.tsx using proper component imports
import React, { useEffect, useState } from 'react';
import { 
  TagIcon, 
  CreditCardIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { TransactionType } from '../types/api';
import type { TransactionDto } from '../types/api';
import Layout from '../components/Layout';

import QuickActions from '../components/Dashboard/QuickActions';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import StatsCard from '../components/Dashboard/StatsCard';
import WelcomeCard from '../components/Dashboard/WelcomeCard';
import TopSpendingChart from '../components/Dashboard/TopSpendingChart';
import MonthlyChart from '../components/Dashboard/MonthlyChart';
import TransactionDetailsModal from '../components/Transactions/TransactionDetailsModal';

const Dashboard: React.FC = () => {
  const { 
    categories, 
    categoriesLoading, 
    fetchCategories,
    transactions,
    transactionsLoading,
    fetchTransactions
  } = useAppStore();

  // State for transaction details modal
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  // Calculate real stats from API data
  const totalCategories = categories.length;
  const incomeCategories = categories.filter(c => c.type === TransactionType.Income).length;
  const expenseCategories = categories.filter(c => c.type === TransactionType.Expense).length;
  const totalTransactions = transactions.length;
  
  // Calculate financial data from real transactions
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.Income)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === TransactionType.Expense)
    .reduce((sum, t) => sum + t.amount, 0);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const hasData = totalCategories > 0 || totalTransactions > 0;
  const isLoading = categoriesLoading || transactionsLoading;

  // Handler for transaction clicks
  const handleTransactionClick = (transaction: TransactionDto) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeCard currentMonth={currentMonth} hasData={hasData} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Categories"
            value={totalCategories}
            icon={TagIcon}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            subtitle={`${incomeCategories} Income • ${expenseCategories} Expense`}
            loading={categoriesLoading}
          />
          
          <StatsCard
            title="Total Transactions"
            value={totalTransactions}
            icon={CreditCardIcon}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
            subtitle="All time"
            loading={transactionsLoading}
          />
          
          <StatsCard
            title="Total Income"
            value={totalIncome > 0 ? `$${totalIncome.toFixed(2)}` : '$0.00'}
            icon={ArrowTrendingUpIcon}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
            subtitle="From all transactions"
            loading={transactionsLoading}
          />
          
          <StatsCard
            title="Total Expenses"
            value={totalExpenses > 0 ? `$${totalExpenses.toFixed(2)}` : '$0.00'}
            icon={ArrowTrendingDownIcon}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            subtitle="From all transactions"
            loading={transactionsLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Monthly Income vs Expenses Chart */}
          <div className="xl:col-span-2">
            <MonthlyChart 
              transactions={transactions}
              loading={transactionsLoading}
            />
          </div>

          {/* Top Spending Categories Chart */}
          <div className="xl:col-span-1">
            <TopSpendingChart 
              transactions={transactions}
              loading={transactionsLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions 
              transactions={transactions.slice(0, 2)}
              loading={transactionsLoading}
              onTransactionClick={handleTransactionClick}
            />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions 
              categoriesCount={totalCategories}
              transactionsCount={totalTransactions}
            />
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Balance</span>
                <span className={`font-semibold ${
                  (totalIncome - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </span>
              </div>
              
              {totalIncome > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expense Ratio</span>
                  <span className="font-semibold text-blue-600">
                    {((totalExpenses / totalIncome) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              
              <div className="pt-2 border-t border-green-200">
                {hasData ? (
                  <p className="text-sm text-gray-600">
                    {totalTransactions > 0 
                      ? `You have ${totalTransactions} transactions across ${totalCategories} categories.`
                      : `You have ${totalCategories} categories ready for transactions.`
                    }
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Start by creating categories and adding your first transactions.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Getting Started Section - Only show when no data */}
        {!hasData && !isLoading && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Started with Your Financial Journey</h3>
              <p className="text-gray-600 mb-6">
                Begin by setting up your income and expense categories, then start tracking your transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/categories"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <TagIcon className="h-5 w-5 mr-2" />
                  Create Categories
                </Link>
                <Link
                  to="/transactions"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Transaction
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        transaction={selectedTransaction}
      />
    </Layout>
  );
};

export default Dashboard;