import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TagIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { TransactionType } from '../../types/api';
import type { CategoryDto } from '../../types/api';

interface CategoryChartProps {
  categories: CategoryDto[];
  loading?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ categories, loading = false }) => {
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

export default CategoryChart;