import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { 
  Bell, 
  Trash2, 
  Check, 
  MapPin, 
  AlertTriangle, 
  ShoppingBag, 
  Settings, 
  ArrowLeft,
  X 
} from 'lucide-react';

interface NotificationsProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
  onToggleNotificationClose: () => void;
}

export default function Notifications({ 
  notifications, 
  onMarkAllRead, 
  onClearNotification,
  onToggleNotificationClose
}: NotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'inventory' | 'orders'>('all');

  const filteredNotifs = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    return notif.type === activeFilter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans select-none" id="notifications-overlay">
      
      {/* Top Header details */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onToggleNotificationClose}
            className="p-1.5 -ml-2 rounded-full hover:bg-slate-100 text-blue-600 active:scale-95 transition-all cursor-pointer"
            id="notif-back-btn"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Bell size={16} />
              Pusat Notifikasi
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 mt-0.5">Alert & Info Sistem</p>
          </div>
        </div>
        <button 
          onClick={onToggleNotificationClose}
          className="p-1.5 -mr-2 text-slate-400 hover:text-slate-800 hover:bg-slate-150 rounded"
        >
          <X size={18} />
        </button>
      </header>

      {/* Action panel & tabs */}
      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center gap-4">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {(['all', 'inventory', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-wider transition-all border ${
                activeFilter === tab 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900Item'
              }`}
            >
              {tab === 'all' ? 'Semua' : tab === 'inventory' ? 'Inventaris' : 'Pesanan'}
            </button>
          ))}
        </div>
        
        <button 
          onClick={onMarkAllRead}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          id="btn-mark-all"
        >
          Tandai Semua Dibaca
        </button>
      </div>

      {/* Centers items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" id="notif-scroller">
        {filteredNotifs.map(notif => (
          <div 
            key={notif.id}
            className={`p-4 bg-white border rounded-xl shadow-sm hover:shadow relative transition-all duration-300 flex gap-4 ${
              notif.unread ? 'border-blue-500/70 border-l-[4px] border-l-blue-600' : 'border-slate-200 opacity-80'
            }`}
            id={`notif-item-${notif.id}`}
          >
            {/* Visual type badges */}
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
              notif.type === 'inventory' ? 'bg-rose-50 text-rose-600' :
              notif.type === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {notif.type === 'inventory' && <AlertTriangle size={20} className="stroke-[2.5]" />}
              {notif.type === 'orders' && <ShoppingBag size={20} className="stroke-[2.5]" />}
              {notif.type === 'system' && <Settings size={20} className="stroke-[2.5]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-xs font-bold text-slate-800 leading-snug">
                  {notif.title}
                </h3>
                <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
                  {notif.time}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {notif.description}
              </p>
            </div>

            {/* Clear individual notification */}
            <button 
              onClick={() => onClearNotification(notif.id)}
              className="absolute bottom-2.5 right-2 text-slate-300 hover:text-rose-600 p-1.5 rounded transition-colors"
              id={`clear-notif-${notif.id}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {filteredNotifs.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl mt-6">
            <Check size={36} className="text-emerald-500 mx-auto mb-3 stroke-[2.5]" />
            <h4 className="text-xs font-bold text-slate-700">Kotak Masuk Bersih</h4>
            <p className="text-[10px] text-slate-400 mt-1">Anda sudah melihat seluruh pemberitahuan sistem dan perkembangan bisnis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
