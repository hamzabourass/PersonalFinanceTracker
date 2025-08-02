// src/components/Dashboard/MonthlyChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowTrendingUpIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import type { TransactionDto } from '../../types/api';
import { TransactionType } from '../../types/api';

interface MonthlyChartProps {
  transactions: TransactionDto[];
  loading?: boolean;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ transactions, loading = false }) => {
  // Generate last 6 months data
  const monthlyData = React.useMemo(() => {
    const months = [];
    const currentDate = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      // Filter transactions for this month
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      // Calculate income and expenses for this month
      const income = monthTransactions
        .filter(t => t.type === TransactionType.Income)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === TransactionType.Expense)
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: format(monthDate, 'MMM yyyy'),
        shortMonth: format(monthDate, 'MMM'),
        income: income,
        expenses: expenses,
        net: income - expenses,
        date: monthDate
      });
    }
    
    return months;
  }, [transactions]);

  const hasData = monthlyData.some(month => month.income > 0 || month.expenses > 0);
  const maxValue = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses))) || 1000;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-10 ">
        <div className="flex items-center space-x-3 mb-6">
          <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Income:
              </span>
              <span className="text-sm font-semibold text-green-600">
                ${data.income.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Expenses:
              </span>
              <span className="text-sm font-semibold text-red-600">
                ${data.expenses.toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-1 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">Net:</span>
                <span className={`text-sm font-bold ${
                  data.net >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.net >= 0 ? '+' : ''}${data.net.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
            <p className="text-sm text-gray-500">Income vs Expenses over time</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last 6 Months</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Income</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Expenses</span>
            </div>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="shortMonth" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  stroke="#64748b"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Monthly Income</p>
              <p className="text-lg font-semibold text-green-600">
                ${(monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Monthly Expenses</p>
              <p className="text-lg font-semibold text-red-600">
                ${(monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Monthly Net</p>
              <p className={`text-lg font-semibold ${
                (monthlyData.reduce((sum, m) => sum + m.net, 0) / monthlyData.length) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ${(monthlyData.reduce((sum, m) => sum + m.net, 0) / monthlyData.length).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No transaction data</h4>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Add some transactions to see your monthly income and expense trends over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyChart;