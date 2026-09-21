export const products = [
  {
    id: "1",
    item_name: "Premium Scotch Whisky",
    category: "Whiskey",
    price: 89.99,
    description:
      "A smooth, aged single malt scotch with notes of oak and caramel. Perfect for special occasions or as a gift for the whisky enthusiast.",
    image_url:
      "https://images.unsplash.com/photo-1698064104861-e2dbc14ea72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwYm90dGxlJTIwc2hlbGZ8ZW58MXx8fHwxNzc0NTMxMjM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 12,
    alcoholContent: "40%",
    volume: "750ml",
    origin: "Scotland",
  },
  {
    id: "2",
    item_name: "Bordeaux Red Wine",
    category: "Wine",
    price: 45.99,
    description:
      "An elegant red wine from the heart of Bordeaux, featuring rich berry flavors and a velvety finish. Pairs perfectly with red meats and aged cheeses.",
    image_url:
      "https://images.unsplash.com/photo-1733248113910-400496b9a544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlJTIwcmVkfGVufDF8fHx8MTc3NDUzMTIzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 8,
    alcoholContent: "13.5%",
    volume: "750ml",
    origin: "France",
  },
  {
    id: "3",
    item_name: "Crystal Clear Vodka",
    category: "Vodka",
    price: 32.99,
    description:
      "Ultra-premium vodka distilled five times for exceptional smoothness. Ideal for cocktails or enjoying neat.",
    image_url:
      "https://images.unsplash.com/photo-1663782463991-17b45e3bca07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2RrYSUyMGJvdHRsZSUyMGNsZWFyfGVufDF8fHx8MTc3NDQ5OTE5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 0,
    alcoholContent: "40%",
    volume: "1L",
    origin: "Russia",
  },
  {
    id: "4",
    item_name: "Caribbean Dark Rum",
    category: "Rum",
    price: 38.99,
    description:
      "Rich, full-bodied rum aged in oak barrels, with hints of vanilla, spice, and molasses. Perfect for classic rum cocktails.",
    image_url:
      "https://images.unsplash.com/photo-1613140506142-277c6241b858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW0lMjBib3R0bGUlMjBkYXJrfGVufDF8fHx8MTc3NDQ4MTc2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 15,
    alcoholContent: "40%",
    volume: "750ml",
    origin: "Caribbean",
  },
  {
    id: "5",
    item_name: "Premium Blanco Tequila",
    category: "Tequila",
    price: 54.99,
    description:
      "100% blue agave tequila with crisp, clean flavors and a smooth finish. Excellent for margaritas or sipping.",
    image_url:
      "https://images.unsplash.com/photo-1718881949298-b658a109bf0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXF1aWxhJTIwYm90dGxlJTIwYWdhdmV8ZW58MXx8fHwxNzc0NDgxNzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 6,
    alcoholContent: "40%",
    volume: "750ml",
    origin: "Mexico",
  },
  {
    id: "6",
    item_name: "Botanical Gin",
    category: "Gin",
    price: 42.99,
    description:
      "Artisan gin infused with juniper, citrus, and exotic botanicals. A perfect base for your favorite gin cocktails.",
    image_url:
      "https://images.unsplash.com/photo-1588867832597-43fe3bc19124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW4lMjBib3R0bGUlMjBib3RhbmljYWx8ZW58MXx8fHwxNzc0NTMxMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 10,
    alcoholContent: "42%",
    volume: "700ml",
    origin: "England",
  },
  {
    id: "7",
    item_name: "Vintage Champagne",
    category: "Champagne",
    price: 125.99,
    description:
      "Luxurious champagne with fine bubbles and notes of apple, brioche, and almond. Perfect for celebrations.",
    image_url:
      "https://images.unsplash.com/photo-1640947109541-ad13a917ba45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBib3R0bGUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzQ0OTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 4,
    alcoholContent: "12%",
    volume: "750ml",
    origin: "France",
  },
  {
    id: "8",
    item_name: "XO Cognac",
    category: "Cognac",
    price: 189.99,
    description:
      "Exceptionally aged cognac with complex layers of dried fruit, spice, and oak. A truly luxurious experience.",
    image_url:
      "https://images.unsplash.com/photo-1773396247704-06cc93300397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2duYWMlMjBib3R0bGUlMjBsdXh1cnl8ZW58MXx8fHwxNzc0NTMxMjQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: 0,
    alcoholContent: "40%",
    volume: "700ml",
    origin: "France",
  },
];
