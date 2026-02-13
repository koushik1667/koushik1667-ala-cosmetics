import React, { useState } from 'react';
import { Theme, User } from '../types';

interface UserAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  theme: Theme;
}

const UserAuth: React.FC<UserAuthProps> = ({ isOpen, onClose, onLogin, theme }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    otp: ''
  });

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiService = await import('../api/apiService');
      await apiService.userService.sendOtp({ email: formData.email });
      setOtpSent(true);
      setShowOtpForm(true);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.response?.data?.msg || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiService = await import('../api/apiService');
      const response = await apiService.userService.verifyOtp({
        email: formData.email,
        otp: formData.otp,
        name: isLoginMode ? undefined : formData.name
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.user);
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.response?.data?.msg || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpForm) {
      await handleSendOtp(e);
    } else {
      await handleVerifyOtp(e);
    }
  };



  const borderCol = isDark ? 'border-white/10' : 'border-black/10';
  const inputBg = isDark ? 'bg-white/5' : 'bg-black/5';

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300`}>
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity`} onClick={onClose} />
      
      <div className={`relative w-full max-w-lg overflow-hidden rounded-2xl border ${borderCol} ${isDark ? 'bg-[#0a0a0a] text-white shadow-2xl' : 'bg-white text-black shadow-2xl'}`}>
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 hover:rotate-90 transition-transform">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif mb-2">{isLoginMode ? 'Welcome Back' : 'Join ALA Luxury'}</h2>
            <p className={`text-[10px] tracking-widest uppercase opacity-50`}>
              {showOtpForm 
                ? 'ENTER VERIFICATION CODE' 
                : (isLoginMode ? 'SIGN IN WITH EMAIL' : 'CREATE YOUR BEAUTY PROFILE')}
            </p>
          </div>

          <div className="space-y-4">

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && !showOtpForm && (
                <div className="space-y-1">
                  <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  disabled={otpSent}
                  className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm ${otpSent ? 'opacity-50' : ''}`} 
                />
              </div>

              {showOtpForm && (
                <div className="space-y-1">
                  <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">Verification Code</label>
                  <input 
                    required 
                    type="text" 
                    maxLength={6}
                    value={formData.otp}
                    onChange={e => setFormData({...formData, otp: e.target.value})}
                    className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                    placeholder="Enter 6-digit code"
                  />
                  <p className="text-[10px] opacity-60 mt-1">Check your email for the verification code</p>
                </div>
              )}

              {!isLoginMode && !showOtpForm && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">Phone</label>
                      <input 
                        required 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">City</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">Delivery Address</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-[10px] text-red-500 text-center tracking-widest uppercase animate-pulse">{error}</p>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-[10px] tracking-[0.3em] font-bold transition-all mt-4 flex items-center justify-center space-x-3 ${
                  isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  <span>{showOtpForm ? 'VERIFY CODE' : (isLoginMode ? 'SEND VERIFICATION CODE' : 'SEND VERIFICATION CODE')}</span>
                )}
              </button>

              {showOtpForm && (
                <button 
                  type="button"
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtpSent(false);
                    setFormData({...formData, otp: ''});
                  }}
                  className="w-full py-2 text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4"
                >
                  BACK TO EMAIL
                </button>
              )}
            </form>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setShowOtpForm(false);
                setOtpSent(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  password: '',
                  otp: ''
                });
                setError('');
              }}
              className="text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4"
            >
              {isLoginMode ? "DON'T HAVE AN ACCOUNT? REGISTER" : 'ALREADY HAVE AN ACCOUNT? LOGIN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;