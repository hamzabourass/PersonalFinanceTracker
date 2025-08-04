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
import FinancialSummary from '../components/Dashboard/FinancialSummary';
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
    <Layout>
      <div className="space-y-8">
        <WelcomeCard currentMonth={currentMonth} hasData={hasData} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Categories"
            value={totalCategories}
            icon={TagIcon}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            bubbles={[
              {
                label: "Income",
                value: incomeCategories,
                color: "green"
              },
              {
                label: "Expense", 
                value: expenseCategories,
                color: "red"
              }
            ]}
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <MonthlyChart 
              transactions={transactions}
              loading={transactionsLoading}
            />
          </div>

          <div className="xl:col-span-1">
            <TopSpendingChart 
              transactions={transactions}
              loading={transactionsLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentTransactions 
              transactions={transactions.slice(0, 5)}
              loading={transactionsLoading}
              onTransactionClick={handleTransactionClick}
            />
          </div>

          <div className="lg:col-span-1">
            <QuickActions 
              categoriesCount={totalCategories}
              transactionsCount={totalTransactions}
            />
            
            <FinancialSummary
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              totalCategories={totalCategories}
              totalTransactions={totalTransactions}
              hasData={hasData}
              loading={isLoading}
            />
          </div>
        </div>

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

      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        transaction={selectedTransaction}
      />
    </Layout>
  );
};

export default Dashboard;