import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const reserveRequest = async (payload) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/reserve`,
    payload,
  ); // TO DO

  return data;
};

export const reserveProduct = () => {
  return useMutation({
    mutationKey: ["reserveProduct"],
    mutationFn: reserveRequest,
    onError: (err) => {
      console.error("Reserve failed", err);
    },
  });
};
