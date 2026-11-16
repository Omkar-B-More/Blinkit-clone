'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Address } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  rainSurgeFee: number;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  toggleRainSurge: () => void;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  isTrackingOpen: boolean;
  openTracking: (order?: Order) => void;
  closeTracking: () => void;
  placeOrder: (address: Address) => Promise<Order | null>;
  selectedProductForDetail: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [rainSurgeFee, setRainSurgeFee] = useState<number>(0); // ₹15 when monsoon surge is active
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Restore active cart from localStorage if any
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('blinkit_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedOrderId = localStorage.getItem('blinkit_active_order_id');
      if (savedOrderId) {
        fetch(`/api/orders/${savedOrderId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.order && data.order.status !== 'delivered') {
              setCurrentOrder(data.order);
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('blinkit_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
    setTipAmount(0);
    localStorage.removeItem('blinkit_cart');
  };

  const toggleRainSurge = () => {
    setRainSurgeFee((prev) => (prev > 0 ? 0 : 15));
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const itemTotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const deliveryFee = itemTotal >= 99 || itemTotal === 0 ? 0 : 25; // Free delivery over ₹99
  const handlingFee = items.length > 0 ? 5 : 0;
  const totalAmount = itemTotal + deliveryFee + handlingFee + rainSurgeFee + tipAmount;

  const placeOrder = async (address: Address): Promise<Order | null> => {
    if (!user || items.length === 0) return null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items,
          deliveryAddress: address,
          tipAmount,
          rainSurgeFee,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCurrentOrder(data.order);
        localStorage.setItem('blinkit_active_order_id', data.order.id);
        clearCart();
        setIsCartDrawerOpen(false);
        setIsTrackingOpen(true);
        await refreshUser();
        return data.order;
      }
      return null;
    } catch (err) {
      console.error('Order placement failed', err);
      return null;
    }
  };

  const openTracking = (order?: Order) => {
    if (order) setCurrentOrder(order);
    setIsTrackingOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        itemTotal,
        deliveryFee,
        handlingFee,
        rainSurgeFee,
        tipAmount,
        setTipAmount,
        toggleRainSurge,
        totalAmount,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        currentOrder,
        setCurrentOrder,
        isTrackingOpen,
        openTracking,
        closeTracking: () => setIsTrackingOpen(false),
        placeOrder,
        selectedProductForDetail,
        openProductDetail: (product: Product) => setSelectedProductForDetail(product),
        closeProductDetail: () => setSelectedProductForDetail(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
