export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number; // INR
  supplierId: string;
  petpoojaItemId?: string;
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string; // WhatsApp number with country code, e.g. 919876543210
  email: string;
  address: string;
  city: string;
  gstNumber?: string;
  categories: string[];
  isActive: boolean;
  leadTimeDays: number;
}

export interface OrderItem {
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  notes?: string;
}

export interface Order {
  id: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  status: "draft" | "sent" | "confirmed" | "delivered" | "cancelled";
  totalAmount: number;
  createdAt: string;
  expectedDelivery?: string;
  whatsappMessageId?: string;
  notes?: string;
}

export interface ConsumptionData {
  date: string;
  itemId: string;
  itemName: string;
  consumed: number;
  unit: string;
  revenue: number;
}

export interface PetpoojaMenuItem {
  itemid: string;
  itemname: string;
  itemdescription: string;
  price: number;
  itemallowvariation: string;
  itemveg: string;
  quantity?: number;
}

export interface PetpoojaConsumptionReport {
  itemid: string;
  itemname: string;
  quantity: number;
  unit: string;
  amount: number;
}

export interface DashboardStats {
  totalInventoryValue: number;
  lowStockCount: number;
  pendingOrdersCount: number;
  monthlySavings: number;
  activeSuppliers: number;
  todayConsumptionValue: number;
}

export interface StockAlert {
  itemId: string;
  itemName: string;
  currentStock: number;
  minStock: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  urgency: "critical" | "low" | "warning";
}

export interface WhatsAppOrderPayload {
  supplierPhone: string;
  supplierName: string;
  restaurantName: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  expectedDelivery?: string;
  notes?: string;
}
