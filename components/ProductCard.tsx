
import React, { useState, useEffect } from 'react';
import { Product, Theme } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, variants: Record<string, string>) => void;
  onSelect: () => void;
  theme: Theme;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onSelect, theme }) => {
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

  const handleVariantChange = (e: React.MouseEvent, name: string, value: string) => {
    e.stopPropagation();
    setSelectedVariants(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="group relative flex flex-col bg-transparent overflow-hidden cursor-pointer" onClick={onSelect}>
      <div className={`relative aspect-[3/4] overflow-hidden rounded-sm transition-all duration-500 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        
        {/* Quick Add Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(product, selectedVariants); }}
          className={`absolute bottom-6 left-6 right-6 py-4 text-[9px] font-bold tracking-[0.3em] translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 ${
            isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          QUICK ADD
        </button>
        
        {!product.inStock && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[7px] tracking-[0.3em] text-white border border-white/10 uppercase">
            Sold Out
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-base font-serif tracking-wide">{product.name}</h3>
          </div>
          <p className={`text-sm font-mono opacity-70`}>₹{product.price.toLocaleString('en-IN')}</p>
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {product.variants.map(variant => (
              <div key={variant.name} className="flex flex-wrap gap-1">
                {variant.options.slice(0, 3).map(option => (
                  <div 
                    key={option}
                    className={`h-2 w-2 rounded-full border transition-all ${
                      selectedVariants[variant.name] === option 
                        ? (isDark ? 'border-white bg-white' : 'border-black bg-black') 
                        : (isDark ? 'border-white/20' : 'border-black/20')
                    }`}
                  />
                ))}
                {variant.options.length > 3 && <span className="text-[7px] opacity-30">+{variant.options.length - 3}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
