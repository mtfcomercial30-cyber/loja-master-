
export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  AUDITOR = 'AUDITOR'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  risk_score: number;
  salary?: number;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  supplier_id: string;
  cost_price: number;
  sale_price: number;
  stock_quantity: number;
  min_stock: number;
  last_restock?: string;
}

export interface RegisterSession {
  id: string;
  register_name: string;
  opened_by: string;
  opened_at: string;
  closed_at?: string;
  initial_cash: number;
  final_cash_reported?: number;
  final_card_reported?: number;
  expected_cash?: number;
  status: 'OPEN' | 'CLOSED';
  difference?: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action_type: 'PRICE_OVERRIDE' | 'CANCELLATION' | 'REFUND' | 'STOCK_ADJUSTMENT' | 'LOGIN';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  created_at: string;
}

export interface TimeLog {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out?: string;
}
