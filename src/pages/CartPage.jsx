import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Trash2, ShoppingCart, Package } from "lucide-react";
import { reserveProduct } from "@/api/reserveProduct";
import BottleSVG, { CATEGORY_FALLBACK } from "@/components/BottleSVG";
import { UserContext } from "@/context/UserContext";

function CartItem({ item, addToCart, removeFromCart }) {
  const [imgError, setImgError] = useState(false);
  const fallback =
    CATEGORY_FALLBACK[item.product.category] || CATEGORY_FALLBACK.default;

  return (
    <div className="flex gap-4 py-5 px-6 transition-colors duration-200 not-last:border-b not-last:border-[rgba(45,51,58,0.1)] hover:bg-[rgba(45,51,58,0.03)]">
      {/* Thumbnail */}
      <div className="w-[88px] h-[88px] shrink-0 rounded-lg overflow-hidden border border-[rgba(45,51,58,0.12)] bg-[#ece1cd]">
        {!imgError && item.product.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.item_name}
            className="w-full h-full object-cover block"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f6eedf] to-[#ece1cd]">
            <BottleSVG
              color={fallback.color}
              label={item.product.category.toUpperCase()}
              isBeer={fallback.isBeer}
            />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-text-main font-serif-app leading-[1.3]">
              {item.product.item_name}
            </div>
            <div className="text-[11px] text-text-dim mt-[3px] text-left">
              {item.product.volume || "750 ml"} ·{" "}
              {item.product.alcoholContent || "40%"} ABV
            </div>
            <div className="text-[13px] font-semibold text-gold mt-1 font-serif-app text-left">
              ${item.product.price}
            </div>
          </div>
          <button
            className="bg-transparent border-none cursor-pointer text-[#444] p-1 rounded flex items-center justify-center transition-colors duration-200 shrink-0 hover:text-[#c0392b]"
            onClick={() => removeFromCart(item.product.id)}
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center border border-[rgba(201,168,76,0.3)] rounded-md overflow-hidden">
            <button
              className="bg-transparent border-none text-gold w-8 h-8 text-base cursor-pointer flex items-center justify-center transition-colors duration-200 font-[inherit] leading-none hover:bg-[rgba(201,168,76,0.1)]"
              onClick={() => removeFromCart(item.product)}
            >
              −
            </button>
            <span className="text-[13px] font-semibold text-text-main min-w-[36px] text-center">
              {item.quantity}
            </span>
            <button
              className="bg-transparent border-none text-gold w-8 h-8 text-base cursor-pointer flex items-center justify-center transition-colors duration-200 font-[inherit] leading-none hover:bg-[rgba(201,168,76,0.1)]"
              onClick={() => addToCart(item.product)}
            >
              +
            </button>
          </div>
          <span className="text-[15px] font-bold text-gold font-serif-app">
            ${item.product.price * item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = reserveProduct();
  const { username } = useContext(UserContext);
  const { cartProducts, addToCart, removeFromCart, clearCart, getCartTotal } =
    useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false); // TO DO
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = (e) => {
    e.preventDefault();
    const items = Object.values(cartProducts).map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.item_name,
    }));
    mutate({
      user_name: username,
      email: username + "@gmail.com",
      //phone: formData.phone,
      customer_name: username,
      total_price: total,
      items,
    });
    toast.success("Reservation confirmed!", {
      description: `We've sent a confirmation email to ${formData.email}. Please pick up within 48 hours.`,
      position: "top-center",
    });
    setFormData({ name: "", email: "", phone: "" });
    clearCart();
    setCheckoutOpen(false);
    navigate("/home");
  };

  /* ── Empty state ─────────────────────────────────────────── */
  if (!cartProducts || Object.keys(cartProducts).length === 0) {
    return (
      <div className="min-h-screen bg-bg-base text-text-main font-sans-app px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[380px] gap-3.5 text-center">
          <div className="w-[88px] h-[88px] rounded-full bg-[rgba(209,112,79,0.08)] border border-[rgba(45,51,58,0.14)] flex items-center justify-center text-[#8a94a0]">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-[22px] font-bold text-[#888] font-serif-app">
            Your cart is empty
          </h2>
          <p className="text-[13px] text-text-dim leading-[1.6] max-w-[280px]">
            Add some products to your cart to get started
          </p>
          <button
            className="inline-flex items-center justify-center gap-2 py-3 px-7 bg-gradient-to-br from-gold to-gold-dark text-white text-[13px] font-bold tracking-[0.8px] uppercase border-none rounded-md cursor-pointer transition-all duration-[280ms] font-[inherit] mt-1.5 hover:bg-gradient-to-br hover:from-gold-light hover:to-gold hover:shadow-[0_6px_20px_rgba(209,112,79,0.3)]"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ── Filled cart ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans-app px-4 py-8">
      {/* Page header */}
      <div className="mb-8 pb-6 border-b border-[rgba(201,168,76,0.15)] flex items-center gap-4">
        <button
          className="inline-flex items-center gap-[7px] bg-transparent border border-[rgba(201,168,76,0.3)] text-gold text-xs tracking-[0.6px] uppercase py-2 px-4 rounded-full cursor-pointer transition-all duration-[280ms] font-[inherit] hover:bg-[rgba(201,168,76,0.08)] hover:border-gold"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={13} />
          Back
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[4px] uppercase text-gold opacity-85 mb-1">
            Your Selection
          </p>
          <h1 className="text-[clamp(22px,3vw,32px)] font-bold text-white font-serif-app leading-[1.2]">
            Your <em className="text-gold italic">Cart</em>
          </h1>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1fr_minmax(300px,360px)] lg:items-start">
        {/* ── Cart items panel ── */}
        <div className="bg-bg-card border border-[rgba(201,168,76,0.18)] rounded-xl overflow-hidden">
          <div className="py-5 px-6 border-b border-[rgba(201,168,76,0.12)]">
            <h2 className="text-[15px] font-bold text-white font-serif-app tracking-[0.5px]">
              Cart Items
            </h2>
          </div>
          <div className="py-2">
            {Object.values(cartProducts).map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
        </div>

        {/* ── Order summary panel ── */}
        <div className="bg-bg-card border border-[rgba(201,168,76,0.18)] rounded-xl overflow-hidden sticky top-[88px]">
          <div className="py-5 px-6 border-b border-[rgba(201,168,76,0.12)]">
            <h2 className="text-[15px] font-bold text-white font-serif-app tracking-[0.5px]">
              Order Summary
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-3.5">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#666]">Subtotal</span>
              <span className="text-text-main">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#666]">Tax (8%)</span>
              <span className="text-text-main">${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-[rgba(201,168,76,0.12)] my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-text-main">
                Total
              </span>
              <span className="text-[26px] font-bold text-gold font-serif-app leading-none">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Pickup info */}
            <div className="flex gap-3 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] rounded-lg py-3.5 px-4">
              <Package size={18} className="text-gold shrink-0 mt-px" />
              <div>
                <div className="text-[13px] font-semibold text-text-main mb-1">
                  Store Pickup Only
                </div>
                <div className="text-xs text-[#666] leading-[1.65]">
                  Ready for pickup within 2 hours. Valid ID required (21+).
                </div>
              </div>
            </div>

            <button
              className="flex items-center justify-center w-full py-3.5 bg-gradient-to-br from-gold to-gold-dark text-white text-[13px] font-bold tracking-[1px] uppercase border-none rounded-md cursor-pointer transition-all duration-[280ms] font-[inherit] hover:bg-gradient-to-br hover:from-gold-light hover:to-gold hover:shadow-[0_6px_20px_rgba(209,112,79,0.3)]"
              onClick={() => setCheckoutOpen(true)}
            >
              Reserve for Pickup
            </button>
          </div>
        </div>
      </div>

      {/* ── Checkout dialog ── */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.75)] z-[9000] flex items-center justify-center p-6"
          onClick={() => setCheckoutOpen(false)}
        >
          <div
            className="bg-bg-card border border-[rgba(201,168,76,0.25)] rounded-[14px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto p-8 flex flex-col gap-[22px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-xl font-bold text-white font-serif-app">
                Complete Your Reservation
              </h2>
              <p className="text-[13px] text-[#666] mt-1 leading-[1.6]">
                Enter your details to reserve your items for pickup
              </p>
            </div>

            <form
              onSubmit={handleCheckout}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Mini order summary */}
              <div className="bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg p-4 flex flex-col gap-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#666]">Subtotal</span>
                  <span className="text-text-main">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#666]">Tax (8%)</span>
                  <span className="text-text-main">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-[rgba(201,168,76,0.12)]" />
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-text-main">Total</span>
                  <span className="text-gold font-serif-app">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] rounded-lg py-3 px-3.5 text-xs">
                <strong className="block text-text-main mb-1 text-[13px]">
                  Pickup Information
                </strong>
                <p className="text-[#666] leading-[1.6]">
                  Please bring a valid ID showing you are 21+ when picking up
                  your order within 48 hours.
                </p>
              </div>

              <div className="flex gap-3 justify-end flex-wrap">
                <button
                  type="button"
                  className="py-2.5 px-[22px] bg-transparent border border-[rgba(201,168,76,0.3)] text-gold text-[13px] font-semibold rounded-md cursor-pointer transition-all duration-[280ms] font-[inherit] hover:bg-[rgba(201,168,76,0.08)] hover:border-gold"
                  onClick={() => setCheckoutOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-gradient-to-br from-gold to-gold-dark text-white text-[13px] font-bold border-none rounded-md cursor-pointer transition-all duration-[280ms] font-[inherit] tracking-[0.4px] hover:bg-gradient-to-br hover:from-gold-light hover:to-gold hover:shadow-[0_4px_16px_rgba(209,112,79,0.3)] disabled:opacity-55 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? "Confirming…" : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
