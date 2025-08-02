export const TransactionType = {
  Income: 1,
  Expense: 2
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  type: TransactionType;
  color: string;
  createdAt: string;
}

export interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  currency: string;
  type: TransactionType;
  date: string;
  notes?: string;
  category: CategoryDto;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  type: TransactionType;
  color?: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  currency?: string;
  type: TransactionType;
  date: string;
  categoryId: string;
  notes?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}