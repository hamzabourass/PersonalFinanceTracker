import { create } from 'zustand';
import type { CategoryDto, TransactionDto, TransactionType, UpdateCategoryRequest, UpdateTransactionRequest } from '../types/api';
import { categoryApi, transactionApi } from '../services/api';

interface AppState {
  categories: CategoryDto[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  transactions: TransactionDto[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  
  // Category actions
  fetchCategories: (type?: TransactionType) => Promise<void>;
  addCategory: (category: CategoryDto) => void;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Transaction actions
  fetchTransactions: (params?: {
    take?: number;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }) => Promise<void>;
  addTransaction: (transaction: TransactionDto) => void;
  updateTransaction: (id: string, data: UpdateTransactionRequest) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Error reset functions
  resetCategoriesError: () => void;
  resetTransactionsError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,

  fetchCategories: async (type?: TransactionType) => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const categories = await categoryApi.getAll(type);
      set({ categories, categoriesLoading: false });
    } catch (error: any) {
      set({ 
        categoriesError: error.response?.data?.message || 'Failed to fetch categories',
        categoriesLoading: false 
      });
    }
  },

  addCategory: (category: CategoryDto) => {
    set((state) => ({
      categories: [...state.categories, category]
    }));
  },

  updateCategory: async (id: string, data: UpdateCategoryRequest) => {
    try {
      const updatedCategory = await categoryApi.update(id, data);
      set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === id ? updatedCategory : cat
        )
      }));
    } catch (error: any) {
      set({ 
        categoriesError: error.response?.data?.message || 'Failed to update category'
      });
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await categoryApi.delete(id);
      set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));
    } catch (error: any) {
      set({ 
        categoriesError: error.response?.data?.message || 'Failed to delete category'
      });
      throw error;
    }
  },

  fetchTransactions: async (params) => {
    set({ transactionsLoading: true, transactionsError: null });
    try {
      const transactions = await transactionApi.getAll(params);
      set({ transactions, transactionsLoading: false });
    } catch (error: any) {
      set({ 
        transactionsError: error.response?.data?.message || 'Failed to fetch transactions',
        transactionsLoading: false 
      });
    }
  },

  addTransaction: (transaction: TransactionDto) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions]
    }));
  },

  updateTransaction: async (id: string, data: UpdateTransactionRequest) => {
    try {
      const updatedTransaction = await transactionApi.update(id, data);
      set((state) => ({
        transactions: state.transactions.map(trans => 
          trans.id === id ? updatedTransaction : trans
        )
      }));
    } catch (error: any) {
      set({ 
        transactionsError: error.response?.data?.message || 'Failed to update transaction'
      });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await transactionApi.delete(id);
      set((state) => ({
        transactions: state.transactions.filter(trans => trans.id !== id)
      }));
    } catch (error: any) {
      set({ 
        transactionsError: error.response?.data?.message || 'Failed to delete transaction'
      });
      throw error;
    }
  },

  resetCategoriesError: () => set({ categoriesError: null }),
  resetTransactionsError: () => set({ transactionsError: null }),
}));