import React, { useState } from 'react';
import { motion } from 'motion/react';
import { InventoryItem, OrderItem, DashboardWidget } from '../types';
import { 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  PlusSquare, 
  User, 
  ArrowRight,
  GripHorizontal
} from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
  orders: OrderItem[];
  onNavigate: (tab: string) => void;
  onQuickAddItem: () => void;
  onQuickAddOrder: () => void;
}

export default function Dashboard({ 
  inventory, 
  orders, 
  onNavigate, 
  onQuickAddItem, 
  onQuickAddOrder 
}: DashboardProps) {
  // Let's form dynamic metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const totalOrdersCount = orders.length;

  const lowStockCount = inventory.filter(i => i.stock <= 5 && i.stock > 0).length;

  // Let's create draggable widgets!
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'revenue',
      title: 'Total Pendapatan',
      value: `Rp ${(totalRevenue + 12500000).toLocaleString('id-ID')}`,
      subValue: 'Total dari pesanan terbayar',
      trend: '+8.2% dari minggu lalu',
      trendType: 'up',
      icon: 'payments'
    },
    {
      id: 'orders',
      title: 'Total Pesanan',
      value: (totalOrdersCount + 342).toString(),
      subValue: 'Pesanan masuk sistem',
      trend: '+12 minggu ini',
      trendType: 'up',
      icon: 'shopping_bag'
    },
    {
      id: 'lowStock',
      title: 'Stok Menipis',
      value: (lowStockCount + 8).toString(),
      subValue: 'Barang butuh perhatian segera',
      trend: 'Periksa daftar inventaris',
      trendType: 'neutral',
      icon: 'warning'
    }
  ]);

  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

  // Drag and drop handlers keys
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedWidgetId) return;

    const sourceIndex = widgets.findIndex(w => w.id === draggedWidgetId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    const updatedWidgets = [...widgets];
    // Splice array reorder
    const [removed] = updatedWidgets.splice(sourceIndex, 1);
    updatedWidgets.splice(targetIndex, 0, removed);

    setWidgets(updatedWidgets);
    setDraggedWidgetId(null);
  };

  // Quick statistical sales metrics
  const salesTrendDay = [
    { day: 'S', name: 'Senin', rev: 40, active: false },
    { day: 'S', name: 'Selasa', rev: 60, active: false },
    { day: 'R', name: 'Rabu', rev: 35, active: false },
    { day: 'K', name: 'Kamis', rev: 80, active: true },
    { day: 'J', name: 'Jumat', rev: 50, active: false },
    { day: 'S', name: 'Sabtu', rev: 70, active: false },
    { day: 'M', name: 'Minggu', rev: 45, active: false },
  ];

  return (
    <div className="flex flex-col gap-5 font-sans selection:bg-blue-600 selection:text-white" id="dashboard-container">
      {/* Welcome Message */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight" id="dashboard-title">
          Dashboard Utama
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          Proses Keuangan & Inventaris Real-Time Admin
        </p>
      </div>

      {/* DRAG-AND-DROP INSTRUCTION */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-700 font-semibold select-none">
        <span className="flex items-center gap-2">
          <GripHorizontal size={14} className="text-blue-500" />
          <span>Atur Tata Letak: Seret kartu ringkasan untuk menyusun dasbor dinamis!</span>
        </span>
      </div>

      {/* Draggable Widgets Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="draggable-widgets-grid">
        {widgets.map((widget, index) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`cursor-grab active:cursor-grabbing select-none p-5 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all rounded-lg relative group flex flex-col justify-between ${
              draggedWidgetId === widget.id ? 'opacity-30 border-dashed border-blue-500 bg-slate-50' : ''
            }`}
            id={`widget-${widget.id}`}
          >
            {/* Grab handle decoration */}
            <div className="absolute top-3 right-3 text-slate-350 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripHorizontal size={14} />
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-sm ${
                widget.id === 'revenue' ? 'bg-emerald-100 text-emerald-800' :
                widget.id === 'orders' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {widget.id === 'revenue' && <DollarSign size={16} className="stroke-[2.5]" />}
                {widget.id === 'orders' && <ShoppingBag size={16} className="stroke-[2.5]" />}
                {widget.id === 'lowStock' && <AlertTriangle size={16} className="stroke-[2.5]" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {widget.title}
                </span>
                <span className="text-slate-500 text-[10px] font-semibold mt-0.5">
                  {widget.subValue}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {widget.value}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold uppercase tracking-wider">
              {widget.id === 'revenue' || widget.id === 'orders' ? (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-sm">
                  <TrendingUp size={10} className="stroke-[2.5]" />
                  <span>{widget.trend.split(' ')[0]}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-100 px-2 py-0.5 rounded-sm">
                  <AlertTriangle size={10} className="stroke-[2.5]" />
                  <span>Cek Gudang</span>
                </div>
              )}
              <span className="text-slate-400 font-bold">
                {widget.trend.substring(widget.trend.indexOf(' ') + 1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Matrix & Weekly Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="dashboard-row-tw">
        {/* Weekly sales trend chart representation */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between" id="sales-trend-container">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Tren Penjualan Mingguan
              </h2>
              <p className="text-xs text-slate-700 font-bold mt-1">Siklus Transaksi SakuBisnis</p>
            </div>
            <button 
              onClick={() => onNavigate('analytics')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              Ulas Akunting
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="h-32 w-full flex items-end justify-between gap-2 pt-2">
            {salesTrendDay.map((dayItem, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                <div className="relative w-full flex justify-center flex-1 items-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white text-[9px] font-bold py-1 px-1.5 rounded shadow-lg transition-all z-10 pointer-events-none whitespace-nowrap">
                    Rp {(dayItem.rev * 150000).toLocaleString('id-ID')}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${dayItem.rev}%` }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className={`w-full rounded-sm transition-all shadow-xs ${
                      dayItem.active 
                        ? 'bg-blue-600 shadow-sm' 
                        : 'bg-slate-200 hover:bg-blue-200'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-bold ${dayItem.active ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                  {dayItem.day}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-600 rounded-sm"></span>
              Puncak Transaksi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-200 rounded-sm"></span>
              Penjualan Standar
            </span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between" id="quick-links-container">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Aksi Cepat Bisnis
            </h2>
            <p className="text-xs text-slate-600 font-bold mb-3 leading-relaxed">
              Inisiasi pencatatan stok baru atau input pesanan cepat.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onQuickAddItem}
              className="py-3 px-3 bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 font-bold text-[11px] rounded-md flex flex-col items-center gap-1.5 transition-all group shadow-xs cursor-pointer"
              id="action-add-item"
            >
              <PlusSquare size={20} className="text-blue-600 group-hover:scale-105 transition-transform" />
              <span>Tambah Produk</span>
            </button>
            <button
              onClick={onQuickAddOrder}
              className="py-3 px-3 bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 font-bold text-[11px] rounded-md flex flex-col items-center gap-1.5 transition-all group shadow-xs cursor-pointer"
              id="action-add-order"
            >
              <PlusSquare size={20} className="text-emerald-600 group-hover:scale-105 transition-transform" />
              <span>Input Pesanan</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors rounded-md flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Ulas Ringkasan Pembukuan</span>
            <button onClick={() => onNavigate('analytics')} className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 uppercase text-[10px] tracking-wider">
              Buka
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white border border-slate-200 rounded-lg p-5" id="dashboard-recent-orders">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Pesanan Terbaru
          </h2>
          <button 
            onClick={() => onNavigate('orders')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            Selengkapnya
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 group hover:bg-slate-50/50 rounded p-1.5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all font-bold text-xs select-none">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{order.customerName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {order.id} • {order.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">
                  {order.currency === 'IDR' ? `Rp ${order.amount.toLocaleString('id-ID')}` : `$${order.amount}`}
                </span>
                <div className="mt-1 flex items-center justify-end">
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="py-6 text-center text-slate-450 text-[10px] font-bold uppercase tracking-wider">
              Belum ada pesanan terdaftar hari ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
