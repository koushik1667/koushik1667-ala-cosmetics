
import React, { useState, useEffect } from 'react';
import { CartItem, Theme, User, Order } from '../types';
import { MERCHANT_UPI_ID, MERCHANT_NAME } from '../constants';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
  theme: Theme;
  currentUser: User | null;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, onOrderSuccess, theme, currentUser }) => {
  const [step, setStep] = useState<1 | 2>(1); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '' });

  useEffect(() => {
    if (currentUser) {
      setFormData({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone, address: currentUser.address, city: currentUser.city });
    }
  }, [currentUser, isOpen]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isDark = theme === 'dark';
  const upiUrl = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('ALA Order')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}&bgcolor=${isDark ? '0a0a0a' : 'ffffff'}&color=${isDark ? 'ffffff' : '000000'}`;

  const handlePlaceOrder = () => {
    if (paymentMethod === 'UPI' && utrNumber.length < 8) {
      alert("Invalid UTR. Please enter the 12-digit ID from your app.");
      return;
    }

    setIsVerifying(true);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: currentUser?.id || 'guest',
      items: [...items],
      total,
      date: new Date().toISOString(),
      status: 'Confirmed',
      paymentMethod,
      utr: paymentMethod === 'UPI' ? utrNumber : undefined
    };

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      onOrderSuccess(newOrder);
    }, 2000);
  };

  const closeAndReset = () => {
    onClose();
    setTimeout(() => { setStep(1); setIsSuccess(false); setUtrNumber(''); }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeAndReset} />
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row rounded-2xl border ${isDark ? 'bg-[#0a0a0a] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>
        <button onClick={closeAndReset} className="absolute top-6 right-6 z-20 p-2 hover:rotate-90 transition-transform"><i className="fa-solid fa-xmark text-xl"></i></button>

        {isSuccess ? (
          <div className="w-full py-20 px-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-24 w-24 rounded-full flex items-center justify-center bg-current/5 mb-4"><i className="fa-solid fa-check text-4xl silver-gradient"></i></div>
            <h2 className="text-4xl font-serif">Order Received</h2>
            <p className="max-w-md text-xs tracking-widest opacity-60">Success! Your order has been placed. {paymentMethod === 'UPI' ? 'Our team is validating UTR: ' + utrNumber : 'We will reach out soon.'}</p>
            <button onClick={closeAndReset} className={`px-12 py-4 text-[10px] tracking-[0.3em] font-bold ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>CONTINUE SHOPPING</button>
          </div>
        ) : (
          <>
            <div className="flex-grow p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="mb-8 flex space-x-4"><span className={`text-[10px] tracking-widest ${step === 1 ? 'silver-gradient font-bold' : 'opacity-30'}`}>01 SHIPPING</span><span className={`text-[10px] tracking-widest ${step === 2 ? 'silver-gradient font-bold' : 'opacity-30'}`}>02 PAYMENT</span></div>
              {step === 1 ? (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                  <h3 className="text-2xl font-serif">Shipping Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input required placeholder="FULL NAME" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-current/5 border-b border-current/10 py-3 px-4 focus:outline-none focus:border-current text-sm`} />
                    <input required placeholder="EMAIL" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full bg-current/5 border-b border-current/10 py-3 px-4 focus:outline-none focus:border-current text-sm`} />
                    <input required placeholder="ADDRESS" type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`md:col-span-2 w-full bg-current/5 border-b border-current/10 py-3 px-4 focus:outline-none focus:border-current text-sm`} />
                    <input required placeholder="CITY" type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={`w-full bg-current/5 border-b border-current/10 py-3 px-4 focus:outline-none focus:border-current text-sm`} />
                    <input required placeholder="PHONE" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full bg-current/5 border-b border-current/10 py-3 px-4 focus:outline-none focus:border-current text-sm`} />
                  </div>
                  <button type="submit" className={`mt-8 w-full py-4 text-[10px] tracking-[0.3em] font-bold ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>NEXT: PAYMENT METHOD</button>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center"><button onClick={() => setStep(1)} className="text-[10px] opacity-40 hover:opacity-100 transition-opacity">BACK</button><h3 className="text-2xl font-serif">Payment</h3></div>
                  <div className="space-y-4">
                    <button onClick={() => setPaymentMethod('UPI')} className={`w-full p-6 border rounded-xl text-left transition-all ${paymentMethod === 'UPI' ? 'border-current bg-current/5' : 'border-current/10'}`}>
                      <p className="font-bold text-sm tracking-widest">INSTANT UPI TRANSFER</p>
                      {paymentMethod === 'UPI' && (
                        <div className="mt-6 flex flex-col md:flex-row items-center gap-6 animate-in fade-in">
                          <img src={qrCodeUrl} className="w-32 h-32 p-2 bg-white rounded-lg shadow-xl" alt="" />
                          <div className="space-y-4 flex-grow">
                             <p className="text-[10px] tracking-widest opacity-60">1. SCAN QR & PAY<br/>2. ENTER 12-DIGIT UTR BELOW</p>
                             <input required placeholder="ENTER UTR NUMBER" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} className="w-full bg-transparent border-b border-current/40 py-2 font-mono text-sm focus:outline-none focus:border-current" />
                          </div>
                        </div>
                      )}
                    </button>
                    <button onClick={() => setPaymentMethod('COD')} className={`w-full p-6 border rounded-xl text-left transition-all ${paymentMethod === 'COD' ? 'border-current bg-current/5' : 'border-current/10'}`}>
                      <p className="font-bold text-sm tracking-widest uppercase">Cash on Delivery</p>
                      <p className="text-[10px] opacity-40 mt-1 uppercase">Pay when you receive the product</p>
                    </button>
                  </div>
                  <button onClick={handlePlaceOrder} disabled={isVerifying} className={`mt-8 w-full py-4 text-[10px] tracking-[0.3em] font-bold flex items-center justify-center space-x-3 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} disabled:opacity-20`}>
                    {isVerifying ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <span>CONFIRM ORDER</span>}
                  </button>
                </div>
              )}
            </div>
            <div className={`w-full md:w-80 p-8 border-l border-current/10 flex flex-col justify-between ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
              <div className="space-y-6">
                <h4 className="text-[10px] tracking-[0.3em] opacity-40 uppercase">Summary</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] tracking-tight">
                      <span className="opacity-70 truncate max-w-[140px]">{item.quantity}x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-current/10 flex justify-between text-2xl font-serif"><span>Total</span><span className="silver-gradient">₹{total.toLocaleString('en-IN')}</span></div>
              </div>
              <p className="text-[8px] tracking-[0.3em] opacity-30 text-center uppercase">Secure ala checkout system</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
