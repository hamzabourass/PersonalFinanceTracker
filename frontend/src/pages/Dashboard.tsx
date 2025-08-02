import React, { useEffect } from 'react';
import { 
  PlusIcon, 
  TagIcon, 
  CreditCardIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon ,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAppStore } from '../store';
import { TransactionType } from '../types/api';
import Layout from '../components/Layout';

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
    fetchTransactions({ take: 5 }); // Get recent 5 transactions
  }, [fetchCategories, fetchTransactions]);

  // Calculate stats
  const totalCategories = categories.length;
  const incomeCategories = categories.filter(c => c.type === TransactionType.Income).length;
  const expenseCategories = categories.filter(c => c.type === TransactionType.Expense).length;
  const totalTransactions = transactions.length;

  // Prepare chart data
  const categoryData = [
    { name: 'Income Categories', value: incomeCategories, color: '#10b981' },
    { name: 'Expense Categories', value: expenseCategories, color: '#ef4444' }
  ];

  // Mock transaction data for demo (replace with real data when available)
  const mockTransactionData = [
    { month: 'Jan', income: 3000, expenses: 2200 },
    { month: 'Feb', income: 3200, expenses: 2400 },
    { month: 'Mar', income: 2800, expenses: 2100 },
    { month: 'Apr', income: 3500, expenses: 2600 },
    { month: 'May', income: 3300, expenses: 2300 },
    { month: 'Jun', income: 3100, expenses: 2500 },
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-blue-100 text-lg">
                Here's your financial overview for {currentMonth}
              </p>
            </div>
            <div className="hidden md:block">
              <CalendarIcon className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {categoriesLoading ? '...' : totalCategories}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <TagIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <span className="text-green-600 font-medium">{incomeCategories} Income</span>
              <span className="text-gray-400">•</span>
              <span className="text-red-600 font-medium">{expenseCategories} Expense</span>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {transactionsLoading ? '...' : totalTransactions}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CreditCardIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>

          {/* Monthly Income (Mock) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$3,100</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">+12.5% from last month</span>
            </div>
          </div>

          {/* Monthly Expenses (Mock) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$2,500</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-red-600 font-medium">+5.2% from last month</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
            {totalCategories > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
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
                  <p>No categories yet</p>
                  <Link to="/categories" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Create your first category
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Monthly Overview Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <Link 
                  to="/transactions" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
              
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === TransactionType.Income ? '+' : '-'}${transaction.amount}
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
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/categories"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <TagIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Manage Categories</p>
                    <p className="text-sm text-gray-500">Add or view categories</p>
                  </div>
                </Link>
                
                <Link 
                  to="/transactions"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CreditCardIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Add Transaction</p>
                    <p className="text-sm text-gray-500">Record income or expense</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Net Income</span>
                  <span className="font-semibold text-green-600">+$600</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Savings Rate</span>
                  <span className="font-semibold text-blue-600">19.4%</span>
                </div>
                <div className="pt-2 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    You're on track to save <span className="font-semibold text-green-600">$7,200</span> this year!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;