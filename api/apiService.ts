import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variants: Array<{ type: string; values: Array<{ value: string; additionalPrice?: number }> }>;
  images: string[];
  inStock: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface Order {
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedVariants: Map<string, string>;
  }>;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface OtpData {
  email: string;
  otp?: string;
  name?: string;
}

// Product API functions
export const productService = {
  getAllProducts: () => api.get<Product[]>('/products'),
  getProductById: (id: string) => api.get<Product>(`/products/${id}`),
  createProduct: (productData: Omit<Product, 'id'>) => api.post<Product>('/products', productData),
  updateProduct: (id: string, productData: Product) => api.put<Product>(`/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/products/${id}`)
};

// User API functions
export const userService = {
  register: (userData: RegisterData) => api.post('/users/register', userData),
  login: (credentials: LoginCredentials) => api.post('/users/login', credentials),
  loginWithGoogle: (googleToken: string) => api.post('/users/google-login', { token: googleToken }),
  registerWithGoogle: (userData: RegisterData) => api.post('/users/google-register', userData),
  getProfile: () => api.get<User>('/users/profile'),
  sendOtp: (otpData: OtpData) => api.post('/users/send-otp', otpData),
  verifyOtp: (otpData: OtpData) => api.post('/users/verify-otp', otpData)
};

// Order API functions
export const orderService = {
  createOrder: (orderData: Order) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id: string) => api.get(`/orders/${id}`)
};

export default api;