
import React, { useState, useMemo } from 'react';
import { Product, Theme } from '../types';
import ProductCard from './ProductCard';

interface StorefrontProps {
  products: Product[];
  onAddToCart: (product: Product, variants: Record<string, string>) => void;
  onSelectProduct: (product: Product) => void;
  theme: Theme;
}

const Storefront: React.FC<StorefrontProps> = ({ products, onAddToCart, onSelectProduct, theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section id="hero" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2000" 
            className="w-full h-full object-cover opacity-60 scale-105" 
            alt="Hero background"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/40 via-black/20 to-black' : 'from-white/40 via-white/20 to-[#f8f8f8]'}`}></div>
        </div>

        <div className="relative z-10 text-center space-y-8 px-4">
          <p className={`text-xs tracking-[0.8em] uppercase animate-pulse ${isDark ? 'text-white/70' : 'text-black/70'}`}>Est. 2024 • Luxury Lab</p>
          <h2 className={`text-6xl md:text-9xl font-serif py-2 leading-tight ${isDark ? 'silver-gradient' : 'text-black'}`}>ALA</h2>
          <p className="text-sm tracking-[0.4em] uppercase opacity-60">Purity in every stroke</p>
          <div className="max-w-md mx-auto mt-12 relative group">
            <input 
              type="text" 
              placeholder="DISCOVER THE COLLECTION..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-b ${isDark ? 'border-white/20 focus:border-white' : 'border-black/20 focus:border-black'} py-4 px-12 text-center text-[10px] tracking-[0.3em] font-bold focus:outline-none transition-all placeholder:opacity-40`}
            />
            <i className={`fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40`}></i>
          </div>
        </div>
      </section>

      {/* Main Product Grid Heading */}
      <div id="products-grid" className={`py-12 text-center border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <h3 className="text-3xl font-serif tracking-widest uppercase">The Catalog</h3>
        <p className={`text-[10px] tracking-widest opacity-40 mt-2 uppercase`}>{filteredProducts.length} PRODUCTS AVAILABLE</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={onAddToCart} 
              onSelect={() => onSelectProduct(product)} 
              theme={theme} 
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className={`text-center py-40 border rounded-2xl ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <p className="text-xs tracking-widest opacity-40">NO RESULTS MATCH YOUR SEARCH</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-[10px] tracking-widest font-bold underline underline-offset-8"
            >
              CLEAR SEARCH
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Storefront;
