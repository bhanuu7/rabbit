export default function RabbitLogo({ size = 40 }) {
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
      <line x1="11" y1="43" x2="23" y2="44" stroke="#7a5c10" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="11" y1="46.5" x2="23" y2="45.5" stroke="#7a5c10" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="41" y1="44" x2="53" y2="43" stroke="#7a5c10" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="41" y1="45.5" x2="53" y2="46.5" stroke="#7a5c10" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}
