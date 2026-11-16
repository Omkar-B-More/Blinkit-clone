export interface Product {
  id: string;
  name: string;
  category: string;
  weight: string; // e.g., "500 ml", "1 kg", "200 g"
  price: number; // in ₹ (Indian Rupee)
  mrp: number; // Maximum Retail Price
  discountPercentage: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  description: string;
  brand: string;
  shelfLife: string;
  isVeg: boolean;
  rating: number;
  reviewsCount: number;
  keyFeatures?: string[];
  unitType?: string;
  isPrintItem?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  flat: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  orderCount: number;
  totalSpent: number;
  addresses: Address[];
  createdAt: string;
  lastActive: string;
}

export type OrderStatus =
  | 'placed'
  | 'packing'
  | 'rider_assigned'
  | 'out_for_delivery'
  | 'delivered';

export interface RiderInfo {
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicleNumber: string;
  vehicleModel: string;
  photo: string;
  currentLat?: number;
  currentLng?: number;
}

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  rainSurgeFee: number;
  tipAmount: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: Address;
  deliveryOtp: string;
  darkStoreName: string;
  rider: RiderInfo;
  createdAt: string;
  estimatedDeliveryTimeMinutes: number;
  elapsedSeconds: number;
}

export interface PrintOrderConfig {
  fileName: string;
  pageCount: number;
  isColor: boolean; // false = B&W (₹3/pg), true = Color (₹10/pg)
  isDoubleSided: boolean;
  spiralBinding: boolean; // +₹40
  copies: number;
}
