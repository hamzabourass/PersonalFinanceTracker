import { create } from 'zustand';
import type { CategoryDto, TransactionDto, TransactionType } from '../types/api';
import { categoryApi, transactionApi } from '../services/api';

interface AppState {
  categories: CategoryDto[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  transactions: TransactionDto[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  
  fetchCategories: (type?: TransactionType) => Promise<void>;
  addCategory: (category: CategoryDto) => void;
  
  fetchTransactions: (params?: {
    take?: number;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }) => Promise<void>;
  addTransaction: (transaction: TransactionDto) => void;
  
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

  // Reset error functions
  resetCategoriesError: () => set({ categoriesError: null }),
  resetTransactionsError: () => set({ transactionsError: null }),
}));