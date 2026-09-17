import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchOrders = async (userId) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/get-user-orders/${userId}`,
    );
    return data;
  } catch (error) {
    console.error("Error while fetching your orders", error);
  }
};

export const getOrdersOfUsers = (userId) => {
  return useQuery({
    queryKey: ["get-personal-orders"],
    queryFn: () => fetchOrders(userId),
  });
};
