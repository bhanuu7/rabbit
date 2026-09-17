import { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const CartContext = createContext(undefined);

const CART_KEY = "rabbit_cart";

export function CartProvider({ children }) {
  const [cartProducts, setCartProducts, clearCartStorage] = useLocalStorage(
    CART_KEY,
    {},
  );

  const addToCart = (product) => {
    setCartProducts((prev) => {
      const existing = prev?.[product.id];
      return {
        ...prev,
        [product.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { product, quantity: 1 },
      };
    });
  };

  const clearCart = () => {
    clearCartStorage();
  };

  const removeFromCart = (product) => {
    setCartProducts((prev) => {
      const existingItem = prev[product.id];

      // 🛑 Safety check
      if (!existingItem) return prev;

      if (existingItem.quantity > 1) {
        return {
          ...prev,
          [product.id]: {
            ...existingItem,
            quantity: existingItem.quantity - 1,
          },
        };
      } else {
        const newCart = { ...prev };
        delete newCart[product.id];
        return newCart;
      }
    });
  };

  const getCartCount = () => {
    if (!cartProducts) return;
    return Object.values(cartProducts).reduce(
      (total, item) => total + item.quantity,
      0,
    );
  };

  const getProductCount = (productId) => {
    if (!cartProducts) return 0;
    return (
      Object.values(cartProducts).filter(
        (product) => product.product.id === productId,
      )[0]?.quantity || 0
    );
  };

  const getCartTotal = () => {
    if (!cartProducts) return;
    return Object.values(cartProducts).reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        cartProducts,
        getCartCount,
        getProductCount,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) return;
  return cart;
}
