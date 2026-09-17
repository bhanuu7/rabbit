import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOrderDetails } from "@/api/getOrderDetails";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { rejectOrder } from "@/api/cancelOrder";
import { completeOrder } from "@/api/completeOrder";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const OrderDetailsDialog = ({ open, onClose, orderId }) => {
  const { data, isLoading, error } = getOrderDetails(orderId);
  const { mutate, isLoading: rejectOrderStatus } = rejectOrder();
  const { mutate: completeOrderFn, isLoading: orderCompletionLoading } =
    completeOrder();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
    }
  }, [data]);

  const handleIncrease = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrease = (productId) => {
    setItems(
      (prev) =>
        prev
          .map((item) =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0), // remove if 0
    );
  };
  const handleCancelOrder = (orderId) => {
    toast.error("Cancelled Order", { position: "top-center" });
    mutate(orderId);
    onClose();
  };

  const handleCompleteOrder = () => {
    const payload = {
      items: items
        .map((item) => {
          const originalItem = data.items.find(
            (each) => each.product_id === item.product_id,
          );

          if (!originalItem) return null;

          if (originalItem.quantity !== item.quantity) {
            return {
              product_id: item.product_id,
              quantity: item.quantity,
            };
          }

          return null;
        })
        .filter(Boolean),
    };
    toast.success("Order completed succefully", { position: "top-center" });
    completeOrderFn({ orderId, payload });
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-6">
            Failed to load order details
          </div>
        )}

        {/* ✅ DATA */}
        {data && (
          <div className="space-y-4">
            {/* Order Info */}
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Name:</strong> {data.customer_name}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(data.created_at).toLocaleString()}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-4 border rounded-lg p-3"
                >
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="size-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.item_name}</p>

                    <div className="flex items-center mt-2">
                      {/* Qty text */}
                      <p className="text-sm text-muted-foreground">Qty:</p>
                      {/* Stepper */}
                      {data.status === "order_placed" ? (
                        <div className="flex items-center border rounded-md overflow-hidden ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleDecrease(item.product_id)}
                          >
                            -
                          </Button>

                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleIncrease(item.product_id)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <p>{item.quantity}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between border-t pt-4 font-medium">
              <span>Total</span>
              <span>${data.total_price}</span>
            </div>
          </div>
        )}
        {data && data.status === "order_placed" && (
          <DialogFooter>
            <DialogClose as child>
              <Button
                variant="outline"
                onClick={() => {
                  handleCancelOrder(orderId);
                }}
              >
                Cancel Order
              </Button>
            </DialogClose>
            <Button type="submit" onClick={() => handleCompleteOrder(orderId)}>
              Complete Order
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
