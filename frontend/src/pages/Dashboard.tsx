import React, { useEffect } from 'react';
import { 
  TagIcon, 
  CreditCardIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import { useAppStore } from '../store';
import { TransactionType } from '../types/api';
import Layout from '../components/Layout';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  subtitle?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  subtitle,
  loading = false
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          )}
          {subtitle && !loading && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const WelcomeCard: React.FC<{ currentMonth: string; hasData: boolean }> = ({ currentMonth, hasData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100 text-lg">
            {hasData 
              ? `Here's your financial overview for ${currentMonth}`
              : `Let's get started with your financial tracking for ${currentMonth}`
            }
          </p>
        </div>
        <div className="hidden md:block">
          <CalendarIcon className="h-16 w-16 text-blue-200" />
        </div>
      </div>
    </div>
  );
};

const CategoryChart: React.FC<{ categories: any[]; loading: boolean }> = ({ categories, loading }) => {
  const incomeCategories = categories.filter(c => c.type === TransactionType.Income).length;
  const expenseCategories = categories.filter(c => c.type === TransactionType.Expense).length;
  
  const data = [
    { name: 'Income Categories', value: incomeCategories, color: '#10b981' },
    { name: 'Expense Categories', value: expenseCategories, color: '#ef4444' }
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
      {categories.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <TagIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-2">No categories yet</p>
            <Link 
              to="/categories" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Create your first category
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const RecentTransactions: React.FC<{ transactions: any[]; loading: boolean }> = ({ transactions, loading }) => {
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

const QuickActions: React.FC<{ categoriesCount: number; transactionsCount: number }> = ({ categoriesCount, transactionsCount }) => {
  const actions = [
    {
      to: '/categories',
      icon: TagIcon,
      title: 'Manage Categories',
      description: categoriesCount > 0 ? `${categoriesCount} categories` : 'Add categories',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'group-hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      to: '/transactions',
      icon: CreditCardIcon,
      title: 'Add Transaction',
      description: transactionsCount > 0 ? `${transactionsCount} transactions` : 'Record income or expense',
      bgColor: 'bg-green-50',
      hoverBgColor: 'group-hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      to: '/reports',
      icon: ChartBarIcon,
      title: 'View Reports',
      description: 'Analytics & insights',
      bgColor: 'bg-purple-50',
      hoverBgColor: 'group-hover:bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link 
            key={action.to}
            to={action.to}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`${action.bgColor} ${action.hoverBgColor} p-2 rounded-lg transition-colors`}>
              <action.icon className={`h-5 w-5 ${action.iconColor}`} />
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{action.title}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { 
    categories, 
    categoriesLoading, 
    fetchCategories,
    transactions,
    transactionsLoading,
    fetchTransactions
  } = useAppStore();

useEffect(() => {
  fetchCategories();
  fetchTransactions({ take: 5 }); // Get recent 5 transactions for dashboard
}, [fetchCategories, fetchTransactions]);

  const totalCategories = categories.length;
  const incomeCategories = categories.filter(c => c.type === TransactionType.Income).length;
  const expenseCategories = categories.filter(c => c.type === TransactionType.Expense).length;
  const totalTransactions = transactions.length;
  
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
            value={totalIncome > 0 ? `${totalIncome.toFixed(2)}` : '$0.00'}
            icon={ArrowTrendingUpIcon}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
            subtitle="From all transactions"
            loading={transactionsLoading}
          />
          
          <StatsCard
            title="Total Expenses"
            value={totalExpenses > 0 ? `${totalExpenses.toFixed(2)}` : '$0.00'}
            icon={ArrowTrendingDownIcon}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            subtitle="From all transactions"
            loading={transactionsLoading}
          />
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Chart */}
          <div className="lg:col-span-1">
            <CategoryChart 
              categories={categories}
              loading={categoriesLoading}
            />
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactions 
              transactions={transactions.slice(0, 5)}
              loading={transactionsLoading}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <QuickActions 
            categoriesCount={totalCategories}
            transactionsCount={totalTransactions}
          />

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
    </Layout>
  );
};

export default Dashboard;