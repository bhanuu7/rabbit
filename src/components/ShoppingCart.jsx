import { ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

export default function CartIcon({ count }) {
  const navigate = useNavigate();
  const handleCartNavigation = () => {
    navigate("/cart");
  };
  return (
    <div className="relative inline-flex items-center justify-center">
      <ShoppingCart className="h-6 w-6" onClick={handleCartNavigation} />
      {count > 0 && (
        <Badge
          className="
            absolute -top-2 -right-2 
            h-5 min-w-[20px] 
            flex items-center justify-center 
            rounded-full px-1 text-xs
          "
        >
          {count}
        </Badge>
      )}
    </div>
  );
}
