import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateProductAPI = async (payload) => {
  console.log("payload=====++>", payload);
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/products/update`,
    payload,
  );
  return data; // ✅ important
};

export const updateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-product"], // ✅ no payload here
    mutationFn: updateProductAPI,
    onSuccess: queryClient.invalidateQueries(["orders"]),
  });
};
