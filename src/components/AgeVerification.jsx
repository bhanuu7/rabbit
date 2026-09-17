import { useState } from "react";
import { Wine, ShieldX } from "lucide-react";

export default function AgeVerification({ onConfirm }) {
  const [denied, setDenied] = useState(false);

  const handleExit = () => {
    window.location.href = "about:blank";
  };

  const overlayClass =
    "fixed inset-0 z-[9999] flex items-center justify-center bg-bg-base font-sans-app " +
    "before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,rgba(201,168,76,0.09)_0%,transparent_70%)] before:pointer-events-none " +
    "after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle,rgba(201,168,76,0.07)_1px,transparent_1px)] after:[background-size:28px_28px] after:pointer-events-none";

  if (denied) {
    return (
      <div className={overlayClass}>
        <div className="relative z-[1] w-full max-w-[420px] mx-6 bg-[#111111] border border-[rgba(201,168,76,0.22)] rounded-[22px] px-11 pt-[52px] pb-10 shadow-[0_0_0_1px_rgba(201,168,76,0.07),0_36px_90px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(201,168,76,0.13)] flex flex-col items-center text-center animate-av-enter">
          {/* Icon */}
          <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-[#1a1a1a] to-[#1f1c14] border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-gold shadow-[0_0_24px_rgba(201,168,76,0.15),inset_0_1px_0_rgba(201,168,76,0.12)] mb-6">
            <ShieldX size={32} />
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.25)] to-transparent mb-7" />

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-[1.45rem] font-bold text-cream m-0 mb-4 tracking-[-0.01em] leading-snug">
              Access Restricted
            </h2>
            <p className="text-[0.95rem] text-[rgba(245,240,232,0.55)] m-0 leading-[1.6] tracking-[0.01em]">
              You must be{" "}
              <span className="text-gold font-semibold">21 years or older</span>{" "}
              to access Rabbit Liquor. This site contains content related to the
              sale of alcoholic beverages.
            </p>
          </div>

          <div className="w-full rounded-[10px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] px-5 py-4 mb-7">
            <p className="text-[0.82rem] text-[rgba(201,168,76,0.65)] m-0 leading-[1.5] tracking-[0.03em]">
              Only individuals aged 21+ are permitted to browse, purchase, or
              interact with this platform in accordance with applicable law.
            </p>
          </div>

          {/* Footer */}
          <sub className="text-[0.72rem] text-[rgba(201,168,76,0.45)] tracking-[0.04em] leading-[1.4]">
            Drink responsibly &middot; Rabbit Liquor &copy; 2026
          </sub>
        </div>
      </div>
    );
  }

  return (
    <div className={overlayClass}>
      <div className="relative z-[1] w-full max-w-[420px] mx-6 bg-[#111111] border border-[rgba(201,168,76,0.22)] rounded-[22px] px-11 pt-[52px] pb-10 shadow-[0_0_0_1px_rgba(201,168,76,0.07),0_36px_90px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(201,168,76,0.13)] flex flex-col items-center text-center animate-av-enter">
        {/* Branding */}
        <div className="flex flex-col items-center gap-2.5 mb-7">
          <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-[#1a1a1a] to-[#1f1c14] border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-gold shadow-[0_0_24px_rgba(201,168,76,0.15),inset_0_1px_0_rgba(201,168,76,0.12)] mb-1">
            <Wine size={32} />
          </div>
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-gold opacity-75 m-0">Premium Spirits</p>
          <h1 className="text-[1.85rem] font-bold text-cream m-0 leading-[1.1] tracking-[-0.01em]">
            Rabbit <em className="italic text-gold">Liquor</em>
          </h1>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.25)] to-transparent mb-7" />

        {/* Headline */}
        <div className="mb-9">
          <h2 className="text-[1.45rem] font-bold text-cream m-0 mb-3 tracking-[-0.01em]">Welcome, Connoisseur</h2>
          <p className="text-[0.95rem] text-[rgba(245,240,232,0.55)] m-0 leading-[1.5] tracking-[0.01em]">
            Confirm you are of legal drinking age
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mb-7">
          <button
            className="w-full py-3.5 px-6 rounded-[10px] text-[0.88rem] font-bold tracking-[0.1em] uppercase cursor-pointer border-none transition-all duration-200 ease bg-gradient-to-br from-gold to-[#a8873a] text-bg-base shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:from-[#d9b85c] hover:to-[#b8974a] hover:shadow-[0_6px_28px_rgba(201,168,76,0.5)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_2px_10px_rgba(201,168,76,0.3)]"
            onClick={onConfirm}
          >
            YES I'M 21+
          </button>
          <button
            className="w-full py-3.5 px-6 rounded-[10px] text-[0.88rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(245,240,232,0.12)] bg-transparent text-[rgba(245,240,232,0.45)] transition-all duration-200 ease hover:text-[rgba(245,240,232,0.7)] hover:border-[rgba(245,240,232,0.25)] hover:bg-[rgba(255,255,255,0.04)]"
            onClick={() => setDenied(true)}
          >
            NO
          </button>
        </div>

        {/* Footer */}
        <sub className="text-[0.72rem] text-[rgba(201,168,76,0.45)] tracking-[0.04em] leading-[1.4]">
          Drink responsibly &middot; Rabbit Liquor &copy; 2026
        </sub>
      </div>
    </div>
  );
}
