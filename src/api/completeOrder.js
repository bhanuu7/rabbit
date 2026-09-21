import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const finishOrder = async ({ orderId, payload }) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/complete-order/${orderId}`,
    payload,
  );
  return data;
};

export const completeOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["complete-order"],
    mutationFn: finishOrder,
    onError: (err) => {
      console.error("Error completing the order", err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // 🔥 Refetch inventory/products (VERY IMPORTANT)
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
