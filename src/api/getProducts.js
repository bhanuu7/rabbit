import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
  return data;
};
export const getProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};
