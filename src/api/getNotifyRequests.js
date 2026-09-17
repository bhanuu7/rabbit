import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchNotifyRequests = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/notify-requests`,
  );
  return data;
};

export const getNotifyRequests = () => {
  return useQuery({
    queryKey: ["notify-requests"],
    queryFn: fetchNotifyRequests,
  });
};
