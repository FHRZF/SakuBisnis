import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderItem, OrderStatus, PaymentStatus, InventoryItem } from '../types';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Check, 
  Grid, 
  SquareDot, 
  X,
  CreditCard,
  User,
  Plus
} from 'lucide-react';

interface OrdersProps {
  orders: OrderItem[];
  onAddOrder: (order: OrderItem) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (id: string, payStatus: PaymentStatus) => void;
  inventory: InventoryItem[];
  prefilledItemForOrder?: InventoryItem | null;
  onClearPrefilledItem?: () => void;
}

export default function Orders({ 
  orders, 
  onAddOrder, 
  onUpdateOrderStatus, 
  onUpdatePaymentStatus,
  inventory,
  prefilledItemForOrder,
  onClearPrefilledItem
}: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New order form properties
  const [newCustomer, setNewCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newItemCount, setNewItemCount] = useState<number>(1);
  const [newPayment, setNewPayment] = useState<PaymentStatus>('paid');
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('pending');
  const [newCurrency, setNewCurrency] = useState<'USD' | 'IDR'>('IDR');

  // Trigger modal when a prefilled item is dragged
  useEffect(() => {
    if (prefilledItemForOrder) {
      setSelectedProduct(prefilledItemForOrder.id);
      setNewAmount(prefilledItemForOrder.price);
      setNewCurrency(prefilledItemForOrder.currency);
      setShowAddModal(true);
    }
  }, [prefilledItemForOrder]);

  // Adjust prefilled product amount on selection change
  const handleProductSelectChange = (itemId: string) => {
    setSelectedProduct(itemId);
    const prod = inventory.find(i => i.id === itemId);
    if (prod) {
      setNewAmount(prod.price * newItemCount);
      setNewCurrency(prod.currency);
    }
  };

  const handleQtyChange = (qty: number) => {
    setNewItemCount(qty);
    const prod = inventory.find(i => i.id === selectedProduct);
    if (prod) {
      setNewAmount(prod.price * qty);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer) return;

    let finalAmount = newAmount;
    if (!selectedProduct && finalAmount === 0) {
      finalAmount = 150000; // fallback amount
    }

    const newOrder: OrderItem = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      customerName: newCustomer,
      amount: finalAmount,
      currency: newCurrency,
      itemCount: newItemCount,
      paymentStatus: newPayment,
      status: newOrderStatus
    };

    onAddOrder(newOrder);

    // Reset forms
    setNewCustomer('');
    setSelectedProduct('');
    setNewAmount(0);
    setNewItemCount(1);
    setNewPayment('paid');
    setNewOrderStatus('pending');
    setShowAddModal(false);

    if (onClearPrefilledItem) {
      onClearPrefilledItem();
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    if (onClearPrefilledItem) {
      onClearPrefilledItem();
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && order.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6" id="orders-view">
      {/* Search & Tabs Stickies */}
      <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm sticky top-[60px] z-20">
        <div className="relative w-full mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID Pesanan atau pembeli..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            id="order-search"
          />
          <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
          {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeTab === tab 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              id={`tab-order-${tab}`}
            >
              {tab === 'all' ? 'Semua Pesanan' : 
               tab === 'pending' ? 'Tertunda' : 
               tab === 'processing' ? 'Diproses' : 
               tab === 'shipped' ? 'Dikirim' : 'Selesai'}
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Summary Card */}
      <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
          <ShoppingBag size={14} className="text-blue-600" />
          Buku Transaksi Pesanan
        </span>
        <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-black text-slate-800 rounded-lg shadow-sm">
          {filteredOrders.length} Pesanan
        </span>
      </div>

      {/* Orders list rendered vertically */}
      <div className="flex flex-col gap-4" id="orders-list">
        {filteredOrders.map(order => {
          const isDelivered = order.status === 'delivered';

          return (
            <div 
              key={order.id} 
              className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative ${
                isDelivered ? 'opacity-75 border-slate-150 bg-slate-50/50' : 'border-slate-200'
              }`}
              id={`order-card-${order.id}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-blue-600">{order.id}</span>
                    <span className="text-slate-300 text-xs font-medium">•</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight flex items-center gap-1">
                      <Calendar size={10} />
                      {order.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">
                    {order.customerName}
                  </h3>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {order.currency === 'IDR' ? `Rp ${order.amount.toLocaleString('id-ID')}` : `$${order.amount.toLocaleString()}`}
                  </span>
                  
                  {/* Paid state toggle */}
                  <button
                    onClick={() => onUpdatePaymentStatus(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                  </button>
                </div>
              </div>

              {/* Status progression footer */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Grid size={12} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{order.itemCount} Barang</span>
                </div>

                {/* Dropdown status changer context */}
                <div className="flex items-center gap-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="pending">Tertunda</option>
                    <option value="processing">Diproduksi</option>
                    <option value="shipped">Dikirim</option>
                    <option value="delivered">Diterima</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <SquareDot size={36} className="text-slate-300 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-slate-700">Tidak Ada Transaksi</h4>
            <p className="text-[10px] text-slate-400 mt-1">Gunakan saringan pencarian lain atau buat pesanan baru.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) to open Modal manually */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 md:absolute md:bottom-24 md:right-4 w-12 h-12 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all rounded-full shadow-lg flex items-center justify-center cursor-pointer font-bold select-none z-30 group"
        id="btn-add-order-fab"
      >
        <Plus size={24} className="stroke-[2.5] group-hover:rotate-90 transition-transform" />
      </button>

      {/* Transaction Add Overlay Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
              id="add-order-modal"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag size={18} className="text-blue-600" />
                  Catat Pesanan Baru
                </h3>
                <button 
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                {prefilledItemForOrder && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Check size={14} className="stroke-[3]" />
                    <span>Prefilled dari seretan Inventaris: {prefilledItemForOrder.name}</span>
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    Nama Pelanggan / Buyer
                  </label>
                  <input 
                    type="text" 
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="Budi Santoso, Siti Aminah..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Pilih Produk Inventaris
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => handleProductSelectChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    >
                      <option value="">-- Ketik Bebas / Custom --</option>
                      {inventory.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Jumlah Barang (Qty)
                    </label>
                    <input 
                      type="number" 
                      value={newItemCount}
                      onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Nilai Transaksi (Total)
                    </label>
                    <div className="flex gap-1">
                      <select 
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value as 'USD' | 'IDR')}
                        className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="IDR">Rp</option>
                        <option value="USD">$</option>
                      </select>
                      <input 
                        type="number" 
                        value={newAmount}
                        onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                        placeholder="1250000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Status Pembayaran
                    </label>
                    <select 
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value as PaymentStatus)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    >
                      <option value="paid">Lunas</option>
                      <option value="unpaid">Belum Bayar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    Status Pengiriman Pertama
                  </label>
                  <select 
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    <option value="pending">Tertunda</option>
                    <option value="processing">Sedang Diproses</option>
                    <option value="shipped">Sedang Dikirim</option>
                    <option value="delivered">Diterima / Selesai</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Simpan Pesanan
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
