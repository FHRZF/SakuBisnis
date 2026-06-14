import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem } from '../types';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X,
  PackageCheck,
  ShoppingBag,
  Grid
} from 'lucide-react';

interface InventoryProps {
  items: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateStock: (id: string, amount: number) => void;
  onDragItemToOrder?: (item: InventoryItem) => void;
}

export default function Inventory({ 
  items, 
  onAddItem, 
  onDeleteItem, 
  onUpdateStock,
  onDragItemToOrder
}: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDragOverOrderBox, setIsDragOverOrderBox] = useState(false);
  const [isDragOverBinBox, setIsDragOverBinBox] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Electronics');
  const [newItemPrice, setNewItemPrice] = useState(100);
  const [newItemStock, setNewItemStock] = useState(10);
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemCurrency, setNewItemCurrency] = useState<'USD' | 'IDR'>('USD');

  // Filter Categories
  const categories = ['All', 'Electronics', 'Office Supplies', 'Furniture', 'Low Stock'];

  // Current filtered items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Low Stock') return matchesSearch && item.stock <= 5 && item.stock > 0;
    return matchesSearch && item.category === activeCategory;
  });

  // State for dragging items
  const [draggingItem, setDraggingItem] = useState<InventoryItem | null>(null);

  const handleDragStart = (e: React.DragEvent, item: InventoryItem) => {
    setDraggingItem(item);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setIsDragOverOrderBox(false);
    setIsDragOverBinBox(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemSku) return;

    // determine stock status
    let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
    if (newItemStock === 0) status = 'out-of-stock';
    else if (newItemStock <= 5) status = 'low-stock';

    const newItem: InventoryItem = {
      id: `INV-${Date.now()}`,
      name: newItemName,
      sku: newItemSku.toUpperCase(),
      category: newItemCategory,
      price: newItemPrice,
      currency: newItemCurrency,
      stock: newItemStock,
      image: newItemImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
      status: status
    };

    onAddItem(newItem);
    
    // Reset local form states
    setNewItemName('');
    setNewItemSku('');
    setNewItemCategory('Electronics');
    setNewItemPrice(100);
    setNewItemStock(10);
    setNewItemImage('');
    setNewItemCurrency('USD');
    setShowAddModal(false);
  };

  const deleteItem = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari investaris?')) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="inventory-view">
      
      {/* Search and Tag filter system */}
      <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm sticky top-[60px] z-20">
        <div className="relative w-full mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari SKU atau nama barang..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            id="search-input"
          />
          <SlidersHorizontal size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 cursor-pointer" />
        </div>

        {/* Categories filters scroll */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id={`category-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat === 'All' ? 'Semua Produk' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* DRAG AND DROP ACTION ZONES (Dinamis / Interaktif) */}
      {draggingItem && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="grid grid-cols-2 gap-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl"
          id="dnd-utility-panel"
        >
          {/* Drop to Order Action */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverOrderBox(true);
            }}
            onDragLeave={() => setIsDragOverOrderBox(false)}
            onDrop={(e) => {
              e.preventDefault();
              if (onDragItemToOrder && draggingItem) {
                onDragItemToOrder(draggingItem);
              }
              setIsDragOverOrderBox(false);
            }}
            className={`py-6 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
              isDragOverOrderBox 
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 scale-[1.02]' 
                : 'border-blue-400 bg-blue-50 text-blue-800'
            }`}
          >
            <ShoppingBag size={24} className={isDragOverOrderBox ? 'animate-bounce text-emerald-600' : 'text-blue-600'} />
            <span className="text-center font-bold text-xs">Drop untuk Buat Pesanan</span>
            <span className="text-[10px] text-slate-400">Lepaskan barang di sini</span>
          </div>

          {/* Drop to Reduce Stock Action */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverBinBox(true);
            }}
            onDragLeave={() => setIsDragOverBinBox(false)}
            onDrop={(e) => {
              e.preventDefault();
              if (draggingItem) {
                onUpdateStock(draggingItem.id, -1);
              }
              setIsDragOverBinBox(false);
            }}
            className={`py-6 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
              isDragOverBinBox 
                ? 'border-rose-600 bg-rose-50 text-rose-800 scale-[1.02]' 
                : 'border-rose-300 bg-rose-100/50 text-rose-800'
            }`}
          >
            <Trash2 size={24} className={isDragOverBinBox ? 'animate-bounce text-rose-600' : 'text-rose-500'} />
            <span className="text-center font-bold text-xs text-rose-700">Drop untuk Kurangi Stok</span>
            <span className="text-[10px] text-rose-400">Kurangi 1 unit</span>
          </div>
        </motion.div>
      )}

      {/* Summary with dynamic counters */}
      <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
          <Grid size={14} className="text-blue-600" />
          Detail Inventaris Barang
        </span>
        <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-black text-slate-800 rounded-lg shadow-sm">
          {filteredItems.length} Produk Terfilter
        </span>
      </div>

      {/* Grid of items */}
      <div className="flex flex-col gap-3" id="inventory-list">
        {filteredItems.map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            className={`p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex gap-4 relative group cursor-grab active:cursor-grabbing ${
              draggingItem?.id === item.id ? 'opacity-30' : ''
            }`}
            id={`item-${item.id}`}
          >
            {/* Image section with hotlinks */}
            <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-150 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Eye size={24} className="text-slate-300" />
              )}
            </div>

            {/* Product description details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-slate-800 truncate pr-4 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all absolute top-3 right-3"
                    id={`delete-${item.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="inline-block text-[9px] font-mono font-bold bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 mt-1 tracking-wider">
                  SKU: {item.sku}
                </span>
              </div>

              <div className="flex items-end justify-between mt-3">
                <span className="text-sm font-black text-blue-600">
                  {item.currency === 'USD' ? `$${item.price.toLocaleString('en-US')}` : `Rp ${item.price.toLocaleString('id-ID')}`}
                </span>

                {/* Integrated badge alerts based on layout mockup */}
                <div className="flex items-center gap-1.5">
                  {item.stock > 5 ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-extrabold tracking-tight">
                      <CheckCircle size={10} className="stroke-[2.5]" />
                      <span>Tersedia ({item.stock})</span>
                    </div>
                  ) : item.stock > 0 ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-extrabold tracking-tight">
                      <AlertTriangle size={10} className="stroke-[2.5]" />
                      <span>Hampir Habis ({item.stock})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-extrabold tracking-tight">
                      <Clock size={10} className="stroke-[2.5]" />
                      <span>Stok Kosong</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <PackageCheck size={36} className="text-slate-300 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-slate-700">Produk Tidak Ditemukan</h4>
            <p className="text-[10px] text-slate-400 mt-1">Coba gunakan kata sandi pencarian lain atau pilih kategori yang berbeda.</p>
          </div>
        )}
      </div>

      {/* Trigger Bottom Add FAB */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 md:absolute md:bottom-24 md:right-4 w-12 h-12 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all rounded-full shadow-lg flex items-center justify-center cursor-pointer font-bold select-none z-30 group"
        id="btn-add-inv-fab"
      >
        <Plus size={24} className="stroke-[2.5] group-hover:rotate-90 transition-transform" />
      </button>

      {/* Add Item Modal Panel */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
              id="add-item-modal"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <PackageCheck size={18} className="text-blue-600" />
                  Tambah Produk Baru
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    Nama Barang
                  </label>
                  <input 
                    type="text" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="ThinkPad X1 Carbon..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      SKU Code
                    </label>
                    <input 
                      type="text" 
                      value={newItemSku}
                      onChange={(e) => setNewItemSku(e.target.value)}
                      placeholder="LPT-TP-X1-002"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Kategori
                    </label>
                    <select 
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    >
                      <option value="Electronics">Elektronik</option>
                      <option value="Office Supplies">Peralatan Kantor</option>
                      <option value="Furniture">Furnitur</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Harga Satuan
                    </label>
                    <div className="flex gap-1.5">
                      <select 
                        value={newItemCurrency} 
                        onChange={(e) => setNewItemCurrency(e.target.value as 'USD' | 'IDR')}
                        className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="USD">$ USD</option>
                        <option value="IDR">Rp IDR</option>
                      </select>
                      <input 
                        type="number" 
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(parseInt(e.target.value) || 0)}
                        placeholder="1450"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Stok Jumlah
                    </label>
                    <input 
                      type="number" 
                      value={newItemStock}
                      onChange={(e) => setNewItemStock(parseInt(e.target.value) || 0)}
                      placeholder="45"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    URL Gambar Barang (Optional)
                  </label>
                  <input 
                    type="url" 
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="block text-[8px] text-slate-400 mt-1">Kosongkan untuk menyetel gambar default produk.</span>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Simpan Produk
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
