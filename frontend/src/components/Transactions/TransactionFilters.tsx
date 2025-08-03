import React, { useState } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TransactionType } from '../../types/api';
import type { CategoryDto } from '../../types/api';

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: 'all' | TransactionType;
  onTypeChange: (type: string) => void;
  selectedCategories: string[]; // Changed from single string to array
  onCategoriesChange: (categoryIds: string[]) => void; // Updated handler
  categories: CategoryDto[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategories,
  onCategoriesChange,
  categories,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Filter categories based on selected type
  const filteredCategories = selectedType === 'all' 
    ? categories 
    : categories.filter(cat => cat.type === selectedType);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // Remove category
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      // Add category
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === filteredCategories.length) {
      // Deselect all
      onCategoriesChange([]);
    } else {
      // Select all filtered categories
      onCategoriesChange(filteredCategories.map(cat => cat.id));
    }
  };

  const getSelectedCategoriesText = () => {
    if (selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length === 1) {
      const category = categories.find(c => c.id === selectedCategories[0]);
      return category?.name || 'Unknown Category';
    }
    return `${selectedCategories.length} categories selected`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search transactions..."
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Types</option>
            <option value={TransactionType.Income}>Income</option>
            <option value={TransactionType.Expense}>Expense</option>
          </select>
        </div>

        {/* Multi-Category Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            disabled={filteredCategories.length === 0}
            className="relative w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <span className="block truncate">
              {filteredCategories.length === 0 ? 'No categories available' : getSelectedCategoriesText()}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {/* Dropdown */}
          {isCategoryDropdownOpen && filteredCategories.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {/* Select All Option */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleSelectAllCategories}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2 border-b border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                    onChange={() => {}} // Handled by button click
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    {selectedCategories.length === filteredCategories.length ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
              </div>

              {/* Category Options */}
              {filteredCategories.map((category) => (
                <div key={category.id} className="relative">
                  <button
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => {}} // Handled by button click
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-gray-900">{category.name}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              max={dateRange.endDate || undefined}
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min={dateRange.startDate || undefined}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 grid grid-cols-2 gap-2">
            <span>From</span>
            <span>To</span>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {selectedType !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                selectedType === TransactionType.Income 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedType === TransactionType.Income ? 'Income' : 'Expense'}
                <button
                  onClick={() => onTypeChange('all')}
                  className={selectedType === TransactionType.Income ? 'ml-2 text-green-600 hover:text-green-800' : 'ml-2 text-red-600 hover:text-red-800'}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <span key={categoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                  <button
                    onClick={() => handleCategoryToggle(categoryId)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ) : null;
            })}
            
            {(dateRange.startDate || dateRange.endDate) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {dateRange.startDate || 'Start'} - {dateRange.endDate || 'End'}
                <button
                  onClick={() => onDateRangeChange({ startDate: '', endDate: '' })}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isCategoryDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsCategoryDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionFilters;