
import React from 'react';
import { CartItem, Theme } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (key: string) => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onProceedToCheckout: () => void;
  theme: Theme;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onProceedToCheckout, theme }) => {
  const isDark = theme === 'dark';
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const borderCol = isDark ? 'border-white/5' : 'border-black/5';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-[70] shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isDark ? 'bg-[#0d0d0d] text-white' : 'bg-[#fcfcfc] text-black'}`}>
        <div className="flex flex-col h-full">
          <div className={`p-8 border-b ${borderCol} flex justify-between items-center`}>
            <h2 className="text-2xl font-serif">Your Bag</h2>
            <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30 text-center">
                <i className="fa-solid fa-bag-shopping text-6xl"></i>
                <p className="text-sm tracking-widest">YOUR BAG IS EMPTY</p>
              </div>
            ) : (
              items.map(item => {
                const itemKey = `${item.id}-${JSON.stringify(item.selectedVariants)}`;
                return (
                  <div key={itemKey} className="flex space-x-4 group">
                    <div className={`h-24 w-20 overflow-hidden flex-shrink-0 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                      <img src={item.image} className="h-full w-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-medium tracking-wide">{item.name}</h3>
                          {/* Selected Variants display */}
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(item.selectedVariants).map(([name, value]) => (
                              <span key={name} className="text-[8px] tracking-widest opacity-60 bg-current/5 px-1 rounded">
                                {name.toUpperCase()}: {value.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => onRemove(itemKey)} className={`text-[10px] tracking-widest transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}>
                          REMOVE
                        </button>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>₹{item.price.toLocaleString('en-IN')}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button 
                          onClick={() => onUpdateQuantity(itemKey, -1)}
                          className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${borderCol} hover:bg-current/5`}
                        >
                          -
                        </button>
                        <span className="text-xs font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(itemKey, 1)}
                          className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${borderCol} hover:bg-current/5`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className={`p-8 border-t ${borderCol} ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'} space-y-6`}>
              <div className="flex justify-between items-center text-lg font-serif">
                <span>Total</span>
                <span className={`font-bold ${isDark ? 'silver-gradient' : 'text-black'}`}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className={`text-[10px] tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Shipping and taxes calculated at checkout.
              </p>
              <button 
                onClick={onProceedToCheckout}
                className={`w-full py-4 text-[10px] tracking-[0.2em] font-bold transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
