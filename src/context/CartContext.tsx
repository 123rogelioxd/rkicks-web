'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CheckoutCartItem } from '@/utils/checkout-cart';

interface CartContextValue {
  isOpen: boolean;
  lastAdded: CheckoutCartItem | null;
  openCart: (lastAdded?: CheckoutCartItem) => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  isOpen: false,
  lastAdded: null,
  openCart: () => {},
  closeCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CheckoutCartItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const openCart = useCallback((item?: CheckoutCartItem) => {
    setIsOpen(true);
    if (item) {
      setLastAdded(item);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLastAdded(null), 3000);
    }
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CartContext.Provider value={{ isOpen, lastAdded, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
