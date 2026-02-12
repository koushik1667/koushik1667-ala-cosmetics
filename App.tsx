
import React, { useState, useEffect } from 'react';
import { ViewMode, Product, CartItem, Theme, User, Order } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import UserAuth from './components/UserAuth';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import ProductDetail from './components/ProductDetail';
import { productService, userService, orderService } from './api/apiService';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    // Load products from backend API
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to localStorage if API fails
        const savedProducts = localStorage.getItem('ala_products');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem('ala_products', JSON.stringify(INITIAL_PRODUCTS));
        }
      }
    };
    
    fetchProducts();

    const savedTheme = localStorage.getItem('ala_theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    const savedUser = localStorage.getItem('ala_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedCart = localStorage.getItem('ala_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    // Save products to backend API
    const saveProducts = async () => {
      // We'll update products individually when they change, rather than bulk saving
    };
    
    saveProducts();
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ala_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ala_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, selectedVariants: Record<string, string>) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          quantity: newCart[existingIndex].quantity + 1 
        };
        return newCart;
      }
      return [...prev, { ...product, quantity: 1, selectedVariants }];
    });
    setIsCartOpen(true);
    setSelectedProduct(null); // Close detail view on add
  };

  const removeFromCart = (cartItemKey: string) => {
    setCart(prev => prev.filter(item => {
      const key = `${item.id}-${JSON.stringify(item.selectedVariants)}`;
      return key !== cartItemKey;
    }));
  };

  const updateQuantity = (cartItemKey: string, delta: number) => {
    setCart(prev => prev.map(item => {
      const key = `${item.id}-${JSON.stringify(item.selectedVariants)}`;
      if (key === cartItemKey) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ala_cart');
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const response = await productService.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: 'Cosmetics',
        variants: newProduct.variants?.map(v => ({
          type: v.name,
          values: v.options.map(opt => ({ value: opt }))
        })) || [],
        images: [newProduct.image],
        inStock: newProduct.inStock
      });
      // Fetch updated products list after addition
      const updatedProductsResponse = await productService.getAllProducts();
      setProducts(updatedProductsResponse.data);
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback to local state if API fails
      const product: Product = { ...newProduct, id: Date.now().toString() };
      setProducts(prev => [...prev, product]);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await productService.updateProduct(updatedProduct.id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        category: 'Cosmetics',
        variants: updatedProduct.variants?.map(v => ({
          type: v.name,
          values: v.options.map(opt => ({ value: opt }))
        })) || [],
        images: [updatedProduct.image],
        inStock: updatedProduct.inStock
      });
      // Fetch updated products list after update
      const updatedProductsResponse = await productService.getAllProducts();
      setProducts(updatedProductsResponse.data);
    } catch (error) {
      console.error('Error updating product:', error);
      // Fallback to local state if API fails
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      // Fallback to local state if API fails
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleView = () => setViewMode(prev => prev === 'user' ? 'admin' : 'user');
  const handleToggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const handleLogoutAdmin = () => { setIsAdminAuthenticated(false); setViewMode('user'); };

  const handleUserLogin = async (user: User) => {
    try {
      const response = await userService.login({ email: user.email, password: user.password || 'default_password' });
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Get user profile after login
      const profileResponse = await userService.getProfile();
      setCurrentUser(profileResponse.data);
      
      setIsUserAuthOpen(false);
    } catch (error) {
      console.error('Error logging in:', error);
      // Fallback to local state if API fails
      setCurrentUser(user);
      localStorage.setItem('ala_current_user', JSON.stringify(user));
      setIsUserAuthOpen(false);
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ala_current_user');
    localStorage.removeItem('token');
    setIsOrdersOpen(false);
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setIsUserAuthOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = async (order: Order) => {
    try {
      const orderData = {
        userId: currentUser?.id || 'guest',
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        paymentMethod: order.paymentMethod || 'COD'
      };
      
      await orderService.createOrder(orderData);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      // Fallback to local state if API fails
      const savedOrders = JSON.parse(localStorage.getItem('ala_orders') || '[]');
      localStorage.setItem('ala_orders', JSON.stringify([...savedOrders, order]));
      clearCart();
    }
  };

  const themeClasses = theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8f8f8] text-[#1a1a1a]';

  // Admin login handler
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setViewMode('admin');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${themeClasses}`}>
      <Navbar 
        viewMode={viewMode} theme={theme}
        onToggleView={handleToggleView} onToggleTheme={handleToggleTheme}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isAuthenticated={isAdminAuthenticated}
        onLogoutAdmin={handleLogoutAdmin}
        currentUser={currentUser}
        onOpenUserAuth={() => setIsUserAuthOpen(true)}
        onUserLogout={handleUserLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />
      
      <main className="flex-grow">
        {viewMode === 'user' ? (
          <Storefront products={products} onAddToCart={addToCart} onSelectProduct={setSelectedProduct} theme={theme} />
        ) : (
          isAdminAuthenticated ? (
            <AdminPanel 
              products={products} onAddProduct={handleAddProduct} 
              onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} 
              theme={theme}
            />
          ) : (
            <AdminLogin onLogin={handleAdminLogin} theme={theme} />
          )
        )}
      </main>

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
          theme={theme} 
        />
      )}

      <UserAuth isOpen={isUserAuthOpen} onClose={() => setIsUserAuthOpen(false)} onLogin={handleUserLogin} theme={theme} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onProceedToCheckout={handleProceedToCheckout} theme={theme} />
      <Checkout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cart} onOrderSuccess={handleOrderSuccess} theme={theme} currentUser={currentUser} />
      <OrderHistory isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} theme={theme} currentUser={currentUser} />

      <footer className={`py-12 px-6 border-t text-center text-sm ${theme === 'dark' ? 'border-white/5 text-gray-500' : 'border-black/5 text-gray-400'}`}>
        <p>© {new Date().getFullYear()} ALA COSMETICS. THE NEW WAVE OF BEAUTY.</p>
      </footer>
    </div>
  );
};

export default App;
