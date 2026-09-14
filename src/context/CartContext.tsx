import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "../data/products";
import {
  addToNuvemshopCart,
  removeFromNuvemshopCart,
} from "../integrations/nuvemshopBridge";

export type CartItem = {
  key: string;
  product: Product;
  qty: number;
  variant: string;
  unitPrice: number;
  nuvemshopVariantId?: number;
  artworkName?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addProduct: (
    product: Product,
    qty?: number,
    variant?: string,
    artworkName?: string,
    nuvemshopVariantId?: number,
    unitPrice?: number,
  ) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CART_KEY = "@stick-adesivos/cart";
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

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce(
        (sum, item) => sum + (item.unitPrice ?? item.product.price) * item.qty,
        0,
      ),
      addProduct: (
        product,
        qty = 1,
        variant = "5x5 cm",
        artworkName = "",
        nuvemshopVariantId,
        unitPrice = product.price,
      ) => {
        const key = `${product.slug}|${nuvemshopVariantId ?? variant}`;
        addToNuvemshopCart(
          product,
          qty,
          variant,
          nuvemshopVariantId,
        );
        setItems((current) => {
          const exists = current.find((item) => item.key === key);
          if (exists) {
            return current.map((item) =>
              item.key === key
                ? {
                    ...item,
                    qty: item.qty + qty,
                    artworkName: artworkName || item.artworkName,
                  }
                : item,
            );
          }
          return [
            ...current,
            {
              key,
              product,
              qty,
              variant,
              unitPrice,
              nuvemshopVariantId,
              artworkName,
            },
          ];
        });
      },
      updateQty: (key, qty) => {
        const item = items.find((current) => current.key === key);
        if (!item) return;
        const nextQty = Math.max(1, qty);
        const difference = nextQty - item.qty;
        if (difference > 0)
          addToNuvemshopCart(
            item.product,
            difference,
            item.variant,
            item.nuvemshopVariantId,
          );
        if (difference < 0)
          removeFromNuvemshopCart(
            item.product,
            Math.abs(difference),
            item.nuvemshopVariantId,
          );
        setItems((current) =>
          current.map((currentItem) =>
            currentItem.key === key
              ? { ...currentItem, qty: nextQty }
              : currentItem,
          ),
        );
      },
      removeItem: (key) => {
        const item = items.find((current) => current.key === key);
        if (item)
          removeFromNuvemshopCart(
            item.product,
            item.qty,
            item.nuvemshopVariantId,
          );
        setItems((current) =>
          current.filter((currentItem) => currentItem.key !== key),
        );
      },
      clearCart: () => {
        items.forEach((item) =>
          removeFromNuvemshopCart(
            item.product,
            item.qty,
            item.nuvemshopVariantId,
          ),
        );
        setItems([]);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart precisa estar dentro de CartProvider");
  return context;
}
