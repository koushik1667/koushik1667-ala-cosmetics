
import React, { useState, useEffect } from 'react';
import { Product, Theme } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variants: Record<string, string>) => void;
  theme: Theme;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, theme }) => {
  const isDark = theme === 'dark';
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product.variants) {
      const defaults: Record<string, string> = {};
      product.variants.forEach(v => {
        if (v.options.length > 0) defaults[v.name] = v.options[0];
      });
      setSelectedVariants(defaults);
    }
  }, [product.variants]);

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full h-full md:h-[90vh] md:w-[90vw] md:max-w-6xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'}`}>
        <button onClick={onClose} className="absolute top-8 right-8 z-20 p-2 hover:rotate-90 transition-transform">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        {/* Image Section */}
        <div className="flex-grow h-[50vh] md:h-full overflow-hidden relative group">
          <img 
            src={product.image} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
            alt={product.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Info Section */}
        <div className="flex-shrink-0 w-full md:w-[450px] h-full overflow-y-auto custom-scrollbar p-8 md:p-16 flex flex-col justify-center">
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif tracking-wide leading-tight">{product.name}</h2>
              <p className="text-2xl font-mono tracking-tighter silver-gradient">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

            <p className="text-sm leading-relaxed opacity-60 font-light italic">
              "{product.description}"
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-8 pt-4">
                {product.variants.map(variant => (
                  <div key={variant.name} className="space-y-4">
                    <label className="text-[10px] tracking-[0.3em] font-bold opacity-30 uppercase">{variant.name}</label>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map(option => (
                        <button
                          key={option}
                          onClick={() => handleVariantChange(variant.name, option)}
                          className={`px-5 py-2 text-[9px] tracking-[0.2em] font-bold border transition-all ${
                            selectedVariants[variant.name] === option
                              ? (isDark ? 'border-white bg-white text-black' : 'border-black bg-black text-white')
                              : (isDark ? 'border-white/10 text-white/40 hover:border-white/40' : 'border-black/10 text-black/40 hover:border-black/40')
                          }`}
                        >
                          {option.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-10 flex flex-col space-y-4">
              <button 
                onClick={() => onAddToCart(product, selectedVariants)}
                disabled={!product.inStock}
                className={`w-full py-5 text-[10px] tracking-[0.4em] font-bold transition-all ${
                  !product.inStock 
                    ? 'opacity-20 cursor-not-allowed'
                    : (isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')
                }`}
              >
                {product.inStock ? 'ADD TO BAG' : 'OUT OF STOCK'}
              </button>
              <p className="text-[8px] tracking-widest opacity-30 text-center uppercase">Free express shipping on orders over ₹2000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
