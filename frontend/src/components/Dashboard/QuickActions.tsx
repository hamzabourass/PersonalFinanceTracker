import React from 'react';
import { Link } from 'react-router-dom';
import { TagIcon, CreditCardIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface QuickActionsProps {
  categoriesCount: number;
  transactionsCount: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ categoriesCount, transactionsCount }) => {
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

export default QuickActions;