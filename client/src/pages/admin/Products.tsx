import { getApiUrl } from '../../config/api';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, Link as LinkIcon, Save, Image as ImageIcon } from 'lucide-react';
import PremiumImage from '../../components/ui/PremiumImage';

interface Product {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  moq: string;
  description?: string;
  image: string;
  grade?: string;
  origin?: string;
  certs?: string;
}

import { DUMMY_PRODUCTS } from '../../data/dummyData';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Spices',
    priceRange: '',
    moq: '',
    description: '',
    image: '',
    grade: '',
    origin: '',
    certs: ''
  });

  const fetchProducts = () => {
    fetch(getApiUrl('/products'))
      .then(res => res.json())
      .then(json => {
        if (json.data) setProducts(json.data);
      })
      .catch(err => console.error('Error fetching products:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: 'Spices', priceRange: '', moq: '', description: '', image: '', grade: 'A1 Premium', origin: 'India', certs: 'ISO, FSSAI' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct 
      ? getApiUrl(`/products/${editingProduct.id}`) 
      : getApiUrl('/products');
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.message === 'success') {
        fetchProducts();
        setIsModalOpen(false);
      } else {
        alert(data.error || 'Server error');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Network error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(getApiUrl(`/products/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.message === 'deleted') fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-5xl font-serif font-bold text-primary italic leading-none">Global Portfolio</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">Administrative Inventory Control • {products.length} Units</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-accent text-primary flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-[9px] font-black tracking-widest uppercase shadow-xl hover:shadow-accent/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Add Commodity</span>
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="aspect-square relative overflow-hidden bg-gray-50">
              <PremiumImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(product)} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-lg hover:bg-accent hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(product.id)} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-8">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 block">{product.category}</span>
              <h3 className="text-xl font-serif font-bold text-primary italic mb-4">{product.name}</h3>
              <div className="space-y-2 border-t border-gray-50 pt-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-300">Price Range</span>
                  <span className="text-primary">{product.priceRange}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-300">Min. Order</span>
                  <span className="text-primary">{product.moq}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-primary/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-3xl md:rounded-[3rem] shadow-3xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
              {/* Media Section */}
              <div className="w-full md:w-5/12 bg-gray-50 p-6 md:p-10 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                <div className="w-full aspect-video md:aspect-square rounded-2xl md:rounded-[2rem] bg-white border border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-4 md:mb-8 shadow-inner relative">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-gray-200 mx-auto mb-2" />
                      <p className="text-[7px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Identity Vector Pending</p>
                    </div>
                  )}
                  {/* Status Overlay for URL detection */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-md text-[6px] font-black uppercase text-accent tracking-widest border border-gray-100">
                     {formData.image ? 'Validated' : 'Queued'}
                  </div>
                </div>
                
                <div className="w-full space-y-3">
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300" />
                    <input type="text" placeholder="Visual Data URL" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full pl-8 md:pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-none text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 md:py-4 px-6 rounded-xl md:rounded-2xl bg-primary text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all shadow-xl active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Sync Local File
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const uploadFormData = new FormData();
                        uploadFormData.append('image', file);
                        try {
                          const res = await fetch(getApiUrl('/upload'), { method: 'POST', body: uploadFormData });
                          const data = await res.json();
                          if (data.message === 'success') setFormData(prev => ({ ...prev, image: data.url }));
                        } catch (err) { console.error('Upload failed', err); }
                      }
                  }} />
                </div>
              </div>
              
              <div className="flex-1 p-12 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-serif font-bold text-primary italic">{editingProduct ? 'Edit Portfolio Item' : 'Add New Commodity'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Product Name</label>
                       <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" placeholder="e.g. Groundnuts G2" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                       <select value={formData.category || 'Spices'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner appearance-none">
                         <option>Spices</option>
                         <option>Seeds</option>
                         <option>Powders</option>
                         <option>Oils</option>
                         <option>Rice & Grains</option>
                       </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Price Range</label>
                       <input required type="text" value={formData.priceRange || ''} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" placeholder="₹100 - ₹200" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">MOQ</label>
                       <input required type="text" value={formData.moq || ''} onChange={e => setFormData({...formData, moq: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" placeholder="500 Kg" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Grade / Quality</label>
                       <input type="text" value={formData.grade || ''} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" placeholder="e.g. A1 Premium Bold" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Origin</label>
                       <input type="text" value={formData.origin || ''} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" placeholder="e.g. Tamil Nadu, India" />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Certifications (Comma separated)</label>
                    <input type="text" value={formData.certs || ''} onChange={e => setFormData({...formData, certs: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" placeholder="e.g. ISO 9001, FDA, APEDA" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Detailed Description</label>
                    <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner resize-none font-sans" placeholder="Describe harvesting season, loadability etc..."></textarea>
                  </div>

                  <button type="submit" className="w-full btn-primary py-5 flex items-center justify-center space-x-3 text-xs font-bold tracking-[0.2em] uppercase shadow-2xl mt-4">
                    <Save className="w-5 h-5" />
                    <span>{editingProduct ? 'Update Product' : 'Add to Catalog'}</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
