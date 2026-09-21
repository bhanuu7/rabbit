import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Wine, Search, ChevronDown, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { reserveProduct } from "@/api/reserveProduct";
import WhiskeySpinner from "@/components/WhiskeySpinner";
import { useStore } from "@/context/StoreContext";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { toast } from "sonner";

const PAGE_SIZE = 12;
const BATCH_SIZE = 8;

// ── Fuzzy search: typo-tolerant matching ─────────────────────────
const normalize = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prevDiag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        prevDiag + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prevDiag = temp;
    }
  }
  return prev[b.length];
}

// Returns true if every query token loosely matches the haystack (allows typos).
function fuzzyMatch(query, haystack) {
  const q = normalize(query);
  if (!q) return true;
  const t = normalize(haystack);
  if (t.includes(q)) return true;
  const tTokens = t.split(" ");
  return q.split(" ").every((qt) => {
    if (t.includes(qt)) return true;
    return tTokens.some((tt) => {
      if (tt.includes(qt) || qt.includes(tt)) return true;
      const tol = Math.max(
        1,
        Math.floor(Math.max(qt.length, tt.length) * 0.34),
      );
      return levenshtein(qt, tt) <= tol;
    });
  });
}

const ProductsPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") ?? "",
  );
  const { mutate, isPending } = reserveProduct();
  const [categoryFilter, setCategoryFilter] = useState(
    () => searchParams.get("category") ?? "all",
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const sentinelRef = useRef(null);
  const { products, isLoading } = useStore();
  const { email } = useContext(UserContext);

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const cat = searchParams.get("category") ?? "all";
    setCategoryFilter(cat);
  }, [searchParams]);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null) setSearchQuery(s);
  }, [searchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProducts = products.filter((product) => {
    const haystack = `${product.item_name} ${product.category ?? ""} ${
      product.origin ?? ""
    }`;
    const matchesSearch = fuzzyMatch(searchQuery, haystack);
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => c + BATCH_SIZE);
      setLoadingMore(false);
    }, 700);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleNotifyMe = async (product) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/notify-request`, {
      product_id: product.id,
      email,
    });
    toast.success("Notify Request Sent Successfully", {
      position: "top-center",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <WhiskeySpinner size={100} label="Loading products…" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col px-4 py-8">
      {/* Page header */}
      <div
        className={`mb-7 pb-6 border-b border-[rgba(201,168,76,0.15)] max-h-[200px] overflow-hidden transition-all duration-[400ms] ${scrolled ? "max-h-0 opacity-0 !mb-0 !pb-0" : ""}`}
      >
        <p className="text-[10px] tracking-[4px] uppercase text-gold opacity-85 mb-1.5">
          Curated Collection
        </p>
        <h1 className="text-[clamp(22px,3vw,34px)] font-bold text-white font-serif-app leading-[1.2]">
          Our <em className="text-gold italic">Products</em>
        </h1>
      </div>

      {/* Search and Filter */}
      <div
        className={`flex items-center gap-3.5 mb-6 flex-wrap sticky top-16 z-[9] transition-all duration-300 ${scrolled ? "bg-[rgba(243,235,218,0.95)] backdrop-blur-[18px] shadow-[0_4px_24px_rgba(45,51,58,0.12)] border-b border-[rgba(45,51,58,0.12)] py-2.5 px-4 -mx-4 !mb-5" : ""}`}
      >
        <div className="relative flex-1 min-w-[200px] flex items-center">
          <Search className="absolute left-3.5 text-gold pointer-events-none shrink-0 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(45,51,58,0.04)] border border-[rgba(45,51,58,0.16)] rounded-full py-2.5 pr-[18px] pl-[42px] text-[13px] text-text-main font-sans-app outline-none transition-all duration-[280ms] placeholder:text-text-dim focus:border-gold focus:bg-[rgba(45,51,58,0.06)]"
          />
        </div>
        <div className="relative min-w-[175px]" ref={dropdownRef}>
          <button
            type="button"
            className={`flex items-center justify-between gap-2.5 w-full bg-[rgba(45,51,58,0.04)] border border-[rgba(45,51,58,0.16)] rounded-full py-2.5 pl-5 pr-4 text-[13px] text-text-main font-sans-app cursor-pointer outline-none transition-all duration-[280ms] whitespace-nowrap hover:border-[rgba(194,90,58,0.55)] hover:bg-[rgba(45,51,58,0.06)] ${dropdownOpen ? "border-[rgba(194,90,58,0.55)] bg-[rgba(45,51,58,0.06)]" : ""}`}
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <span>
              {categoryFilter === "all" ? "All Categories" : categoryFilter}
            </span>
            <ChevronDown
              className={`text-gold shrink-0 transition-transform duration-[220ms] ${dropdownOpen ? "rotate-180" : ""}`}
              size={14}
            />
          </button>

          {dropdownOpen && (
            <ul className="absolute top-[calc(100%+6px)] right-0 min-w-full bg-bg-card2 border border-[rgba(45,51,58,0.16)] rounded-[14px] p-1.5 list-none m-0 z-[100] shadow-[0_12px_40px_rgba(45,51,58,0.2)] animate-pp-dd-in">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    className={`block w-full text-left bg-transparent border-none rounded-lg py-[9px] px-3.5 text-[13px] text-[#3a424b] font-sans-app cursor-pointer transition-all duration-[180ms] whitespace-nowrap hover:bg-[rgba(209,112,79,0.12)] hover:text-gold-light ${categoryFilter === category ? "bg-[rgba(209,112,79,0.18)] text-gold font-semibold" : ""}`}
                    onClick={() => {
                      setCategoryFilter(category);
                      setDropdownOpen(false);
                    }}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="inline-flex items-center gap-[7px] ml-auto py-2.5 px-5 bg-gradient-to-br from-gold to-gold-dark text-bg-base border-none rounded-full text-[13px] font-bold tracking-[0.04em] cursor-pointer whitespace-nowrap transition-all duration-[250ms] font-sans-app shrink-0 hover:bg-gradient-to-br hover:from-gold-light hover:to-gold hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)] hover:-translate-y-px active:translate-y-0 active:shadow-none"
          onClick={() => navigate("/cart")}
        >
          <ShoppingBag size={15} />
          Proceed to Reserve
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 min-[1100px]:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNotifyMe={handleNotifyMe}
              />
            ))}
            {loadingMore && (
              <div className="col-span-full flex justify-center py-8">
                <WhiskeySpinner size={64} label="Loading more…" />
              </div>
            )}
          </div>
          {hasMore && <div ref={sentinelRef} className="h-10 w-full" />}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-3.5">
          <Wine className="text-[#333]" size={56} />
          <h3 className="text-xl font-semibold text-[#777] font-serif-app">
            No products found
          </h3>
          <p className="text-[13px] text-text-dim leading-[1.6]">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
