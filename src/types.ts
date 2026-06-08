/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category_id: string;
  stock: number;
  unit_type: string; // EKSEMPLAR, SET, PACK, BOX, dll
  min_stock: number; // default: 10
  price: number;
  created_at: string;
}

export interface StockTransaction {
  id: string;
  invoice_number: string;
  type: 'MASUK' | 'KELUAR';
  product_id: string;
  quantity: number;
  reference_person: string; // Pemasok/penerbit untuk masuk, pelanggan/penerima untuk keluar
  transaction_date: string; // format: YYYY-MM-DD
  notes: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Super Admin';
  status: 'Aktif' | 'Nonaktif';
  avatar?: string;
}

export type UserPayload = Omit<User, 'id'> & {
  password?: string;
};

export type ActivePage =
  | 'dashboard'
  | 'inventory'
  | 'incoming_form'
  | 'outgoing_form'
  | 'categories'
  | 'products'
  | 'users'
  | 'reports'
  | 'profile'
  | 'password'
  | 'system_design';
