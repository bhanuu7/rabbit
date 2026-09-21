import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchorders = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`);
  return data;
};

export const getOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchorders,
  });
};
