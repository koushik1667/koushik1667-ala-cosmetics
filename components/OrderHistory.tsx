
import React, { useMemo } from 'react';
import { Theme, User, Order } from '../types';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  currentUser: User | null;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose, theme, currentUser }) => {
  const isDark = theme === 'dark';
  
  const orders = useMemo(() => {
    if (!currentUser) return [];
    const allOrders: Order[] = JSON.parse(localStorage.getItem('ala_orders') || '[]');
    return allOrders.filter(o => o.userId === currentUser.id).reverse();
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-2xl border ${isDark ? 'bg-[#0a0a0a] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>
        <div className="p-8 border-b border-current/10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif">Purchase History</h2>
            <p className="text-[10px] tracking-widest opacity-50 uppercase mt-1">YOUR ALA COLLECTIONS</p>
          </div>
          <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {orders.length === 0 ? (
            <div className="py-20 text-center space-y-4 opacity-30">
              <i className="fa-solid fa-box-open text-5xl"></i>
              <p className="text-xs tracking-widest">NO ORDERS PLACED YET</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className={`p-6 border rounded-xl ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'} space-y-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] tracking-widest opacity-50 font-mono">ID: #{order.id}</p>
                    <p className="text-[9px] tracking-widest opacity-40">{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-serif silver-gradient">₹{order.total.toLocaleString('en-IN')}</p>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${order.status === 'Confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="opacity-70">{item.quantity}x {item.name}</span>
                      <span className="opacity-40">{Object.values(item.selectedVariants).join(' / ')}</span>
                    </div>
                  ))}
                </div>

                {order.utr && (
                  <div className="pt-4 border-t border-current/5 flex justify-between items-center">
                    <span className="text-[9px] tracking-widest opacity-50">PAYMENT: {order.paymentMethod}</span>
                    <span className="text-[9px] font-mono opacity-50">UTR: {order.utr}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
