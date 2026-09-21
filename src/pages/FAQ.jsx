import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do reservations work?",
    a: "Browse our catalogue, reserve the bottles you want, and collect them in-store. We hold your selection for 48 hours.",
  },
  {
    q: "Do you ship alcohol?",
    a: "We currently offer in-store collection only, in accordance with local licensing laws.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards, plus contactless payment at the time of collection.",
  },
  {
    q: "How do I know if an item is in stock?",
    a: "Live stock counts are shown on each product. You can also request a notification when an out-of-stock item is restocked.",
  },
  {
    q: "Can I cancel a reservation?",
    a: "Yes — you can cancel any active reservation from your Orders page before collection, free of charge.",
  },
  {
    q: "Do I need to be 21 to purchase?",
    a: "Yes. You must be 21 or older to browse, reserve, or purchase from Rabbit Liquor.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans-app px-4 py-10 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[4px] uppercase text-gold opacity-85 mb-2">
          Support
        </p>
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold text-[#2d333a] font-serif-app">
          Frequently Asked <span className="text-gold italic">Questions</span>
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => (
          <div
            key={i}
            className="bg-bg-card border border-[rgba(45,51,58,0.12)] rounded-xl overflow-hidden transition-colors duration-200 hover:border-[rgba(209,112,79,0.35)]"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer bg-transparent border-none"
            >
              <span className="text-[15px] font-semibold text-[#2d333a] font-serif-app">
                {item.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gold shrink-0 transition-transform duration-300 ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-[14px] text-[#5c6670] leading-[1.7]">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
