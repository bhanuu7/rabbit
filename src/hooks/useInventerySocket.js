import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { useQueryClient } from "@tanstack/react-query";

export const useInventorySocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 🔥 Ensure socket is connected
    if (!socket.connected) {
     // socket.connect();
    }
    const handleUpdate = (data) => {
      const { productId, stock_count } = data;
      // 🧠 Safe cache update
      queryClient.setQueryData(["products"], (old = []) => {
        if (!old) return [];
        return old.map((p) => (p.id === productId ? { ...p, stock_count } : p));
      });
    };

    // ✅ Listen
    socket.on("inventory:update", (event) => {
      handleUpdate(event);
    });

    // 🧹 Cleanup (VERY IMPORTANT)
    return () => {
      socket.off("inventory:update", handleUpdate);
    };
  }, [queryClient]);
};
