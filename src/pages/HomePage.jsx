import "./HomePage.css";
import { useState } from "react";
import { Wine, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/api/getProducts";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { reserveProduct } from "@/api/reserveProduct";
import { useInventorySocket } from "@/hooks/useInventerySocket";
import { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottleSVG, { CATEGORY_FALLBACK } from "@/components/BottleSVG";
import siteLogo from "@/assets/Site_Logo.png";
import { products as REAL_PRODUCTS } from "@/utils";

/* ================================================================
   SVG GLASS COMPONENTS
   ================================================================ */

const G = "#c25a3a";
const GL = "#d97a5c";

function WineGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M14 10 Q14 72 40 88 Q66 72 66 10 Z"
        fill={c}
        fillOpacity="0.12"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 44 Q19 72 40 85 Q61 72 61 44 Z"
        fill={c}
        fillOpacity="0.32"
      />
      <line x1="40" y1="88" x2="40" y2="140" stroke={c} strokeWidth="2.5" />
      <ellipse
        cx="40"
        cy="143"
        rx="20"
        ry="5"
        fill="none"
        stroke={c}
        strokeWidth="2.5"
      />
    </svg>
  );
}

function WhiskeyGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M14 55 L19 135 L61 135 L66 55 Z"
        fill={c}
        fillOpacity="0.12"
        stroke={c}
        strokeWidth="2"
      />
      <path d="M17 90 L19 135 L61 135 L63 90 Z" fill={c} fillOpacity="0.4" />
      <rect
        x="27"
        y="98"
        width="13"
        height="13"
        rx="2"
        fill="white"
        fillOpacity="0.25"
        stroke={c}
        strokeWidth="1"
      />
      <rect
        x="45"
        y="103"
        width="11"
        height="11"
        rx="2"
        fill="white"
        fillOpacity="0.2"
        stroke={c}
        strokeWidth="1"
      />
      <line x1="14" y1="55" x2="66" y2="55" stroke={c} strokeWidth="2.5" />
      <rect
        x="17"
        y="135"
        width="46"
        height="6"
        rx="3"
        fill={c}
        fillOpacity="0.45"
        stroke={c}
        strokeWidth="1"
      />
      <line
        x1="22"
        y1="65"
        x2="22"
        y2="130"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.15"
      />
    </svg>
  );
}

function BeerGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M14 38 L17 138 L59 138 L63 38 Z"
        fill={c}
        fillOpacity="0.12"
        stroke={c}
        strokeWidth="2"
      />
      <path d="M16 68 L17 138 L59 138 L62 68 Z" fill={c} fillOpacity="0.45" />
      <ellipse cx="38" cy="68" rx="23" ry="8" fill="white" fillOpacity="0.65" />
      <ellipse cx="28" cy="64" rx="9" ry="6" fill="white" fillOpacity="0.85" />
      <ellipse cx="49" cy="63" rx="8" ry="5" fill="white" fillOpacity="0.85" />
      <path
        d="M63 55 Q88 55 88 88 Q88 122 63 122"
        fill="none"
        stroke={c}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="98" r="2" fill={c} fillOpacity="0.5" />
      <circle cx="45" cy="112" r="2" fill={c} fillOpacity="0.5" />
      <circle cx="34" cy="122" r="1.5" fill={c} fillOpacity="0.5" />
    </svg>
  );
}

function RumGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <rect
        x="18"
        y="20"
        width="44"
        height="118"
        rx="4"
        fill={c}
        fillOpacity="0.1"
        stroke={c}
        strokeWidth="2"
      />
      <rect x="18" y="78" width="44" height="60" fill={c} fillOpacity="0.4" />
      <rect
        x="23"
        y="84"
        width="13"
        height="13"
        rx="2"
        fill="white"
        fillOpacity="0.25"
        stroke={c}
        strokeWidth="1"
      />
      <rect
        x="44"
        y="90"
        width="11"
        height="11"
        rx="2"
        fill="white"
        fillOpacity="0.2"
        stroke={c}
        strokeWidth="1"
      />
      <line
        x1="54"
        y1="18"
        x2="50"
        y2="138"
        stroke={c}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx="27"
        cy="24"
        r="9"
        fill="#4a7a00"
        fillOpacity="0.75"
        stroke={c}
        strokeWidth="1"
      />
    </svg>
  );
}

function VodkaGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M24 72 L27 138 L53 138 L56 72 Z"
        fill={c}
        fillOpacity="0.1"
        stroke={c}
        strokeWidth="2"
      />
      <path d="M25 102 L27 138 L53 138 L55 102 Z" fill={c} fillOpacity="0.5" />
      <line x1="24" y1="72" x2="56" y2="72" stroke={c} strokeWidth="2.5" />
      <rect
        x="25"
        y="138"
        width="30"
        height="6"
        rx="3"
        fill={c}
        fillOpacity="0.45"
      />
      <line
        x1="30"
        y1="78"
        x2="30"
        y2="132"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
    </svg>
  );
}

function TequilaGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path d="M4 48 L40 92 L76 48" fill="none" stroke={c} strokeWidth="2.5" />
      <path
        d="M4 48 Q40 56 76 48 Q62 82 40 92 Q18 82 4 48 Z"
        fill={c}
        fillOpacity="0.12"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M11 68 Q40 76 69 68 Q58 84 40 89 Q22 84 11 68 Z"
        fill={c}
        fillOpacity="0.42"
      />
      <line x1="40" y1="92" x2="40" y2="134" stroke={c} strokeWidth="2.5" />
      <ellipse
        cx="40"
        cy="137"
        rx="19"
        ry="5"
        fill="none"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M4 48 L76 48"
        stroke="white"
        strokeWidth="3"
        strokeOpacity="0.35"
        strokeDasharray="5,4"
      />
      <path
        d="M60 43 Q70 33 78 40 Q73 50 62 49 Z"
        fill="#4a7a00"
        fillOpacity="0.8"
      />
    </svg>
  );
}

function ChampagneGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M27 12 L24 94 L56 94 L53 12 Z"
        fill={c}
        fillOpacity="0.12"
        stroke={c}
        strokeWidth="2"
      />
      <path d="M26 46 L24 94 L56 94 L54 46 Z" fill={c} fillOpacity="0.38" />
      <circle cx="37" cy="84" r="1.5" fill={c} fillOpacity="0.9" />
      <circle cx="43" cy="74" r="1.5" fill={c} fillOpacity="0.9" />
      <circle cx="35" cy="62" r="1.5" fill={c} fillOpacity="0.9" />
      <circle cx="45" cy="52" r="1" fill={c} fillOpacity="0.9" />
      <circle cx="39" cy="56" r="1" fill={c} fillOpacity="0.9" />
      <line x1="40" y1="94" x2="40" y2="142" stroke={c} strokeWidth="2" />
      <ellipse
        cx="40"
        cy="145"
        rx="19"
        ry="4.5"
        fill="none"
        stroke={c}
        strokeWidth="2"
      />
      <line x1="27" y1="12" x2="53" y2="12" stroke={c} strokeWidth="2" />
    </svg>
  );
}

function GinGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M18 18 Q4 50 8 82 Q14 114 40 118 Q66 114 72 82 Q76 50 62 18 Z"
        fill={c}
        fillOpacity="0.1"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M11 78 Q14 110 40 116 Q66 110 69 78 Q52 86 40 86 Q28 86 11 78 Z"
        fill={c}
        fillOpacity="0.38"
      />
      <line x1="40" y1="118" x2="40" y2="144" stroke={c} strokeWidth="2.5" />
      <ellipse
        cx="40"
        cy="147"
        rx="19"
        ry="4.5"
        fill="none"
        stroke={c}
        strokeWidth="2"
      />
      <circle cx="57" cy="28" r="7" fill="#4a7a00" fillOpacity="0.7" />
      <circle cx="24" cy="26" r="6" fill="#4a7a00" fillOpacity="0.7" />
    </svg>
  );
}

function CognacGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M28 12 Q8 18 8 56 Q8 94 40 100 Q72 94 72 56 Q72 18 52 12 Z"
        fill={c}
        fillOpacity="0.1"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M11 66 Q14 92 40 98 Q66 92 69 66 Q55 74 40 74 Q25 74 11 66 Z"
        fill={c}
        fillOpacity="0.48"
      />
      <path
        d="M28 12 Q35 8 40 8 Q45 8 52 12"
        stroke={c}
        strokeWidth="2"
        fill="none"
      />
      <line x1="40" y1="100" x2="40" y2="136" stroke={c} strokeWidth="2.5" />
      <ellipse
        cx="40"
        cy="139"
        rx="23"
        ry="6"
        fill="none"
        stroke={c}
        strokeWidth="2.5"
      />
    </svg>
  );
}

function ScotchGlass({ active }) {
  const c = active ? GL : G;
  return (
    <svg
      viewBox="0 0 80 170"
      xmlns="http://www.w3.org/2000/svg"
      className="glass-svg"
    >
      <path
        d="M23 26 Q12 52 16 86 Q20 114 40 118 Q60 114 64 86 Q68 52 57 26 Z"
        fill={c}
        fillOpacity="0.1"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M32 118 L30 138 L50 138 L48 118 Z"
        fill={c}
        fillOpacity="0.18"
        stroke={c}
        strokeWidth="1.5"
      />
      <ellipse
        cx="40"
        cy="141"
        rx="17"
        ry="5.5"
        fill={c}
        fillOpacity="0.38"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M20 82 Q22 110 40 116 Q58 110 60 82 Q52 90 40 90 Q28 90 20 82 Z"
        fill={c}
        fillOpacity="0.52"
      />
      <path
        d="M23 26 Q34 22 40 22 Q46 22 57 26"
        stroke={c}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

/* ================================================================
   RABBIT LOGO
   ================================================================ */

function RabbitLogo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rabbit Liquor logo"
    >
      <ellipse cx="20" cy="17" rx="6.5" ry="14" fill="#c9a84c" />
      <ellipse cx="20" cy="17" rx="3.8" ry="10" fill="#7a5c10" />
      <ellipse cx="44" cy="15" rx="6.5" ry="14" fill="#c9a84c" />
      <ellipse cx="44" cy="15" rx="3.8" ry="10" fill="#7a5c10" />
      <circle cx="32" cy="40" r="19" fill="#c9a84c" />
      <circle cx="24.5" cy="36" r="3.8" fill="#1a1a1a" />
      <circle cx="39.5" cy="36" r="3.8" fill="#1a1a1a" />
      <circle cx="25.5" cy="34.5" r="1.6" fill="white" />
      <circle cx="40.5" cy="34.5" r="1.6" fill="white" />
      <ellipse cx="32" cy="44" rx="3.2" ry="2.2" fill="#ffaaaa" />
      <path
        d="M28.5 46.5 Q32 50 35.5 46.5"
        stroke="#cc8888"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="43"
        x2="23"
        y2="44"
        stroke="#7a5c10"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <line
        x1="11"
        y1="46.5"
        x2="23"
        y2="45.5"
        stroke="#7a5c10"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <line
        x1="41"
        y1="44"
        x2="53"
        y2="43"
        stroke="#7a5c10"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <line
        x1="41"
        y1="45.5"
        x2="53"
        y2="46.5"
        stroke="#7a5c10"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

/* ================================================================
   DATA
   ================================================================ */

const CATEGORIES = [
  {
    name: "Wine",
    Glass: WineGlass,
    accent: "#c0364a",
    bg: "rgba(192,54,74,0.18)",
    desc: "Reds, whites & rosés",
    count: "120+",
  },
  {
    name: "Whiskey",
    Glass: WhiskeyGlass,
    accent: "#c9a84c",
    bg: "rgba(201,168,76,0.2)",
    desc: "Single malt & blended",
    count: "90+",
  },
  {
    name: "Beer",
    Glass: BeerGlass,
    accent: "#f5a623",
    bg: "rgba(245,166,35,0.2)",
    desc: "Craft & premium ales",
    count: "60+",
  },
  {
    name: "Rum",
    Glass: RumGlass,
    accent: "#b85c2a",
    bg: "rgba(184,92,42,0.2)",
    desc: "Dark, white & spiced",
    count: "45+",
  },
  {
    name: "Vodka",
    Glass: VodkaGlass,
    accent: "#8ab8d8",
    bg: "rgba(138,184,216,0.28)",
    desc: "Premium & flavoured",
    count: "50+",
  },
  {
    name: "Tequila",
    Glass: TequilaGlass,
    accent: "#7ec850",
    bg: "rgba(126,200,80,0.22)",
    desc: "Blanco, reposado & añejo",
    count: "35+",
  },
  {
    name: "Champagne",
    Glass: ChampagneGlass,
    accent: "#d4b84a",
    bg: "rgba(212,184,74,0.22)",
    desc: "Brut, rosé & vintage",
    count: "28+",
  },
  {
    name: "Gin",
    Glass: GinGlass,
    accent: "#5ca8c8",
    bg: "rgba(92,168,200,0.26)",
    desc: "London dry & botanical",
    count: "55+",
  },
  {
    name: "Cognac",
    Glass: CognacGlass,
    accent: "#c47022",
    bg: "rgba(196,112,34,0.2)",
    desc: "VS, VSOP & XO",
    count: "30+",
  },
  {
    name: "Scotch",
    Glass: ScotchGlass,
    accent: "#c8a87c",
    bg: "rgba(200,168,124,0.24)",
    desc: "Highland, Speyside & Islay",
    count: "70+",
  },
];

/* PRODUCTS constant removed — TrendingSection uses REAL_PRODUCTS from @/utils */

const REVIEWS = [
  {
    id: 1,
    name: "Alexander M.",
    rating: 5,
    avatar: "A",
    text: "Rabbit Liquor's Reserve collection is simply unparalleled. The curation and quality speak of deep expertise and passion. Every bottle is a masterpiece.",
  },
  {
    id: 2,
    name: "Sophie L.",
    rating: 5,
    avatar: "S",
    text: "From the moment I discovered Rabbit Liquor, my appreciation for fine spirits has grown tenfold. Their whiskey selection is extraordinary.",
  },
  {
    id: 3,
    name: "James R.",
    rating: 5,
    avatar: "J",
    text: "The most refined liquor experience I've encountered. The dark aesthetic and product quality perfectly reflect the brand's premium positioning.",
  },
  {
    id: 4,
    name: "Priya K.",
    rating: 5,
    avatar: "P",
    text: "The champagne I ordered for my anniversary was perfect — elegant, celebratory, and worth every penny. Rabbit Liquor never disappoints.",
  },
];

/* ================================================================
   HERO SECTION
   ================================================================ */

function HeroSection() {
  const navigate = useNavigate();
  const scrollToRange = () =>
    document.getElementById("range")?.scrollIntoView({ behavior: "smooth" });
  const scrollToTrending = () =>
    document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="rl-hero" id="home">
      <div className="rl-hero__content">
        <h1 className="rl-hero__title">
          The Finest
          <br />
          <em className="rl-gold">Spirits, Available.</em>
        </h1>
        <p className="rl-hero__desc">
          Reserve the Rare scotches, aged cognacs, premier wines — curated by
          experts and collect from store.
        </p>
        <div className="rl-hero__actions">
          <button
            className="rl-btn rl-btn--gold rl-btn--lg"
            onClick={() => navigate("/products")}
          >
            Reserve now
          </button>
          <button
            className="rl-btn rl-btn--outline rl-btn--lg"
            onClick={scrollToRange}
          >
            Browse Categories
          </button>
        </div>
        <div className="rl-hero__stats">
          <div className="rl-stat">
            <span className="rl-stat__num">500+</span>
            <span className="rl-stat__label">Premium Labels</span>
          </div>
          <div className="rl-stat__divider" />
          <div className="rl-stat">
            <span className="rl-stat__num">20+</span>
            <span className="rl-stat__label">Countries Sourced</span>
          </div>
          <div className="rl-stat__divider" />
          <div className="rl-stat">
            <span className="rl-stat__num">15K+</span>
            <span className="rl-stat__label">Happy Customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   STORY PAGE
   ================================================================ */

function StoryPage() {
  return (
    <div className="min-h-[80vh]">
      <div className="py-[88px] px-16 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,#1c1300_0%,#080808_70%)] border-b border-[rgba(201,168,76,0.18)] text-center relative max-lg:py-[60px] max-lg:px-8 max-[480px]:py-9 max-[480px]:px-[18px] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:opacity-40">
        <div className="max-w-[720px] mx-auto">
          <p className="text-gold text-[10px] tracking-[4px] uppercase mb-3 opacity-85">
            OUR STORY
          </p>
          <h1 className="text-[clamp(30px,4vw,52px)] font-serif-app font-bold text-white leading-[1.15] mt-3.5 mb-[18px]">
            More Than a Store.
            <br />
            <span className="text-gold italic">A Destination.</span>
          </h1>
          <p className="text-[15px] text-[#888] leading-[1.85] max-w-[560px] mx-auto">
            Founded in pursuit of perfection — Rabbit Liquor brings the world's
            rarest spirits to those who truly appreciate them.
          </p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto py-[72px] px-8 pb-24 flex flex-col gap-12 max-lg:py-12 max-lg:px-6 max-lg:pb-[72px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[clamp(20px,2.5vw,28px)] font-serif-app font-bold text-gold mb-1">
            The Beginning
          </h2>
          <p className="text-[15px] text-[#888] leading-[1.9]">
            Founded in the rolling vineyards of Napa Valley, Rabbit Liquor began
            as a passionate pursuit of perfection. We believe every occasion
            deserves a spirit that matches its significance — whether that's a
            whisky aged fifteen years in charred oak, a champagne harvested from
            a single exceptional vintage, or a gin distilled with rare
            botanicals.
          </p>
          <p className="text-[15px] text-[#888] leading-[1.9]">
            Our sommeliers and spirit masters travel the world to source bottles
            that represent the pinnacle of their craft. We partner only with
            producers who share our obsession with quality, provenance, and the
            art of patience.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[clamp(20px,2.5vw,28px)] font-serif-app font-bold text-gold mb-1">
            Our Philosophy
          </h2>
          <p className="text-[15px] text-[#888] leading-[1.9]">
            Every bottle on our shelves has earned its place. We taste blind,
            judge on merit, and champion the underdog as readily as the legend.
            From a single-village mezcal to a century-old cognac, if it moves us
            — it moves to our collection.
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:gap-4"
          style={{ marginTop: "0" }}
        >
          {[
            {
              icon: "🏆",
              title: "Award-Winning Curation",
              desc: "Handpicked by certified sommeliers and master distillers.",
            },
            {
              icon: "🌍",
              title: "Global Sourcing",
              desc: "Labels from over 20 countries, representing the finest terroirs.",
            },
            {
              icon: "📦",
              title: "White-Glove Delivery",
              desc: "Temperature-controlled, discreet, and always on time.",
            },
            {
              icon: "🔒",
              title: "Secure & Verified",
              desc: "Every bottle authenticated and sealed. No compromises.",
            },
            {
              icon: "🍃",
              title: "Sustainable Sourcing",
              desc: "Partnering with producers who respect the land they work.",
            },
            {
              icon: "🎁",
              title: "Gift Concierge",
              desc: "Bespoke gifting packages curated for every occasion.",
            },
          ].map((p) => (
            <div
              className="bg-bg-card border border-[rgba(201,168,76,0.18)] rounded-[10px] py-8 px-6 text-center transition-all duration-[280ms] hover:border-[rgba(201,168,76,0.5)] hover:-translate-y-1"
              key={p.title}
            >
              <span className="text-[30px] block mb-3.5">{p.icon}</span>
              <h3 className="text-[15px] font-semibold text-white font-serif-app mb-2">
                {p.title}
              </h3>
              <p className="text-[13px] text-[#888] leading-[1.7]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   OUR RANGE — Single-row carousel with chevrons
   ================================================================ */

function RangeSection() {
  const [active, setActive] = useState(null);
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const navigate = useNavigate();

  const scrollBy = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 210, behavior: "smooth" });

  const onScroll = () => {
    if (!scrollRef.current) return;
    const {
      scrollLeft: sl,
      scrollWidth: sw,
      clientWidth: cw,
    } = scrollRef.current;
    setCanLeft(sl > 2);
    setCanRight(sl < sw - cw - 2);
  };

  return (
    <section
      className="py-[88px] pb-20 bg-[linear-gradient(180deg,#f3ebda_0%,#ece1cd_60%,#f3ebda_100%)] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[70%] before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d1704f] before:to-transparent before:opacity-50"
      id="range"
    >
      <div className="text-center mb-[52px] px-6">
        <p className="text-[#c25a3a] text-[10px] tracking-[4px] uppercase mb-3 opacity-85">
          DISCOVER
        </p>
        <h2 className="text-[clamp(26px,3.5vw,44px)] font-bold text-[#2d333a] font-serif-app mb-2.5">
          Our <span className="text-[#c25a3a] italic">Range</span>
        </h2>
        <p className="text-sm text-[#8a94a0]">
          Ten magnificent categories — scroll to explore
        </p>
      </div>

      <div className="relative px-[68px] max-lg:px-14 max-md:px-[46px] max-[480px]:px-[38px]">
        <button
          className={`absolute top-1/2 left-[10px] -translate-y-[55%] z-10 bg-[rgba(251,245,234,0.92)] border border-[rgba(194,90,58,0.35)] text-[#c25a3a] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-[280ms] hover:bg-[rgba(209,112,79,0.1)] hover:border-[#d1704f] hover:shadow-[0_0_18px_rgba(209,112,79,0.22)] ${!canLeft ? "opacity-0 pointer-events-none" : ""}`}
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-4 px-1 pb-9 -webkit-overflow-scrolling-touch max-md:gap-3"
          ref={scrollRef}
          onScroll={onScroll}
        >
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              className={`group flex-[0_0_178px] relative flex flex-col items-center gap-2.5 py-7 px-4 bg-[#fbf5ea] border border-[rgba(45,51,58,0.12)] rounded-[18px] cursor-pointer overflow-hidden transition-all duration-[320ms] font-sans-app text-center hover:border-[var(--cat-accent,#d1704f)] hover:shadow-[0_0_28px_-4px_var(--cat-glow,rgba(209,112,79,0.25))] hover:-translate-y-1.5 hover:bg-[#f6eedf] max-md:flex-[0_0_155px] max-md:py-5 max-md:px-2.5 max-md:rounded-[14px] max-[480px]:flex-[0_0_140px] max-[480px]:py-4 max-[480px]:px-2 ${active === i ? "border-[var(--cat-accent,#d1704f)] shadow-[0_0_40px_-4px_var(--cat-glow,rgba(209,112,79,0.3))] -translate-y-1.5 bg-[#f6eedf]" : ""}`}
              style={{
                "--cat-accent": cat.accent,
                "--cat-bg": cat.bg,
                "--cat-glow": cat.accent + "33",
              }}
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(cat.name)}`)
              }
              aria-pressed={active === i}
            >
              <div className="absolute top-0 -left-3/4 w-1/2 h-full bg-[linear-gradient(105deg,transparent_40%,rgba(45,51,58,0.05)_50%,transparent_60%)] transition-[left] duration-[550ms] pointer-events-none group-hover:left-[135%]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,var(--cat-bg,rgba(30,20,0,0.5))_0%,transparent_70%)] opacity-0 transition-opacity duration-[350ms] pointer-events-none group-hover:opacity-100" />
              <div className="w-16 h-[108px] relative z-[1] shrink-0 max-md:w-[52px] max-md:h-[88px] max-[480px]:w-[42px] max-[480px]:h-[72px]">
                <cat.Glass active={active === i} />
              </div>
              <span className="absolute top-3 right-3 text-[9px] text-[var(--cat-accent,#d1704f)] bg-[rgba(251,245,234,0.85)] border border-[var(--cat-accent,#d1704f)] rounded-full py-0.5 px-2 tracking-[0.5px] z-[2] opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {cat.count}
              </span>
              <span className="text-[13px] font-bold text-[#2d333a] tracking-[1.4px] uppercase z-[1] transition-colors duration-300 group-hover:text-[var(--cat-accent,#d1704f)]">
                {cat.name}
              </span>
              <span className="text-[10px] text-[#8a94a0] leading-[1.45] z-[1] opacity-0 translate-y-1 transition-all duration-300 delay-[50ms] group-hover:opacity-100 group-hover:translate-y-0">
                {cat.desc}
              </span>
              {active === i && (
                <span className="inline-flex items-center gap-[5px] text-[10px] text-[var(--cat-accent,#d1704f)] tracking-[0.8px] uppercase z-[1] animate-rl-fadein">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="12"
                    height="12"
                    aria-hidden="true"
                  >
                    <line x1="0" y1="8" x2="12" y2="8" />
                    <polyline points="7,3 12,8 7,13" />
                  </svg>
                  Shop {cat.name}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          className={`absolute top-1/2 right-[10px] -translate-y-[55%] z-10 bg-[rgba(251,245,234,0.92)] border border-[rgba(194,90,58,0.35)] text-[#c25a3a] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-[280ms] hover:bg-[rgba(209,112,79,0.1)] hover:border-[#d1704f] hover:shadow-[0_0_18px_rgba(209,112,79,0.22)] ${!canRight ? "opacity-0 pointer-events-none" : ""}`}
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ================================================================
   TRENDING PRODUCTS
   ================================================================ */

function TrendingCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const fallback =
    CATEGORY_FALLBACK[product.category] || CATEGORY_FALLBACK.default;
  const { addToCart, removeFromCart, getProductCount } = useCart() || {};
  const count = getProductCount ? getProductCount(product.id) : 0;

  return (
    <div className="group flex-[0_0_215px] bg-[#fbf5ea] border border-[rgba(45,51,58,0.12)] rounded-xl overflow-hidden transition-all duration-[280ms] cursor-pointer hover:border-[rgba(209,112,79,0.5)] hover:-translate-y-2 hover:shadow-[0_18px_44px_rgba(209,112,79,0.12)] max-[480px]:flex-[0_0_180px]">
      <div className="relative h-[210px] bg-gradient-to-br from-[#f6eedf] to-[#ece1cd] flex items-center justify-center">
        <span className="absolute top-3 left-3 bg-[rgba(209,112,79,0.12)] border border-[rgba(209,112,79,0.3)] text-[#c25a3a] text-[9px] tracking-[1.5px] py-[3px] px-2.5 rounded-full uppercase">
          {product.category}
        </span>
        {!imgError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.item_name}
            className="w-full h-full object-cover block"
            onError={() => setImgError(true)}
          />
        ) : (
          <BottleSVG
            color={fallback.color}
            label={product.category.toUpperCase()}
            isBeer={fallback.isBeer}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#2d333a] font-serif-app leading-[1.3] mb-[5px]">
          {product.item_name}
        </h3>
        <p className="text-[11px] text-[#8a94a0] mb-[9px]">
          {product.origin} · {product.category}
        </p>
        <div className="text-[#c25a3a] text-xs flex items-center gap-[5px] mb-[13px]">
          {"★★★★★"}
          <span className="text-[11px] text-[#6b7681]">
            {product.rating || 4.8}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[19px] font-bold text-[#c25a3a] font-serif-app">
            ${Number(product.price).toFixed(2)}
          </span>
          {count === 0 ? (
            <button
              className="bg-transparent border border-[#d1704f] text-[#c25a3a] py-[5px] px-3 rounded-md text-[11px] cursor-pointer transition-colors duration-[280ms] font-sans-app hover:bg-[rgba(209,112,79,0.12)]"
              onClick={() => addToCart?.(product)}
            >
              + Add
            </button>
          ) : (
            <div className="flex items-center gap-1 border border-[rgba(209,112,79,0.4)] rounded-md overflow-hidden">
              <button
                className="bg-transparent border-none text-[#c25a3a] w-[26px] h-[26px] text-[15px] cursor-pointer flex items-center justify-center transition-colors duration-[280ms] font-sans-app hover:bg-[rgba(209,112,79,0.12)]"
                onClick={() => removeFromCart?.(product)}
              >
                −
              </button>
              <span className="min-w-[20px] text-center text-xs font-semibold text-[#c25a3a]">
                {count}
              </span>
              <button
                className="bg-transparent border-none text-[#c25a3a] w-[26px] h-[26px] text-[15px] cursor-pointer flex items-center justify-center transition-colors duration-[280ms] font-sans-app hover:bg-[rgba(209,112,79,0.12)]"
                onClick={() => addToCart?.(product)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrendingSection({ data }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  const onScroll = () => {
    if (!scrollRef.current) return;
    const {
      scrollLeft: sl,
      scrollWidth: sw,
      clientWidth: cw,
    } = scrollRef.current;
    setCanLeft(sl > 2);
    setCanRight(sl < sw - cw - 2);
  };

  return (
    <section
      className="py-[100px] bg-[#f3ebda] relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[70%] before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d1704f] before:to-transparent before:opacity-40"
      id="trending"
    >
      <div className="text-center mb-[52px] px-6">
        <p className="text-[#c25a3a] text-[10px] tracking-[4px] uppercase mb-3 opacity-85">
          FEATURED
        </p>
        <h2 className="text-[clamp(26px,3.5vw,44px)] font-bold text-[#2d333a] font-serif-app mb-2.5">
          Trending <span className="text-[#c25a3a] italic">Products</span>
        </h2>
        <p className="text-sm text-[#8a94a0]">
          Our most sought-after spirits this season
        </p>
      </div>
      <div className="relative px-12 max-lg:px-5 max-[480px]:px-3.5">
        {canLeft && (
          <button
            className="absolute top-1/2 left-[2px] -translate-y-[60%] z-10 bg-[rgba(251,245,234,0.92)] border border-[rgba(194,90,58,0.35)] text-[#c25a3a] w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-[280ms] hover:bg-[rgba(209,112,79,0.1)] hover:border-[#d1704f]"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div
          className="flex gap-5 overflow-x-auto scroll-smooth py-4 px-1 pb-8 scrollbar-gold"
          ref={scrollRef}
          onScroll={onScroll}
        >
          {data &&
            data.map((p) => {
              if (p.stock_count > 0) {
                return <TrendingCard key={p.id} product={p} />;
              }
            })}
        </div>
        {canRight && (
          <button
            className="absolute top-1/2 right-[2px] -translate-y-[60%] z-10 bg-[rgba(251,245,234,0.92)] border border-[rgba(194,90,58,0.35)] text-[#c25a3a] w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-[280ms] hover:bg-[rgba(209,112,79,0.1)] hover:border-[#d1704f]"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

/* ================================================================
   REVIEWS
   ================================================================ */

function ReviewsSection() {
  return (
    <section
      className="py-[100px] px-16 bg-[linear-gradient(180deg,#f3ebda,#ece1cd,#f3ebda)] border-t border-[rgba(45,51,58,0.12)] max-lg:py-20 max-lg:px-8 max-md:py-16 max-md:px-[22px]"
      id="reviews"
    >
      <div className="text-center mb-[52px] px-6">
        <p className="text-[#c25a3a] text-[10px] tracking-[4px] uppercase mb-3 opacity-85">
          TESTIMONIALS
        </p>
        <h2 className="text-[clamp(26px,3.5vw,44px)] font-bold text-[#2d333a] font-serif-app mb-2.5">
          What Our <span className="text-[#c25a3a] italic">Connoisseurs</span> Say
        </h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[22px] max-w-[1200px] mx-auto max-md:grid-cols-1">
        {REVIEWS.map((r) => (
          <div
            key={r.id}
            className="bg-[#fbf5ea] border border-[rgba(45,51,58,0.12)] rounded-xl py-[34px] px-[30px] relative transition-all duration-[280ms] hover:border-[rgba(209,112,79,0.38)] hover:-translate-y-[5px] hover:shadow-[0_14px_36px_rgba(209,112,79,0.1)] before:content-['\u201c'] before:absolute before:top-3 before:right-[22px] before:text-[88px] before:text-[rgba(209,112,79,0.12)] before:font-serif-app before:leading-none before:pointer-events-none"
          >
            <div className="text-[#c25a3a] text-[15px] tracking-[2px] mb-4">
              {"★".repeat(r.rating)}
            </div>
            <p className="text-sm text-[#5c6670] leading-[1.85] font-serif-app italic mb-[22px]">
              "{r.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d1704f] to-[#b8542f] text-white font-bold text-base flex items-center justify-center shrink-0">
                {r.avatar}
              </div>
              <span className="text-[13px] font-semibold text-[#2d333a]">
                {r.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */

function Footer({ onNavigate }) {
  return (
    <footer
      className="bg-[#040404] border-t border-[rgba(201,168,76,0.18)]"
      id="about"
    >
      <div className="flex gap-[72px] py-20 px-16 max-w-[1400px] mx-auto max-lg:flex-col max-lg:gap-10 max-lg:py-14 max-lg:px-8 max-md:py-10 max-md:px-5 max-md:gap-6">
        <div className="flex-[0_0_280px] max-lg:flex-none">
          <div className="flex items-center gap-3 mb-5">
            <RabbitLogo size={48} />
            <span className="text-[19px] font-bold text-gold font-serif-app tracking-[0.8px]">
              Rabbit Liquor
            </span>
          </div>
          <p className="text-[13px] text-text-dim leading-[1.85] mb-[26px]">
            Curating the world's finest spirits for those who appreciate the
            extraordinary.
          </p>
          <div className="flex gap-2.5">
            {[
              {
                label: "Instagram",
                d: "M2 2h20v20H2z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M17.5 6.5h.01",
                rx: true,
              },
              {
                label: "Facebook",
                d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
              },
              {
                label: "Twitter",
                d: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
              },
            ].map((s) => (
              <a
                href="#"
                key={s.label}
                className="flex items-center justify-center w-9 h-9 border border-[rgba(201,168,76,0.28)] rounded-full text-gold no-underline transition-all duration-[280ms] hover:bg-[rgba(201,168,76,0.1)] hover:border-gold"
                aria-label={s.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  {s.rx ? (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </>
                  ) : (
                    <path d={s.d} />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10 flex-1 max-lg:gap-8 max-md:grid-cols-2 max-md:gap-x-6 max-md:gap-y-8">
          <div className="flex flex-col gap-[11px]">
            <h4 className="text-[10px] tracking-[2.5px] uppercase text-gold font-sans-app mb-1.5">
              Navigate
            </h4>
            <a
              href="#home"
              className="text-[13px] text-text-dim no-underline transition-colors duration-[280ms] hover:text-gold"
            >
              Home
            </a>
            <a
              href="#range"
              className="text-[13px] text-text-dim no-underline transition-colors duration-[280ms] hover:text-gold"
            >
              Our Range
            </a>
            <a
              href="#trending"
              className="text-[13px] text-text-dim no-underline transition-colors duration-[280ms] hover:text-gold"
            >
              Trending
            </a>
            <a
              href="#reserve"
              className="text-[13px] text-text-dim no-underline transition-colors duration-[280ms] hover:text-gold"
            >
              Reserve Collection
            </a>
          </div>
          <div className="flex flex-col gap-[11px]">
            <h4 className="text-[10px] tracking-[2.5px] uppercase text-gold font-sans-app mb-1.5">
              About
            </h4>
            <button
              className="bg-transparent border-none text-[13px] text-text-dim cursor-pointer p-0 font-sans-app text-left transition-colors duration-[280ms] hover:text-gold"
              onClick={() => onNavigate("story")}
            >
              Our Story
            </button>
            <button
              className="bg-transparent border-none text-[13px] text-text-dim cursor-pointer p-0 font-sans-app text-left transition-colors duration-[280ms] hover:text-gold"
              onClick={() => onNavigate("story")}
            >
              Sourcing Philosophy
            </button>
            <a
              href="#"
              className="text-[13px] text-text-dim no-underline transition-colors duration-[280ms] hover:text-gold"
            >
              Blog
            </a>
            <a
              href="#"
              className="text-[13px] text-text-dim no-underline transition-colors duration-[280ms] hover:text-gold"
            >
              Press
            </a>
          </div>
          <div className="flex flex-col gap-[11px]">
            <h4 className="text-[10px] tracking-[2.5px] uppercase text-gold font-sans-app mb-1.5">
              Contact
            </h4>
            <p className="text-xs text-text-dim flex items-start gap-2 leading-[1.6]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="13"
                height="13"
                aria-hidden="true"
                className="shrink-0 mt-0.5 text-gold"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              123 Reserve Lane, Napa Valley, CA
            </p>
            <p className="text-xs text-text-dim flex items-start gap-2 leading-[1.6]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="13"
                height="13"
                aria-hidden="true"
                className="shrink-0 mt-0.5 text-gold"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.47 2 2 0 0 1 3.54 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
              </svg>
              +1 (800) RABBIT-LQ
            </p>
            <p className="text-xs text-text-dim flex items-start gap-2 leading-[1.6]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="13"
                height="13"
                aria-hidden="true"
                className="shrink-0 mt-0.5 text-gold"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              hello@rabbitliquor.com
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 px-16 border-t border-[rgba(201,168,76,0.1)] flex-wrap gap-3 max-lg:px-8 max-md:px-5 max-md:flex-col max-md:items-start max-md:gap-2">
        <p className="text-[11px] text-[#333]">
          © 2026 Rabbit Liquor · All rights reserved · Drink Responsibly · Must
          be 21+ to purchase.
        </p>
        <div className="flex gap-[22px] max-md:flex-wrap max-md:gap-3.5">
          <a
            href="#"
            className="text-[11px] text-[#333] no-underline transition-colors duration-[280ms] hover:text-gold"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-[11px] text-[#333] no-underline transition-colors duration-[280ms] hover:text-gold"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-[11px] text-[#333] no-underline transition-colors duration-[280ms] hover:text-gold"
          >
            Age Verification
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   SITE FOOTER — Ink-wash watercolor footer
   ================================================================ */

const FOOTER_COLS = [
  {
    title: "Shop",
    links: ["Whiskey", "Wine", "Vodka", "Gin", "Rum", "Tequila"],
  },
  {
    title: "Company",
    links: ["About Us", "Journal"],
  },
  {
    title: "Help",
    links: ["FAQ", "Contact Us"],
  },
];

const FOOTER_ROUTES = { FAQ: "/faq", "Contact Us": "/contact" };

function SiteFooter() {
  const navigate = useNavigate();
  return (
    <footer
      className="rl-footer-ink relative text-[rgba(245,240,232,0.62)] font-sans-app"
      id="about"
    >
      <div className="relative z-[1] max-w-[1400px] mx-auto px-16 pt-9 pb-6 max-lg:px-8 max-md:px-6">
        {/* Top: brand + link columns */}
        <div className="flex justify-between gap-12 max-lg:gap-8 max-md:flex-col max-md:gap-7">
          {/* Brand */}
          <div className="max-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#f5efe2] flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
                <img
                  src={siteLogo}
                  alt="Rabbit Liquor"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[19px] font-bold text-[#f5f0e8] font-serif-app tracking-[0.4px]">
                  The Rabbit
                </span>
                <span className="text-[9px] text-[#e0906f] tracking-[3px] uppercase mt-1">
                  Liquor Co.
                </span>
              </div>
            </div>
            <p className="text-[12.5px] leading-[1.7] mb-4 max-w-[270px]">
              Premium spirits, wines &amp; craft beers. Curated with rare taste
              and delivered with care.
            </p>
            <div className="flex gap-2">
              {["IG", "TW", "FB"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[rgba(245,240,232,0.18)] text-[10px] font-semibold tracking-[0.5px] text-[rgba(245,240,232,0.72)] no-underline transition-all duration-[280ms] hover:border-[#d97a5c] hover:text-[#e0906f] hover:bg-[rgba(217,122,92,0.08)]"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex gap-16 max-lg:gap-10 max-md:gap-10 max-md:flex-wrap">
            {FOOTER_COLS.map((col) => (
              <div key={col.title} className="flex flex-col">
                <h4 className="text-[15px] text-[#e0906f] font-serif-app italic mb-3">
                  {col.title}
                </h4>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                  {col.links.map((l) => {
                    const to = FOOTER_ROUTES[l];
                    return (
                      <li key={l}>
                        {to ? (
                          <button
                            type="button"
                            onClick={() => navigate(to)}
                            className="bg-transparent border-none p-0 cursor-pointer text-left text-[13.5px] text-[rgba(245,240,232,0.6)] font-sans-app transition-colors duration-[220ms] hover:text-[#e0906f]"
                          >
                            {l}
                          </button>
                        ) : (
                          <a
                            href="#"
                            className="text-[13.5px] text-[rgba(245,240,232,0.6)] no-underline transition-colors duration-[220ms] hover:text-[#e0906f]"
                          >
                            {l}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter — horizontal on large, vertical on small */}
        <div className="mt-7 pt-6 border-t border-[rgba(245,240,232,0.1)] flex items-center gap-6 max-md:flex-col max-md:items-start max-md:gap-4">
          <h4 className="text-[17px] text-[#e0906f] font-serif-app italic shrink-0">
            Stay in the Warren
          </h4>
          <p className="text-[13.5px] leading-[1.5] flex-1 min-w-[160px] max-md:flex-none">
            New arrivals and rabbit-approved picks — monthly.
          </p>
          <div className="flex gap-2 shrink-0 max-md:w-full">
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-[230px] max-md:flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(245,240,232,0.18)] rounded-lg py-2.5 px-4 text-[13px] text-[#f5f0e8] font-sans-app outline-none transition-all duration-[220ms] placeholder:text-[rgba(245,240,232,0.4)] focus:border-[#d97a5c] focus:bg-[rgba(255,255,255,0.08)]"
            />
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#c85a3c] text-white text-[13px] font-bold tracking-[1px] uppercase py-2.5 px-6 rounded-lg cursor-pointer border-none transition-all duration-[220ms] whitespace-nowrap hover:bg-[#d97a5c] hover:shadow-[0_6px_20px_rgba(200,90,60,0.35)]"
            >
              Subscribe 🐰
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-[1] border-t border-[rgba(245,240,232,0.1)]">
        <div className="max-w-[1400px] mx-auto px-16 py-4 flex items-center justify-between gap-4 flex-wrap max-lg:px-8 max-md:px-6 max-md:flex-col max-md:items-start max-md:gap-2.5">
          <p className="text-[12px] text-[rgba(245,240,232,0.45)] m-0">
            © 2026 The Rabbit Liquor Co. · Drink responsibly. Must be 21+ to
            purchase.
          </p>
          <div className="flex gap-7">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] text-[rgba(245,240,232,0.5)] no-underline transition-colors duration-[220ms] hover:text-[#e0906f]"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   HOME PAGE
   ================================================================ */

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "home";
  const setPage = (p) => {
    if (p === "home") setSearchParams({}, { replace: true });
    else setSearchParams({ page: p }, { replace: true });
  };
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const { data = [], isLoading, error } = getProducts();
  const { mutate, isPending } = reserveProduct();
  useInventorySocket();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [notifyOpen, setNotifyOpen] = useState(false);
  const categories = ["all", ...new Set(data.map((p) => p.category))];

  return (
    <div className="rl-app bg-[#f3ebda] text-[#3a424b] font-sans-app min-h-svh overflow-x-hidden">
      {page === "story" ? (
        <main>
          <StoryPage />
        </main>
      ) : (
        <main>
          <HeroSection />
          <RangeSection />
          <TrendingSection data={data} />
          {/* TESTIMONIALS temporarily hidden */}
          {/* <ReviewsSection /> */}
          <SiteFooter />
        </main>
      )}
      {/* <Footer onNavigate={setPage} /> */}
    </div>
  );
}
