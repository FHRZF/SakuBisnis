export interface User {
  email: string;
  businessName: string;
  role: string;
  avatarUrl: string;
}

export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  currency: 'USD' | 'IDR';
  stock: number;
  image: string;
  status: InventoryStatus;
}

export type PaymentStatus = 'paid' | 'unpaid';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  id: string;
  date: string;
  customerName: string;
  amount: number;
  currency: 'USD' | 'IDR';
  itemCount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ordersCount: number;
  tag: 'VIP' | 'New' | 'Inactive' | 'Wholesale' | 'None';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'inventory' | 'orders' | 'system';
}

export interface DashboardWidget {
  id: string;
  title: string;
  value: string;
  subValue: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: string;
}
