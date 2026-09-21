import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const cancelOrder = async (orderId) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/cancel-order/${orderId}`,
  );
  return data;
};

export const rejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancel-order"],
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
