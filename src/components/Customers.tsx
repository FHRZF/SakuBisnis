import React, { useState } from 'react';
import { CustomerItem } from '../types';
import { Search, UserPlus, Mail, Award, AlertCircle, Phone } from 'lucide-react';

interface CustomersProps {
  customers: CustomerItem[];
  onAddCustomer: (customer: CustomerItem) => void;
}

export default function Customers({ customers, onAddCustomer }: CustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState<'All' | 'VIP' | 'New' | 'Inactive' | 'Wholesale'>('All');

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeSegment === 'All') return matchesSearch;
    return matchesSearch && cust.tag === activeSegment;
  });

  return (
    <div className="flex flex-col gap-6" id="customers-view">
      {/* Search & Tag select Stickies */}
      <section className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm sticky top-[60px] z-20">
        <div className="relative w-full mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari email atau nama pelanggan..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            id="cust-search"
          />
        </div>

        {/* Categories filters scroll */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
          {(['All', 'VIP', 'New', 'Inactive', 'Wholesale'] as const).map(seg => (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeSegment === seg 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id={`tab-segment-${seg}`}
            >
              {seg === 'All' ? 'Semua Kontak' : seg}
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Summary counters */}
      <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
          <Award size={14} className="text-blue-600" />
          Daftar Rekanan & Pelanggan
        </span>
        <span className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-black text-slate-800 rounded-lg shadow-sm">
          {filteredCustomers.length} Pelanggan
        </span>
      </div>

      {/* Customer items listed vertically */}
      <div className="flex flex-col gap-3" id="customers-list">
        {filteredCustomers.map(cust => (
          <div
            key={cust.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {cust.avatar ? (
                  <img 
                    src={cust.avatar} 
                    alt={cust.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-sm font-black text-blue-600 uppercase">
                    {cust.name.substring(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {cust.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <Mail size={10} />
                  {cust.email}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold text-blue-600">
                {cust.ordersCount} Pesanan
              </span>
              
              {cust.tag !== 'None' && (
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  cust.tag === 'VIP' ? 'bg-amber-100 text-amber-800' :
                  cust.tag === 'New' ? 'bg-blue-100 text-blue-800' :
                  cust.tag === 'Wholesale' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cust.tag}
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <AlertCircle size={36} className="text-slate-300 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-slate-700">Pelanggan tidak ditemukan</h4>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Kosongkan pencarian untuk melihat semua kontak bisnis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
