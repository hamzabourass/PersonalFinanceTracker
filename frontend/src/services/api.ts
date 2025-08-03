import axios from 'axios';
import type { CategoryDto, TransactionDto, CreateCategoryRequest, CreateTransactionRequest, TransactionType, UpdateTransactionRequest, UpdateCategoryRequest } from '../types/api';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const categoryApi = {
  getAll: async (type?: TransactionType): Promise<CategoryDto[]> => {
    const params = type ? { type } : {};
    const response = await api.get<CategoryDto[]>('/categories', { params });
    return response.data;
  },

  getById: async (id: string): Promise<CategoryDto> => {
    const response = await api.get<CategoryDto>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<CategoryDto> => {
    const response = await api.post<CategoryDto>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryRequest): Promise<CategoryDto> => {
    const response = await api.put<CategoryDto>(`/categories/${id}`, {
      ...data,
      id
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};

export const transactionApi = {
  getAll: async (params?: {
    take?: number;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }): Promise<TransactionDto[]> => {
    const response = await api.get<TransactionDto[]>('/transactions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<TransactionDto> => {
    const response = await api.get<TransactionDto>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionRequest): Promise<TransactionDto> => {
    const response = await api.post<TransactionDto>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTransactionRequest): Promise<TransactionDto> => {
    const response = await api.put<TransactionDto>(`/transactions/${id}`, {
      ...data,
      id
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  }
};



export default api;