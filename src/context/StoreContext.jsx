import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "@/utils";
import axios from "axios";
const StoreContext = createContext(undefined);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("liquor-store-products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem("liquor-store-reservations");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifyRequests, setNotifyRequests] = useState(() => {
    const saved = localStorage.getItem("liquor-store-notify");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("liquor-store-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(
      "liquor-store-reservations",
      JSON.stringify(reservations),
    );
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem("liquor-store-notify", JSON.stringify(notifyRequests));
  }, [notifyRequests]);

  const updateProductStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)),
    );

    // Check if product was restocked and notify users
    const product = products.find((p) => p.id === productId);
    if (product && product.stock === 0 && newStock > 0) {
      const requests = notifyRequests.filter((r) => r.productId === productId);
      // In a real app, send emails here
      // For now, we'll just clear the notify requests
      setNotifyRequests((prev) =>
        prev.filter((r) => r.productId !== productId),
      );
    }
  };

  const addReservation = (reservation) => {
    const newReservation = {
      ...reservation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setReservations((prev) => [...prev, newReservation]);

    // Reduce stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === reservation.productId
          ? { ...p, stock: Math.max(0, p.stock - reservation.quantity) }
          : p,
      ),
    );
  };

  const addNotifyRequest = (productId, email) => {
    const newRequest = {
      id: Date.now().toString(),
      productId,
      email,
      timestamp: new Date().toISOString(),
    };
    setNotifyRequests((prev) => [...prev, newRequest]);
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    axios.post(`${import.meta.env.VITE_BASE_URL}/add`, {
      item_name: product.name,
      stock_count: product.stock,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
    });
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        reservations,
        notifyRequests,
        updateProductStock,
        addReservation,
        addNotifyRequest,
        updateProduct,
        deleteProduct,
        addProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
