import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "@/utils";
import axios from "axios";
import { getProducts } from "@/api/getProducts";
import { getUrl } from "aws-amplify/storage";
const StoreContext = createContext(undefined);

export function StoreProvider({ children }) {
  const { data = [], isLoading, error } = getProducts();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadImageUrls = async () => {
      if (!data?.length) {
        setProducts([]);
        return;
      }

      const enrichedProducts = await Promise.all(
        data.map(async (product) => {
          try {
            if (!product.image_url) {
              return {
                ...product,
                imageSignedUrl: null,
              };
            }

            const result = await getUrl({
              path: product.image_url,
              options: {
                expiresIn: 3600,
              },
            });

            return {
              ...product,
              imageSignedUrl: result.url.toString(),
            };
          } catch (err) {
            console.error(
              `Failed to get image URL for product ${product.id}`,
              err,
            );

            return {
              ...product,
              imageSignedUrl: null,
            };
          }
        }),
      );

      setProducts(enrichedProducts);
    };
    loadImageUrls();
  }, [data]);

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
    axios.delete(`${import.meta.env.VITE_BASE_URL}/products/${productId}`);
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
      image_url: product.image,
      abv: product.alcoholContent,
    });
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        reservations,
        notifyRequests,
        updateProductStock,
        addReservation,
        addNotifyRequest,
        updateProduct,
        deleteProduct,
        addProduct,
        isLoading,
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
