
import React, { useState } from 'react';
import { Product, Theme, Variant } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id'>) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  theme: Theme;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, theme }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const isDark = theme === 'dark';
  
  const initialFormState: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    description: '',
    image: '',
    inStock: true,
    variants: []
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(initialFormState);
  const [currentVarName, setCurrentVarName] = useState('');
  const [currentVarOpts, setCurrentVarOpts] = useState('');

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setFormData({ ...product });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddVariant = () => {
    if (!currentVarName || !currentVarOpts) return;
    const newVar: Variant = {
      name: currentVarName,
      options: currentVarOpts.split(',').map(o => o.trim()).filter(o => o !== '')
    };
    setFormData(prev => ({ ...prev, variants: [...(prev.variants || []), newVar] }));
    setCurrentVarName('');
    setCurrentVarOpts('');
  };

  const removeVariant = (idx: number) => {
    setFormData(prev => ({ ...prev, variants: prev.variants?.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;
    
    if (editId) {
      onUpdateProduct({ ...formData, id: editId });
    } else {
      onAddProduct(formData);
    }

    setFormData(initialFormState);
    setEditId(null);
    setIsFormOpen(false);
  };

  const cancelForm = () => {
    setFormData(initialFormState);
    setEditId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-serif">Inventory Dashboard</h2>
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mt-2 text-sm tracking-wide`}>Manage collections, pricing, and stock status.</p>
        </div>
        <button 
          onClick={() => isFormOpen ? cancelForm() : setIsFormOpen(true)}
          className={`px-8 py-3 text-[10px] tracking-[0.2em] font-bold transition-all ${
            isFormOpen ? 'bg-red-500/10 text-red-500' : (isDark ? 'bg-white text-black' : 'bg-black text-white')
          }`}
        >
          {isFormOpen ? 'DISCARD CHANGES' : 'CREATE NEW ITEM'}
        </button>
      </div>

      {isFormOpen && (
        <div className={`p-8 rounded-xl mb-12 animate-in slide-in-from-top-4 duration-500 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
          <h3 className="text-xl font-serif mb-8">{editId ? 'Modify Product' : 'New Collection Entry'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest opacity-40">PRODUCT NAME</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-transparent border-b p-3 focus:outline-none transition-colors ${isDark ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest opacity-40">RETAIL PRICE (INR)</label>
              <input required type="number" step="1" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className={`w-full bg-transparent border-b p-3 focus:outline-none transition-colors ${isDark ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] tracking-widest opacity-40">IMAGE URL</label>
              <input required type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={`w-full bg-transparent border-b p-3 focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] tracking-widest opacity-40">DESCRIPTION</label>
              <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`w-full bg-transparent border-b p-3 focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`} />
            </div>

            <div className="md:col-span-2 p-6 border border-dashed border-current/20 rounded-xl space-y-6">
              <h4 className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-60">Variant Configuration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <input type="text" value={currentVarName} onChange={e => setCurrentVarName(e.target.value)} placeholder="e.g. Size" className="bg-transparent border-b p-2 text-xs focus:outline-none border-current/10" />
                <input type="text" value={currentVarOpts} onChange={e => setCurrentVarOpts(e.target.value)} placeholder="Options (comma separated)" className="bg-transparent border-b p-2 text-xs focus:outline-none border-current/10" />
                <button type="button" onClick={handleAddVariant} className="py-2 text-[9px] tracking-widest border border-current/20 hover:bg-current/5 font-bold">ADD VARIANT</button>
              </div>
              {formData.variants && formData.variants.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.variants.map((v, i) => (
                    <div key={i} className="flex items-center space-x-3 bg-current/5 px-3 py-2 rounded-lg text-[10px] tracking-widest">
                      <span><strong>{v.name}:</strong> {v.options.join(', ')}</span>
                      <button type="button" onClick={() => removeVariant(i)} className="text-red-500 opacity-60 hover:opacity-100"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center space-x-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} className="h-4 w-4 rounded border-current/20" />
                <span className="text-[10px] tracking-widest font-bold">MARK AS IN STOCK</span>
              </label>
            </div>

            <button type="submit" className={`md:col-span-2 py-4 text-[10px] tracking-[0.3em] font-bold transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
              {editId ? 'UPDATE PRODUCT RECORD' : 'PUBLISH TO STOREFRONT'}
            </button>
          </form>
        </div>
      )}

      <div className={`overflow-hidden rounded-2xl border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
              <th className="px-6 py-5 text-[10px] tracking-widest opacity-50 uppercase">Item</th>
              <th className="px-6 py-5 text-[10px] tracking-widest opacity-50 uppercase">Price</th>
              <th className="px-6 py-5 text-[10px] tracking-widest opacity-50 uppercase">Status</th>
              <th className="px-6 py-5 text-[10px] tracking-widest opacity-50 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-current/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} className="h-12 w-12 object-cover rounded-lg" alt="" />
                    <span className="text-sm font-semibold tracking-wide">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className={`text-[8px] px-2 py-1 rounded-full font-bold tracking-tighter ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {product.inStock ? 'AVAILABLE' : 'SOLDOUT'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button onClick={() => handleEdit(product)} className="text-[10px] tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">EDIT</button>
                  <button onClick={() => onDeleteProduct(product.id)} className="text-[10px] tracking-widest font-bold text-red-500 opacity-40 hover:opacity-100 transition-opacity">DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="py-20 text-center text-xs opacity-40 tracking-widest italic uppercase">Inventory empty</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
