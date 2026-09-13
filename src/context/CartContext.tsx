import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../data/products';

export type CartItem = {
  key: string;
  product: Product;
  qty: number;
  variant: string;
  artworkName?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addProduct: (product: Product, qty?: number, variant?: string, artworkName?: string) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CART_KEY = '@stick-adesivos/cart';
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then((value) => {
      if (!value) return;
      try {
        const saved = JSON.parse(value) as CartItem[];
        if (Array.isArray(saved)) setItems(saved);
      } catch {
        setItems([]);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    addProduct: (product, qty = 1, variant = '5x5 cm', artworkName = '') => {
      const key = `${product.slug}|${variant}`;
      setItems((current) => {
        const exists = current.find((item) => item.key === key);
        if (exists) {
          return current.map((item) => item.key === key ? { ...item, qty: item.qty + qty, artworkName: artworkName || item.artworkName } : item);
        }
        return [...current, { key, product, qty, variant, artworkName }];
      });
    },
    updateQty: (key, qty) => setItems((current) => current.map((item) => item.key === key ? { ...item, qty: Math.max(1, qty) } : item)),
    removeItem: (key) => setItems((current) => current.filter((item) => item.key !== key)),
    clearCart: () => setItems([])
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart precisa estar dentro de CartProvider');
  return context;
}
