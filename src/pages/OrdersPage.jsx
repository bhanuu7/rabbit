import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import BottleSVG, { CATEGORY_FALLBACK } from "@/components/BottleSVG";
import { getOrdersOfUsers } from "@/api/getOrdersOfUser";
import { UserContext } from "@/context/UserContext";

const STATUS_MAP = {
  pending: {
    label: "Pending",
    classes:
      "bg-[rgba(234,179,8,0.12)] text-yellow-400 border-[rgba(234,179,8,0.3)]",
    dot: "bg-yellow-400",
  },
  order_placed: {
    label: "Order Confirmed",
    classes:
      "bg-[rgba(59,130,246,0.12)] text-blue-400 border-[rgba(59,130,246,0.3)]",
    dot: "bg-blue-400",
  },
  picked_up: {
    label: "Picked Up",
    classes:
      "bg-[rgba(34,197,94,0.12)] text-green-400 border-[rgba(34,197,94,0.3)]",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Cancelled",
    classes:
      "bg-[rgba(239,68,68,0.12)] text-red-400 border-[rgba(239,68,68,0.3)]",
    dot: "bg-red-400",
  },
};

const FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "order_placed", label: "Active" },
  { key: "picked_up", label: "Picked Up" },
  { key: "cancelled", label: "Cancelled" },
];

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    classes:
      "bg-[rgba(201,168,76,0.1)] text-gold border-[rgba(201,168,76,0.3)]",
    dot: "bg-gold",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const { label: statusLabel } = STATUS_MAP[order.status] ?? {
    label: order.status,
  };
  const isCancelled = order.status === "cancelled";

  return (
    <div className="bg-bg-card border border-[rgba(201,168,76,0.18)] rounded-xl overflow-hidden transition-all duration-[280ms] hover:border-[rgba(201,168,76,0.32)]">
      {/* Order header */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3.5 border-b border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.03)]">
        <div>
          <p className="text-[9px] uppercase tracking-[1.6px] text-[#555] mb-0.5">
            Order placed
          </p>
          <p className="text-[13px] text-[#3a424b]">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[1.6px] text-[#555] mb-0.5">
            Total
          </p>
          <p className="text-[13px] font-semibold text-gold font-serif-app">
            ${Number(order.total_amount).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[1.6px] text-[#555] mb-0.5">
            Order #
          </p>
          <p className="text-[13px] text-[#3a424b] font-mono tracking-wide">
            {order.order_id}
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-3">
        {(expanded ? order.items : order.items.slice(0, 2)).map((item, i) => {
          const fallback =
            CATEGORY_FALLBACK[item.category] ?? CATEGORY_FALLBACK.default;
          return (
            <div key={i} className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 border border-[rgba(45,51,58,0.12)] ${isCancelled ? "opacity-40 grayscale" : ""}`}
                style={{
                  background: `radial-gradient(circle at 40% 30%, ${fallback.color}18, #ece1cd)`,
                }}
              >
                <div className="w-8 h-10 overflow-hidden">
                  {/* <BottleSVG color={fallback.color} isBeer={fallback.isBeer} /> */}
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover transition-all duration-[400ms] ease block group-hover:scale-105 `}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13px] font-medium leading-tight truncate ${isCancelled ? "text-[#8a94a0] line-through" : "text-text-main"}`}
                >
                  {item.item_name}
                </p>
                <p className="text-[11px] text-[#666] mt-0.5">
                  {item.category} · Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`text-[13px] font-semibold ${isCancelled ? "text-[#444]" : "text-gold"} font-serif-app`}
                >
                  ${Number(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-[11px] text-[#555]">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}

        {order.items.length > 2 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-[12px] text-[#666] hover:text-gold transition-colors cursor-pointer bg-transparent border-none px-0 pt-1"
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {expanded
              ? "Show less"
              : `Show ${order.items.length - 2} more item${order.items.length - 2 > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-t border-[rgba(201,168,76,0.08)]">
        {!isCancelled && (
          <Button
            size="sm"
            className="bg-gradient-to-br from-gold to-[#a8461f] text-white border-none hover:from-[#d97a5c] hover:to-gold text-[12px] font-semibold h-8 px-4"
          >
            <Package className="w-3.5 h-3.5 mr-1.5" />
            {order.status === "picked_up" ? "View Receipt" : "Track Order"}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="border-[rgba(194,90,58,0.3)] text-[#6b7681] bg-transparent hover:text-gold hover:border-gold hover:bg-[rgba(209,112,79,0.1)] text-[12px] h-8 px-4"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reorder
        </Button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { username } = useContext(UserContext);
  const { data = [], isLoading } = getOrdersOfUsers(username);
  const orders = Array.isArray(data) ? data : data?.orders || [];

  const filteredOrders = orders.filter((o) => {
    const matchFilter = activeFilter === "all" || o.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans-app px-4 py-8 max-w-3xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[clamp(22px,3vw,30px)] font-bold text-white font-serif-app leading-tight">
          Your <em className="text-gold italic">Orders</em>
        </h1>
        <p className="text-[13px] text-[#555] mt-1">
          {orders.length} orders placed
        </p>
      </div>

      {/* Filter pills + Search */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-[220ms] cursor-pointer ${
                  activeFilter === key
                    ? "bg-gold text-white border-gold"
                    : "bg-transparent text-[#6b7681] border-[rgba(45,51,58,0.16)] hover:text-gold hover:border-[rgba(194,90,58,0.45)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto min-w-0 sm:min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none w-3.5 h-3.5" />
            <Input
              placeholder="Search by order or item…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.16)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px] pl-9 rounded-full placeholder:text-text-dim h-9"
            />
          </div>
        </div>
      )}

      {/* Order cards */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 text-center">
          <Package className="w-12 h-12 text-[#2a2a2a]" />
          <p className="text-[15px] font-semibold text-[#444] font-serif-app">
            No orders found
          </p>
          <p className="text-[13px] text-[#333]">
            Try a different filter or search term
          </p>
        </div>
      )}
    </div>
  );
}
