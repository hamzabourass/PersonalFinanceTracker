import React from 'react';
import { format } from 'date-fns';
import type { CategoryDto } from '../../types/api';
import { TransactionType } from '../../types/api';

interface CategoryCardProps {
  category: CategoryDto;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const isIncomeCategory = category.type === TransactionType.Income;

  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }} // 20% opacity
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </div>
          
          <div className="ml-3 flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {category.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Created {format(new Date(category.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="ml-2 flex-shrink-0">
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isIncomeCategory
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isIncomeCategory ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;