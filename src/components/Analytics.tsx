import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  DollarSign, 
  ShoppingBag, 
  FileText, 
  Percent,
  Calendar,
  Share2,
  Bookmark
} from 'lucide-react';

export default function Analytics() {
  const [period, setPeriod] = useState('30');

  // KPI metadata representable for mockup
  const kpis = [
    {
      title: 'Pendapatan',
      value: 'Rp 24,5 jt',
      trend: '+12.5%',
      isUp: true,
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Total Pesanan',
      value: '342 Transaksi',
      trend: '+8.2%',
      isUp: true,
      icon: ShoppingBag,
      color: 'emerald'
    },
    {
      title: 'Rata-rata Keranjang',
      value: 'Rp 71.600',
      trend: '-1.4%',
      isUp: false,
      icon: FileText,
      color: 'amber'
    },
    {
      title: 'Tingkat Konversi',
      value: '3.2%',
      trend: '+0.5%',
      isUp: true,
      icon: Percent,
      color: 'indigo'
    }
  ];

  // Dynamic SVG Line chart coordinates representing "Revenue Growth"
  // W1, W2, W3, W4 heights representing: 4200, 5800, 6100, 8400 on a 100-height scale
  const linePoints = "20,80 120,60 220,55 320,20";
  const lineAreaPoints = "20,80 120,60 220,55 320,20 320,100 20,100";

  // Channel metrics representable
  const channels = [
    { name: 'Toko Online (e-Commerce)', pct: 55, count: '188 order', color: 'bg-blue-600' },
    { name: 'Katalog POS Ritel', pct: 30, count: '102 order', color: 'bg-emerald-600' },
    { name: 'Keagenan Grosir (Wholesale)', pct: 15, count: '52 order', color: 'bg-indigo-600' }
  ];

  return (
    <div className="flex flex-col gap-6" id="analytics-view">
      {/* Time window selection section */}
      <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Analisis Penjualan
          </h1>
          <p className="text-xs text-slate-400 font-medium">Lacak pendapatan, produk terbaik, dan segmen konversi.</p>
        </div>
        <div className="relative w-full">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer text-center"
          >
            <option value="7">7 Hari Terakhir</option>
            <option value="30">30 Hari Terakhir</option>
            <option value="90">90 Hari Terakhir</option>
            <option value="365">Seluruh Tahun Ini</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* KPI Bento boxes (Grid) */}
      <div className="grid grid-cols-2 gap-3" id="analytics-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-1.5 rounded-lg ${
                  kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  kpi.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <Icon size={14} className="stroke-[2.5]" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-black text-slate-800 tracking-tight">
                  {kpi.value}
                </h3>
              </div>

              <div className={`flex items-center gap-1 mt-2 text-[10px] font-extrabold ${kpi.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Interactive Line chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="revenue-growth-container">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Calendar size={14} className="text-blue-600" />
          Pertumbuhan Pendapatan
        </h2>

        <div className="w-full h-44 relative mt-2">
          {/* Custom SVG Line drawing */}
          <svg viewBox="0 0 340 110" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid dividers */}
            <line x1="0" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50" x2="340" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="340" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

            {/* Filled highlight region */}
            <path d={lineAreaPoints} fill="url(#gradientArea)" />

            {/* Solid stroke trend-line */}
            <path d={linePoints} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactivity indicators */}
            <circle cx="20" cy="80" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="120" cy="60" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="220" cy="55" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx="320" cy="20" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Labels matching grid scale */}
        <div className="flex justify-between text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest px-2">
          <span>Minggu 1</span>
          <span>Minggu 2</span>
          <span>Minggu 3</span>
          <span className="text-blue-600">Minggu 4</span>
        </div>
      </div>

      {/* SVG Interactive Channel Donut Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="channel-sales-container">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Share2 size={14} className="text-blue-600" />
          Penjualan per Saluran
        </h2>

        <div className="relative w-full h-44 flex items-center justify-center">
          {/* Custom SVG Circular Donut representation */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            {/* Online segment (55%) */}
            <circle
              cx="64"
              cy="64"
              r="40"
              fill="transparent"
              stroke="#2563eb"
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * 55) / 100}
            />
            {/* POS Segment (30%) */}
            <circle
              cx="64"
              cy="64"
              r="40"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * 30) / 100}
              className="transform rotate-[198deg]"
              style={{ transformOrigin: '64px 64px' }}
            />
            {/* Wholesale Segment (15%) */}
            <circle
              cx="64"
              cy="64"
              r="40"
              fill="transparent"
              stroke="#6366f1"
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * 15) / 100}
              className="transform rotate-[306deg]"
              style={{ transformOrigin: '64px 64px' }}
            />
          </svg>

          {/* Core label floating */}
          <div className="absolute text-center flex flex-col">
            <span className="text-xs font-black text-slate-900">Pasar</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokal</span>
          </div>
        </div>

        {/* Dynamic Legend keys based on styling schema */}
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1">
          {channels.map((chan, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-600">
                <span className={`w-3 h-3 rounded-full ${chan.color}`} />
                <span>{chan.name}</span>
              </div>
              <div className="text-right flex items-center gap-2 font-bold">
                <span className="text-slate-800">{chan.pct}%</span>
                <span className="text-[10px] font-medium text-slate-400">({chan.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
