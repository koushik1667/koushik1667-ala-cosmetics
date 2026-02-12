import React, { useState } from 'react';
import { Theme, User } from '../types';
import { GoogleLogin } from '@react-oauth/google';

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
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Handle login with backend
        const response = await import('../api/apiService').then(mod => 
          mod.userService.login({ email: formData.email, password: formData.password })
        );
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          // Get user profile after login
          const profileResponse = await import('../api/apiService').then(mod => 
            mod.userService.getProfile()
          );
          
          onLogin(profileResponse.data);
        }
      } else {
        // Handle registration with backend
        const response = await import('../api/apiService').then(mod => 
          mod.userService.register(formData)
        );
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          // Get user profile after registration
          const profileResponse = await import('../api/apiService').then(mod => 
            mod.userService.getProfile()
          );
          
          onLogin(profileResponse.data);
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.msg || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Send the credential to your backend for verification
      const response = await import('../api/apiService').then(mod => 
        mod.userService.loginWithGoogle(credentialResponse.credential)
      );
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Get user profile after Google login
        const profileResponse = await import('../api/apiService').then(mod => 
          mod.userService.getProfile()
        );
        
        onLogin(profileResponse.data);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.response?.data?.msg || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    setError('Google login failed');
    setIsLoading(false);
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
              {isLoginMode ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE YOUR BEAUTY PROFILE'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Sign In Button */}
            <div className="w-full py-4 px-6 border border-white/10 flex items-center justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                useOneTap
                type="standard"
                theme={isDark ? "filled_black" : "outline"}
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
                logo_alignment="left"
              />
            </div>

            <div className="flex items-center space-x-4 py-2">
              <div className={`flex-grow h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
              <span className="text-[9px] tracking-widest opacity-30 font-bold uppercase">OR</span>
              <div className={`flex-grow h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && (
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
                  className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] tracking-widest opacity-50 uppercase ml-1">Password</label>
                <input 
                  required 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className={`w-full ${inputBg} border-b ${borderCol} py-3 px-4 focus:outline-none focus:border-current transition-colors text-sm`} 
                />
              </div>

              {!isLoginMode && (
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
                  <span>{isLoginMode ? 'AUTHORIZE ACCESS' : 'CREATE PROFILE'}</span>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
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