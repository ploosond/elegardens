"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { Product, Pot } from "@/payload-types";

export interface CartItem {
  product?: Product;
  pot?: Pot;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Product | Pot, quantity?: number) => void;
  removeItem: (itemId: number, itemType?: "product" | "pot") => void;
  updateQuantity: (
    itemId: number,
    quantity: number,
    itemType?: "product" | "pot",
  ) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalProducts: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "client_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate and filter out invalid items (must have either product or pot)
        const validItems = parsed.filter((item: CartItem) => {
          return item.product?.id || item.pot?.id;
        });
        setItems(validItems);
      }
      setIsLoaded(true); // Mark as loaded after initial load completes
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setIsLoaded(true); // Mark as loaded even on error to prevent infinite empty saves
    }
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    // Don't save to localStorage until we've loaded the initial state
    // This prevents overwriting the cart with an empty array on mount
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      // Dispatch custom event for cart updates
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items, isLoaded]);

  const addItem = (item: Product | Pot, quantity: number = 1) => {
    setItems((prevItems) => {
      // Check if it's a product or pot
      const isProduct = "productId" in item;
      const itemId = item.id;

      // Find existing item (check both product and pot)
      const existingItem = prevItems.find((cartItem) => {
        if (isProduct && cartItem.product) {
          return cartItem.product.id === itemId;
        } else if (!isProduct && cartItem.pot) {
          return cartItem.pot.id === itemId;
        }
        return false;
      });

      if (existingItem) {
        return prevItems.map((cartItem) => {
          if (isProduct && cartItem.product && cartItem.product.id === itemId) {
            return { ...cartItem, quantity: cartItem.quantity + quantity };
          } else if (!isProduct && cartItem.pot && cartItem.pot.id === itemId) {
            return { ...cartItem, quantity: cartItem.quantity + quantity };
          }
          return cartItem;
        });
      }

      // Add new item
      if (isProduct) {
        return [...prevItems, { product: item as Product, quantity }];
      } else {
        return [...prevItems, { pot: item as Pot, quantity }];
      }
    });
  };

  const removeItem = (itemId: number, itemType?: "product" | "pot") => {
    setItems((prevItems) => {
      return prevItems.filter((item) => {
        if (itemType === "product" || (!itemType && item.product)) {
          return item.product?.id !== itemId;
        } else if (itemType === "pot" || (!itemType && item.pot)) {
          return item.pot?.id !== itemId;
        }
        return true;
      });
    });
  };

  const updateQuantity = (
    itemId: number,
    quantity: number,
    itemType?: "product" | "pot",
  ) => {
    if (quantity <= 0) {
      removeItem(itemId, itemType);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (itemType === "product" || (!itemType && item.product)) {
          if (item.product?.id === itemId) {
            return { ...item, quantity };
          }
        } else if (itemType === "pot" || (!itemType && item.pot)) {
          if (item.pot?.id === itemId) {
            return { ...item, quantity };
          }
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalProducts = useMemo(() => {
    return items.length;
  }, [items]);

  const getTotalItems = () => totalItems;
  const getTotalProducts = () => totalProducts;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
