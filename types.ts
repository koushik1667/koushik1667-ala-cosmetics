
export interface Variant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  variants?: Variant[];
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped';
  paymentMethod: 'UPI' | 'COD';
  utr?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariants: Record<string, string>;
}

export type ViewMode = 'user' | 'admin';
export type Theme = 'light' | 'dark';
