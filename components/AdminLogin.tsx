
import React, { useState } from 'react';
import { Theme } from '../types';

interface AdminLoginProps {
  onLogin: () => void;
  theme: Theme;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, theme }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo security. In production, this would be a backend check.
    if (password === 'ALA2024') {
      onLogin();
    } else {
      setError('Invalid Access Key');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-6">
      <div className={`w-full max-w-md p-10 rounded-2xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
            <i className="fa-solid fa-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-serif">Admin Access</h2>
          <p className={`text-xs tracking-widest mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ENTER SECURITY KEY TO CONTINUE</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Security Key"
              className={`w-full bg-transparent border-b py-3 px-4 text-center focus:outline-none transition-all ${
                error ? 'border-red-500' : (isDark ? 'border-white/20 focus:border-white' : 'border-black/20 focus:border-black')
              }`}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-red-500 tracking-widest uppercase">
                {error}
              </p>
            )}
          </div>
          <button 
            type="submit"
            className={`w-full py-4 text-[10px] tracking-[0.3em] font-bold transition-all ${
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            AUTHORIZE
          </button>
        </form>
        
        <p className={`text-center text-[9px] mt-12 tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          PROTECTED BY ALA SECURITY SYSTEMS
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
