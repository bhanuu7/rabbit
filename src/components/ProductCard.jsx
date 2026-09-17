import { useState } from "react";
import { ShoppingCart, Bell } from "lucide-react";
import { useCart } from "@/context/CartContext";
import BottleSVG, { CATEGORY_FALLBACK } from "@/components/BottleSVG";

/** Downsample image URLs for low-bandwidth users.
 *  Replaces Unsplash w= param with 400px and drops quality to 60. */
function optimizeImageUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("unsplash.com")) {
      u.searchParams.set("w", "400");
      u.searchParams.set("q", "60");
      u.searchParams.set("fm", "webp");
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function ProductCard({ product, onNotifyMe }) {
  const isOutOfStock = product.stock_count === 0;
  const isLowStock = product.stock_count > 0 && product.stock_count <= 3;
  const { getProductCount, removeFromCart, addToCart } = useCart();
  const currentProductCount = getProductCount(product.id);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fallback = CATEGORY_FALLBACK[product.category] || CATEGORY_FALLBACK.default;
  const optimizedSrc = optimizeImageUrl(product.image_url);

  return (
    <div className="group bg-bg-card border border-[rgba(45,51,58,0.12)] rounded-xl overflow-hidden flex flex-col transition-all duration-[280ms] ease hover:border-[rgba(209,112,79,0.5)] hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(209,112,79,0.12)]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ece1cd]">
        {/* Shimmer skeleton shown until image loads */}
        {!imgError && product.image_url && !imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6eedf] via-[#ece1cd] to-[#f6eedf] bg-[length:200%_100%] animate-pp-shimmer" />
        )}
        {!imgError && product.image_url ? (
          <img
            src={optimizedSrc}
            alt={product.item_name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-[400ms] ease block group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f6eedf] to-[#ece1cd]">
            <BottleSVG
              color={fallback.color}
              label={product.category.toUpperCase()}
              isBeer={fallback.isBeer}
            />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[rgba(209,112,79,0.12)] border border-[rgba(209,112,79,0.35)] text-gold text-[10px] tracking-[1.2px] uppercase py-[3px] px-2.5 rounded-full font-[Helvetica_Neue,sans-serif]">{product.category}</span>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)] flex items-center justify-center">
            <span className="text-text-main text-xs font-semibold bg-[rgba(160,30,30,0.9)] border border-[rgba(220,60,60,0.5)] py-1.5 px-[18px] rounded-md tracking-[1px] uppercase">Out of Stock</span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-3 right-3 bg-[rgba(209,112,79,0.15)] border border-[rgba(209,112,79,0.5)] text-gold text-[10px] py-[3px] px-2.5 rounded-full font-[Helvetica_Neue,sans-serif]">Only {product.stock_count} left</span>
        )}
      </div>

      {/* Body */}
      <div className="px-3 pt-2.5 pb-1.5 flex-1 flex flex-col gap-1">
        <h3 className="text-[13px] font-semibold text-text-main font-serif-app leading-[1.3] line-clamp-2">{product.item_name}</h3>
        <p className="text-[11px] text-text-dim leading-[1.55] line-clamp-2">{product.description}</p>
        <div className="flex gap-[5px] text-[10px] text-[#8a94a0]">
          <span>{product.volume}</span>
          <span>·</span>
          <span>{product.alcoholContent} ABV</span>
        </div>
        <div className="text-lg font-bold text-gold font-serif-app leading-none mt-0.5">${product.price}</div>
      </div>

      {/* Footer CTA */}
      <div className="px-3 pt-2 pb-3">
        {isOutOfStock ? (
          <button
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold tracking-[0.3px] rounded-md cursor-pointer transition-all duration-[280ms] border border-[rgba(209,112,79,0.4)] bg-transparent text-gold font-[Helvetica_Neue,Segoe_UI,sans-serif] hover:bg-[rgba(209,112,79,0.1)] hover:border-gold"
            onClick={() => onNotifyMe?.(product)}
          >
            <Bell size={14} />
            Notify When Available
          </button>
        ) : currentProductCount === 0 ? (
          <button
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold tracking-[0.3px] rounded-md cursor-pointer transition-all duration-[280ms] border-none bg-gradient-to-br from-gold to-gold-dark text-white font-[Helvetica_Neue,Segoe_UI,sans-serif] hover:bg-gradient-to-br hover:from-gold-light hover:to-gold hover:shadow-[0_4px_16px_rgba(209,112,79,0.3)]"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={14} />
            Add To Cart
          </button>
        ) : (
          <div className="flex items-center justify-between border border-[rgba(209,112,79,0.3)] rounded-md overflow-hidden">
            <button className="bg-transparent border-none text-gold w-[34px] h-8 text-lg cursor-pointer transition-colors duration-200 flex items-center justify-center font-[Helvetica_Neue,sans-serif] leading-none hover:bg-[rgba(209,112,79,0.1)]" onClick={() => removeFromCart(product)}>−</button>
            <span className="text-sm font-semibold text-text-main min-w-[30px] text-center">{currentProductCount}</span>
            <button className="bg-transparent border-none text-gold w-[34px] h-8 text-lg cursor-pointer transition-colors duration-200 flex items-center justify-center font-[Helvetica_Neue,sans-serif] leading-none hover:bg-[rgba(209,112,79,0.1)]" onClick={() => addToCart(product)}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}
