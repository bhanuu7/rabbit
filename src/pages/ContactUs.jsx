import { Mail, Phone, MapPin, Send } from "lucide-react";

const CONTACT_EMAIL = "hello@rabbitliquor.com";

export default function ContactUs() {
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Enquiry — Rabbit Liquor",
  )}&body=${encodeURIComponent(
    "Hi Rabbit Liquor team,\n\nI'd like to ask about...\n\nThanks,\n",
  )}`;

  const rows = [
    { icon: Mail, label: "Email", value: CONTACT_EMAIL },
    { icon: Phone, label: "Phone", value: "+1 (800) 555-0142" },
    { icon: MapPin, label: "Cellar", value: "24 Warren Lane, Napa Valley, CA" },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans-app px-4 py-10 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[4px] uppercase text-gold opacity-85 mb-2">
          Get in touch
        </p>
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold text-[#2d333a] font-serif-app">
          Contact <span className="text-gold italic">Us</span>
        </h1>
        <p className="text-[14px] text-[#5c6670] mt-3 max-w-md mx-auto leading-[1.7]">
          Questions about a reservation, a rare bottle, or anything in between?
          Drop us a line and we&apos;ll usually reply within one business day.
        </p>
      </div>

      <div className="bg-bg-card border border-[rgba(45,51,58,0.12)] rounded-2xl p-8 flex flex-col gap-5">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[rgba(209,112,79,0.1)] border border-[rgba(209,112,79,0.25)] flex items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px] text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[1.5px] text-[#8a94a0]">
                {label}
              </span>
              <span className="text-[15px] text-[#2d333a] font-medium">
                {value}
              </span>
            </div>
          </div>
        ))}

        <div className="h-px bg-[rgba(45,51,58,0.1)] my-1" />

        <p className="text-[13px] text-[#5c6670] leading-[1.7]">
          Prefer to write directly? Click below and your mail app will open a
          new message to{" "}
          <span className="text-gold font-semibold">{CONTACT_EMAIL}</span>.
        </p>

        <a
          href={mailtoHref}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-br from-gold to-gold-dark text-white text-[13px] font-bold tracking-[1px] uppercase no-underline rounded-md cursor-pointer transition-all duration-[280ms] hover:from-gold-light hover:to-gold hover:shadow-[0_6px_20px_rgba(209,112,79,0.3)]"
        >
          <Send className="w-4 h-4" />
          Send Email
        </a>
      </div>
    </div>
  );
}
