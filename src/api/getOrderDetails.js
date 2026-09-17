import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchOrderDetails = async (orderId) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/orders/${orderId}`,
  );
  return data;
};

export const getOrderDetails = (orderId) => {
  return useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
    staleTime: 0,
  });
};
