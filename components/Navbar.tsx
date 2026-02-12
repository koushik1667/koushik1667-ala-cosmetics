
import React from 'react';
import { ViewMode, Theme, User } from '../types';
import { LOGO_URL } from '../constants';

interface NavbarProps {
  viewMode: ViewMode;
  theme: Theme;
  onToggleView: () => void;
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  isAuthenticated: boolean;
  onLogoutAdmin: () => void;
  currentUser: User | null;
  onOpenUserAuth: () => void;
  onUserLogout: () => void;
  onOpenOrders: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  viewMode, theme, onToggleView, onToggleTheme, cartCount, onOpenCart,
  isAuthenticated, onLogoutAdmin, currentUser, onOpenUserAuth, onUserLogout, onOpenOrders
}) => {
  const isDark = theme === 'dark';
  const navBg = isDark ? 'bg-black/90' : 'bg-white/90';
  const borderCol = isDark ? 'border-white/5' : 'border-black/5';

  const scrollTo = (id: string) => {
    if (viewMode !== 'user') onToggleView();
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 ${navBg} backdrop-blur-xl border-b ${borderCol} py-3 px-6 md:px-12 flex items-center justify-between transition-colors duration-500`}>
      <div className="flex items-center space-x-8">
        <div className="flex items-center cursor-pointer space-x-3" onClick={() => scrollTo('hero')}>
          <img 
            src={LOGO_URL} 
            alt="ALA" 
            className="h-9 w-auto object-contain" 
            onError={(e) => (e.currentTarget.style.display = 'none')} 
          />
          <h1 className={`text-2xl font-serif tracking-[0.3em] font-bold italic ${isDark ? 'silver-gradient' : 'text-black'}`}>ALA</h1>
        </div>
        
        {viewMode === 'user' && (
          <div className={`hidden lg:flex space-x-8 text-[9px] tracking-[0.3em] font-bold ${isDark ? 'text-white/40' : 'text-black/40'}`}>
            <button onClick={() => scrollTo('products-grid')} className="hover:text-current transition-colors uppercase">Shop</button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3 md:space-x-5">
        <button onClick={onToggleTheme} className={`p-2 rounded-full border ${borderCol} hover:scale-110 transition-all`}>
          {isDark ? <i className="fa-solid fa-sun text-yellow-500 text-sm"></i> : <i className="fa-solid fa-moon text-indigo-600 text-sm"></i>}
        </button>

        {viewMode === 'user' && currentUser && (
          <button onClick={onOpenOrders} className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full border ${borderCol} hover:bg-current/5 transition-all`}>
            <i className="fa-solid fa-receipt text-xs"></i>
            <span className="text-[9px] font-bold tracking-widest">HISTORY</span>
          </button>
        )}

        {viewMode === 'user' && (
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-[10px] font-bold tracking-widest">{currentUser.name.split(' ')[0].toUpperCase()}</span>
                </div>
                <button onClick={onUserLogout} className={`p-2 rounded-full border ${borderCol} hover:text-red-500 transition-all`}>
                  <i className="fa-solid fa-power-off text-xs"></i>
                </button>
              </div>
            ) : (
              <button onClick={onOpenUserAuth} className={`p-2 rounded-full border ${borderCol} hover:scale-110 transition-all`}>
                <i className="fa-solid fa-user text-xs"></i>
              </button>
            )}
          </div>
        )}

        <button 
          onClick={onToggleView} 
          className={`text-[8px] tracking-[0.3em] px-4 py-2 border ${borderCol} hover:border-current transition-all rounded-full bg-current/5 font-bold uppercase`}
        >
          {viewMode === 'user' ? (isAuthenticated ? 'Dashboard' : 'Admin') : 'Store'}
        </button>

        {viewMode === 'user' && (
          <button onClick={onOpenCart} className="relative p-2 group">
            <i className={`fa-solid fa-bag-shopping text-xl group-hover:scale-110 transition-transform ${isDark ? 'text-white' : 'text-black'}`}></i>
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
