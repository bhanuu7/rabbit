export const CATEGORY_FALLBACK = {
  Wine:      { color: '#8b1a1a', isBeer: false },
  Whiskey:   { color: '#c9a84c', isBeer: false },
  Beer:      { color: '#f5a623', isBeer: true  },
  Rum:       { color: '#a0522d', isBeer: false },
  Vodka:     { color: '#a8c8e8', isBeer: false },
  Tequila:   { color: '#7ec850', isBeer: false },
  Champagne: { color: '#e8cc60', isBeer: false },
  Gin:       { color: '#72b8d4', isBeer: false },
  Cognac:    { color: '#c47022', isBeer: false },
  Scotch:    { color: '#c8a87c', isBeer: false },
  default:   { color: '#c9a84c', isBeer: false },
}

export default function BottleSVG({ color = '#c9a84c', label = '', isBeer = false }) {
  return (
    <svg viewBox="0 0 80 210" xmlns="http://www.w3.org/2000/svg" className="bottle-svg">
      {isBeer ? (
        <>
          <path d="M28 18 L28 52 Q13 68 13 106 L13 178 Q13 192 40 192 Q67 192 67 178 L67 106 Q67 68 52 52 L52 18 Z"
            fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2"/>
          <rect x="26" y="8" width="28" height="12" rx="3" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5"/>
          <rect x="28" y="3" width="24" height="8" rx="2" fill={color} stroke={color} strokeWidth="1.5"/>
          <rect x="18" y="118" width="44" height="50" rx="4" fill={color} fillOpacity="0.28" stroke={color} strokeWidth="1"/>
          <text x="40" y="142" textAnchor="middle" fill={color} fontSize="7" fontFamily="Georgia, serif">RABBIT</text>
          <text x="40" y="152" textAnchor="middle" fill={color} fontSize="7" fontFamily="Georgia, serif">LIQUOR</text>
          <text x="40" y="163" textAnchor="middle" fill={color} fontSize="8" fontWeight="bold" fontFamily="Georgia, serif">{label}</text>
        </>
      ) : (
        <>
          <path d="M27 38 L27 64 Q14 80 14 118 L14 174 Q14 192 40 192 Q66 192 66 174 L66 118 Q66 80 53 64 L53 38 Z"
            fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2"/>
          <rect x="31" y="16" width="18" height="24" rx="4" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.5"/>
          <rect x="29" y="7" width="22" height="11" rx="4" fill={color} stroke={color} strokeWidth="1.5"/>
          <path d="M15 140 L15 174 Q15 190 40 190 Q65 190 65 174 L65 140 Z" fill={color} fillOpacity="0.28"/>
          <rect x="19" y="100" width="42" height="60" rx="4" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.6"/>
          <text x="40" y="122" textAnchor="middle" fill={color} fontSize="6.5" fontFamily="Georgia, serif">RABBIT</text>
          <text x="40" y="133" textAnchor="middle" fill={color} fontSize="6.5" fontFamily="Georgia, serif">LIQUOR</text>
          <text x="40" y="148" textAnchor="middle" fill={color} fontSize="8.5" fontWeight="bold" fontFamily="Georgia, serif">{label}</text>
        </>
      )}
    </svg>
  )
}
