import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserType, 
  InventoryItem, 
  OrderItem, 
  CustomerItem, 
  NotificationItem, 
  OrderStatus, 
  PaymentStatus 
} from './types';

// Importing custom components
import LoginRegister from './components/LoginRegister';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Analytics from './components/Analytics';
import Notifications from './components/Notifications';

// Lucide icons
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Users, 
  BarChart3, 
  Bell, 
  LogOut, 
  Store, 
  Plus, 
  Menu,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // Active navigation screen state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Drawer modal or panel state
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // States with persisted local storage
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Drag prefilled state
  const [prefilledItemForOrder, setPrefilledItemForOrder] = useState<InventoryItem | null>(null);

  // Load default configurations or state upon startup
  useEffect(() => {
    // 1. Inventory Items
    const storedInventory = localStorage.getItem('sakubisnis_inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    } else {
      const defaultInventory: InventoryItem[] = [
        {
          id: 'INV-1',
          name: 'ThinkPad X1 Carbon Gen 10',
          sku: 'LPT-TP-X1-001',
          category: 'Electronics',
          price: 1450,
          currency: 'USD',
          stock: 45,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV6AYHvRxuXRK8kWZRyV4vkp_2wE2crCt_bwLF3zgDxd1pOGCN-M6zNFAqQ80UiT_WY912nLYjsOIPQAKgwT2dWViLzxqNB8K4AmqjYwS7GyN5MMaYxPIbgMTvtu2fnhFFIHFJvk4_E_leAq55VdnU02xKNqW0qwmCZnf9TjEiZ-owOtGMkr5Jr5-LDVzdFbWzyk0kazMRjdrI2q5M5XxO40R5SVW6pCX3IHhjPbB0rXlESHpK7I3uyHoWkdPEBfFo0h9rQZu-Hgk',
          status: 'in-stock'
        },
        {
          id: 'INV-2',
          name: 'Sony WH-1000XM5',
          sku: 'AUD-SN-XM5-BLK',
          category: 'Electronics',
          price: 348,
          currency: 'USD',
          stock: 3,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD885ObqLPTqVSrS25F7LXNNaM6rYZimvgjjJQMhdjDNgyy0RNN6872X-hjn9GQPzRFCpV4zyVgQndpiQDzdVhJ_MSbE_YCeVzr4vhv7fciIggfgv6HDWK1DYfBNsOyJ_s76gudjYtJ1Ha8Uq1HoODKJHApICcr6WTAWw5IQuB25Z_kivdKZaiOBy9DQsXYa_5JjcyQr8eJTIsRcrWH-rZbTIhr2eBQ0BqcOuy9SmsvP76OkDQ5TSADeYXboy26AIb6ydD4gZSSW94',
          status: 'low-stock'
        },
        {
          id: 'INV-3',
          name: 'ErgoPro Mesh Chair',
          sku: 'FUR-EP-MC-GRY',
          category: 'Furniture',
          price: 299,
          currency: 'USD',
          stock: 0,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6NLaVVU-PHi6ASfqIW3qee8H_jK8D556IRfFMvrrIY8gCYzdtNNX0CnVpJ7Am_Qk2ULk12M-0sjwOSFL1vgXLuI8IMOtSRCBj514ogtTNU43Jv8MY0nP_HyEBqP5ZLsXTnE9tpeTt8Se7s5BLUcsZ1bbBRSwarn3KfeFNZ_BBIHk0TORPVnVPtF6S2PX8rcKYAyAw8e55oKmujIT9g4ueSUcoKNIiiG1GQfeg0fDAB0R6oXZTVt_7NcbCDj33uGNIPru_tCSlAHU',
          status: 'out-of-stock'
        },
        {
          id: 'INV-4',
          name: 'Dell UltraSharp 27"',
          sku: 'DIS-DL-U27-4K',
          category: 'Electronics',
          price: 550,
          currency: 'USD',
          stock: 12,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
          status: 'in-stock'
        }
      ];
      setInventory(defaultInventory);
      localStorage.setItem('sakubisnis_inventory', JSON.stringify(defaultInventory));
    }

    // 2. Orders List
    const storedOrders = localStorage.getItem('sakubisnis_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      const defaultOrders: OrderItem[] = [
        {
          id: 'ORD-2401',
          date: 'Hari ini, 10:45 AM',
          customerName: 'Budi Santoso',
          amount: 1250000,
          currency: 'IDR',
          itemCount: 3,
          paymentStatus: 'paid',
          status: 'processing'
        },
        {
          id: 'ORD-2400',
          date: 'Kemarin',
          customerName: 'Siti Rahma',
          amount: 450000,
          currency: 'IDR',
          itemCount: 1,
          paymentStatus: 'unpaid',
          status: 'pending'
        },
        {
          id: 'ORD-2399',
          date: '24 Okt',
          customerName: 'PT Maju Mundur',
          amount: 5800000,
          currency: 'IDR',
          itemCount: 12,
          paymentStatus: 'paid',
          status: 'shipped'
        },
        {
          id: 'ORD-2398',
          date: '22 Okt',
          customerName: 'Toko Kopi ABC',
          amount: 850000,
          currency: 'IDR',
          itemCount: 2,
          paymentStatus: 'paid',
          status: 'delivered'
        }
      ];
      setOrders(defaultOrders);
      localStorage.setItem('sakubisnis_orders', JSON.stringify(defaultOrders));
    }

    // 3. Customers
    const storedCustomers = localStorage.getItem('sakubisnis_customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      const defaultCustomers: CustomerItem[] = [
        {
          id: 'CUST-1',
          name: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxmBmV1R4VpvnZlxAM44gDcgyinveRkwmhC7rOcTuzH4LSugHn2tTQk2OMRbo_ksLVBFBGutkONiIVDJQlLNZe3to3zJsWOwLim2bWLIS_-LrZWeX_g5YP5LNXIUyUAUjZIRqKJ8hXKx4rN0FewQtE9-g9NNvLMbxnv1h5LhHHd5XU78u2XG9wpGMNYtzjGYEDVkEF83pRyJmsI_87ExmUerZ3NIkIYQKm6Cy04vB0zCucticRB-PXgOBTQ7g8MG--1h6e0K4TRo',
          ordersCount: 24,
          tag: 'VIP'
        },
        {
          id: 'CUST-2',
          name: 'Michael Chen',
          email: 'm.chen@logistics.com',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBALiQEv4M-nyXNmjNk2NggWP_9F38MssmvGtNg96PtYdX3MywkQEGxS_77lPRFlPbLXd7S4a2zLDAf9a_k6qU-jZZMtITli3JpbogoYvlPpnDDfyK8Zv5y6aMzHjiP1LQgAu21rHUD7HBBcidQjjVF4znXplJHWVQ4FTID3_ec01zXkzSUCyU0e4nGr4ZoQEyKAfKofNC8UHXyl0JC6a7UMpaBRizo1Vq6_DXgLMbLabVbV5OOOb9yFPW1Ja9HwWa5TWlLXhUBRaQ',
          ordersCount: 8,
          tag: 'New'
        },
        {
          id: 'CUST-3',
          name: 'Elena Rodriguez',
          email: 'elena.r@studio.co',
          avatar: '',
          ordersCount: 2,
          tag: 'New'
        },
        {
          id: 'CUST-4',
          name: 'David Kim',
          email: 'dkim@ventures.io',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkHgz2QN0NOlwggdtR0a0dyJ3rXIMGmdBffsjBC1mLjGkjLg5mgX84KlRc6KbbzvDZnd33G60Ot7U80hPGpqhwUOPdW_N_SFtCcbI6ZyD5a3HKcJcXAjmzgKRJFzohBCp6hCsow56o5PmZArW2tbk0T874KUXdaGf-6MipbcklzKdnaXiiF5q6aperjcsC8A_i7Spv39VdI2QYYV4OQPWJreMKK4HTQigmRdnuntdUMqliJ7AEr51MXwcWpKhkJvZIGtvjGWpKRJY',
          ordersCount: 15,
          tag: 'VIP'
        }
      ];
      setCustomers(defaultCustomers);
      localStorage.setItem('sakubisnis_customers', JSON.stringify(defaultCustomers));
    }

    // 4. Notifications center
    const storedNotifs = localStorage.getItem('sakubisnis_notifications');
    if (storedNotifs) {
      setNotifications(JSON.parse(storedNotifs));
    } else {
      const defaultNotifs: NotificationItem[] = [
        {
          id: 'NT-1',
          title: 'Alarm Stok Menipis: Sony WH-1000XM5',
          description: 'Hanya tersisa 3 unit di Gudang Utama. Harap pertimbangkan restock untuk mencegah kekosongan barang.',
          time: '10m yang lalu',
          unread: true,
          type: 'inventory'
        },
        {
          id: 'NT-2',
          title: 'Pesanan Masuk Baru #ORD-8921',
          description: 'Berhasil menerima pembayaran lunas dari pelanggan Budi Santoso senilai Rp 1.250.000.',
          time: '1j yang lalu',
          unread: true,
          type: 'orders'
        },
        {
          id: 'NT-3',
          title: 'Pemeliharaan Selesai Terjadwal',
          description: 'Optimasi basis data mingguan selesai. Performa query dan transit data meningkat 15%.',
          time: 'Kemarin',
          unread: false,
          type: 'system'
        },
        {
          id: 'NT-4',
          title: 'Pesanan #ORD-8890 Dikirim',
          description: 'Informasi pelacakan kurir telah diperbarui otomatis. Estimasi paket tiba: Besok Sore.',
          time: 'Kemarin',
          unread: false,
          type: 'orders'
        }
      ];
      setNotifications(defaultNotifs);
      localStorage.setItem('sakubisnis_notifications', JSON.stringify(defaultNotifs));
    }

    // Look for previous logged-in session
    const activeSession = localStorage.getItem('sakubisnis_active_user');
    if (activeSession) {
      setCurrentUser(JSON.parse(activeSession));
    }
  }, []);

  // Update localStorage helper on state updates
  const saveInventory = (newInv: InventoryItem[]) => {
    setInventory(newInv);
    localStorage.setItem('sakubisnis_inventory', JSON.stringify(newInv));
  };

  const saveOrders = (newOrd: OrderItem[]) => {
    setOrders(newOrd);
    localStorage.setItem('sakubisnis_orders', JSON.stringify(newOrd));
  };

  const saveCustomers = (newCust: CustomerItem[]) => {
    setCustomers(newCust);
    localStorage.setItem('sakubisnis_customers', JSON.stringify(newCust));
  };

  const saveNotifs = (newNotif: NotificationItem[]) => {
    setNotifications(newNotif);
    localStorage.setItem('sakubisnis_notifications', JSON.stringify(newNotif));
  };

  // Login handler
  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
    localStorage.setItem('sakubisnis_active_user', JSON.stringify(user));
  };

  // Sign out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('sakubisnis_active_user');
  };

  // Adding product actions
  const handleAddItem = (item: InventoryItem) => {
    const updated = [item, ...inventory];
    saveInventory(updated);

    // Create system notification
    const newNotif: NotificationItem = {
      id: `NT-${Date.now()}`,
      title: 'Hore! Produk Baru Ditambahkan',
      description: `Produk "${item.name}" berhasil terdaftar dengan kode SKU ${item.sku}.`,
      time: 'Baru saja',
      unread: true,
      type: 'inventory'
    };
    saveNotifs([newNotif, ...notifications]);
  };

  // Deleting product
  const handleDeleteItem = (id: string) => {
    const updated = inventory.filter(p => p.id !== id);
    saveInventory(updated);
  };

  // Stock editor triggers (used in DND drop or sliders)
  const handleUpdateStock = (id: string, amount: number) => {
    const updated = inventory.map(item => {
      if (item.id === id) {
        const nextStock = Math.max(0, item.stock + amount);
        let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
        if (nextStock === 0) status = 'out-of-stock';
        else if (nextStock <= 5) status = 'low-stock';

        return { ...item, stock: nextStock, status: status };
      }
      return item;
    });
    saveInventory(updated);

    // Notify low stock level dynamically
    const changedItem = inventory.find(i => i.id === id);
    if (changedItem && (changedItem.stock + amount) <= 5 && (changedItem.stock + amount) > 0) {
      const newNotif: NotificationItem = {
        id: `NT-${Date.now()}`,
        title: `Peringatan Stok Menipis: ${changedItem.name}`,
        description: `Tersisa hanya ${changedItem.stock + amount} unit barang. Lakukan isi ulang segera!`,
        time: 'Baru saja',
        unread: true,
        type: 'inventory'
      };
      saveNotifs([newNotif, ...notifications]);
    }
  };

  // DND Trigger to auto-create custom prefilled orders
  const handleDragItemToOrder = (item: InventoryItem) => {
    setPrefilledItemForOrder(item);
    setActiveTab('orders');
  };

  // Order additions
  const handleAddOrder = (order: OrderItem) => {
    const updated = [order, ...orders];
    saveOrders(updated);

    // System Notification alerts
    const newNotif: NotificationItem = {
      id: `NT-${Date.now()}`,
      title: `Transaksi Tercatat: ${order.id}`,
      description: `Pesanan bernilai Rp ${order.amount.toLocaleString('id-ID')} atas nama ${order.customerName} telah ditambahkan ke pembukuan.`,
      time: 'Baru saja',
      unread: true,
      type: 'orders'
    };
    saveNotifs([newNotif, ...notifications]);
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map(ord => {
      if (ord.id === id) return { ...ord, status: status };
      return ord;
    });
    saveOrders(updated);
  };

  const handleUpdatePaymentStatus = (id: string, payStatus: PaymentStatus) => {
    const updated = orders.map(ord => {
      if (ord.id === id) return { ...ord, paymentStatus: payStatus };
      return ord;
    });
    saveOrders(updated);
  };

  // Notification clearings
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    saveNotifs(updated);
  };

  const handleClearNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifs(updated);
  };

  // Quick statistical notification alerts count
  const unreadCount = notifications.filter(n => n.unread).length;

  if (!currentUser) {
    return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
  }

  // Define screens inside render context
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            inventory={inventory} 
            orders={orders} 
            onNavigate={(tab) => setActiveTab(tab)}
            onQuickAddItem={() => setActiveTab('inventory')}
            onQuickAddOrder={() => setActiveTab('orders')}
          />
        );
      case 'inventory':
        return (
          <Inventory 
            items={inventory} 
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onUpdateStock={handleUpdateStock}
            onDragItemToOrder={handleDragItemToOrder}
          />
        );
      case 'orders':
        return (
          <Orders 
            orders={orders} 
            onAddOrder={handleAddOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            inventory={inventory}
            prefilledItemForOrder={prefilledItemForOrder}
            onClearPrefilledItem={() => setPrefilledItemForOrder(null)}
          />
        );
      case 'customers':
        return (
          <Customers 
            customers={customers} 
            onAddCustomer={(newCust) => saveCustomers([newCust, ...customers])}
          />
        );
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard inventory={inventory} orders={orders} onNavigate={(tab) => setActiveTab(tab)} onQuickAddItem={() => setActiveTab('inventory')} onQuickAddOrder={() => setActiveTab('orders')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col justify-between" id="app-viewport">
      
      {/* Top Floating Header with Geometric Balance alignment */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          {/* Logo Brand with custom icon setup */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-extrabold text-sm tracking-tight shadow-sm">S</div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              SAKU <span className="text-blue-600 font-medium">BISNIS</span>
            </span>
            <div className="hidden sm:flex gap-1.5 ml-2">
              <span className="px-2.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-500 select-none">v2.4.0</span>
              <span className="px-2.5 py-0.5 bg-green-100 rounded text-[10px] font-semibold text-green-600 flex items-center gap-1 select-none">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                LIVE CONFIG
              </span>
            </div>
          </div>

          {/* Quick Header right accessories */}
          <div className="flex items-center gap-3">
            {/* Notifications toggle action bell */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-50 text-slate-600 rounded-sm border border-slate-200 hover:text-blue-600 hover:border-blue-200 transition-colors relative"
              id="header-notif-bell"
            >
              <Bell size={18} className="stroke-[2.5]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar circle with logout */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
              <img 
                src={currentUser.avatarUrl} 
                alt="Profile" 
                className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-xs object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-none">{currentUser.businessName}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{currentUser.role}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50 transition-colors ml-1"
                title="Keluar Sesi"
                id="header-signout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper with responsive navigations */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR VIEW NAVIGATION (Hidden on mobile) */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 p-6 space-y-6 flex-shrink-0 justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Akses Sistem</h3>
              <div className="bg-slate-50 hover:bg-slate-100 transition-colors p-3.5 rounded-lg border border-slate-200 flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-sm flex items-center justify-center">
                  <Sparkles size={16} className="stroke-[2.5]" />
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-black text-slate-800 leading-tight truncate">{currentUser.businessName}</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Sistem Aktif
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Navigasi Utama</h3>
              <div className="space-y-1.5">
                <a 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full p-3 border rounded-lg text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard size={16} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'} />
                    <span>Dashboard Utama</span>
                  </div>
                  {activeTab === 'dashboard' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </a>

                <a 
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full p-3 border rounded-lg text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                    activeTab === 'inventory' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package size={16} className={activeTab === 'inventory' ? 'text-blue-600' : 'text-slate-400'} />
                    <span>Inventaris Barang</span>
                  </div>
                  {activeTab === 'inventory' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </a>

                <a 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full p-3 border rounded-lg text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                    activeTab === 'orders' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt size={16} className={activeTab === 'orders' ? 'text-blue-600' : 'text-slate-400'} />
                    <span>Buku Transaksi</span>
                  </div>
                  {activeTab === 'orders' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </a>

                <a 
                  onClick={() => setActiveTab('customers')}
                  className={`w-full p-3 border rounded-lg text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                    activeTab === 'customers' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users size={16} className={activeTab === 'customers' ? 'text-blue-600' : 'text-slate-400'} />
                    <span>Rekanan Pelanggan</span>
                  </div>
                  {activeTab === 'customers' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </a>

                <a 
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full p-3 border rounded-lg text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                    activeTab === 'analytics' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 size={16} className={activeTab === 'analytics' ? 'text-blue-600' : 'text-slate-400'} />
                    <span>Analisis Akuntansi</span>
                  </div>
                  {activeTab === 'analytics' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-2 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sesi Berjalan</h4>
              <span className="text-[11px] font-semibold text-slate-700">{currentUser.email}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full py-2.5 bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 rounded-md font-bold text-xs transition-colors cursor-pointer"
            >
              Keluar Sesi Kerja
            </button>
          </div>
        </aside>

        {/* PRIMARY VIEWING STAGE */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-28 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-3xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Notifications subscreen drawer pop-up sliding panel */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="w-full max-w-md h-full bg-white shadow-2xl relative"
            >
              <Notifications 
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onClearNotification={handleClearNotif}
                onToggleNotificationClose={() => setShowNotifications(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION BAR VIEW SHELL (Visible only on mobile layouts) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 py-2.5 pb-safe flex justify-around items-center lg:hidden z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] h-[68px]">
        
        {/* Dashboard index */}
        <button 
          onClick={() => { setActiveTab('dashboard'); setShowNotifications(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest ${
            activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-dashboard"
        >
          <div className={`p-1.5 px-3 rounded-full ${activeTab === 'dashboard' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <LayoutDashboard size={18} />
          </div>
          <span>Dasbor</span>
        </button>

        {/* Inventory page */}
        <button 
          onClick={() => { setActiveTab('inventory'); setShowNotifications(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest ${
            activeTab === 'inventory' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-inventory"
        >
          <div className={`p-1.5 px-3 rounded-full ${activeTab === 'inventory' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <Package size={18} />
          </div>
          <span>Gudang</span>
        </button>

        {/* Transactions list */}
        <button 
          onClick={() => { setActiveTab('orders'); setShowNotifications(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest ${
            activeTab === 'orders' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-orders"
        >
          <div className={`p-1.5 px-3 rounded-full ${activeTab === 'orders' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <Receipt size={18} />
          </div>
          <span>Pesanan</span>
        </button>

        {/* Customers */}
        <button 
          onClick={() => { setActiveTab('customers'); setShowNotifications(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest ${
            activeTab === 'customers' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-customers"
        >
          <div className={`p-1.5 px-3 rounded-full ${activeTab === 'customers' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <Users size={18} />
          </div>
          <span>Kontak</span>
        </button>

        {/* Advanced KPI analytics page index */}
        <button 
          onClick={() => { setActiveTab('analytics'); setShowNotifications(false); }}
          className={`flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest ${
            activeTab === 'analytics' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
          id="nav-analytics"
        >
          <div className={`p-1.5 px-3 rounded-full ${activeTab === 'analytics' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <BarChart3 size={18} />
          </div>
          <span>Akun</span>
        </button>
      </nav>
    </div>
  );
}
