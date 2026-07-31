export const CONTACT = {
  address:
    "Door No: 12-158/1, Road No: 20, Mahanadu, Tadepalli - 522501, Guntur Dist., Andhra Pradesh",
  phoneMain: "9652016213",
  phoneAlt: "9848290038",
  email: "primemodulars@gmail.com",
  whatsapp: "919652016213",
  mapSrc:
    "https://www.google.com/maps?q=Mahanadu%20Road%20No%2020%2C%20Tadepalli%2C%20Guntur%2C%20Andhra%20Pradesh%20522501&output=embed",
};

export const GALLERY_CATEGORIES = [
  "All",
  "Kitchens",
  "Living Rooms",
  "Wardrobes",
  "Bedrooms",
  "Ceilings",
  "Pooja Units",
  "TV Units",
  "Entryway",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryItem = {
  src: string;
  beforeSrc?: string;
  category: Exclude<GalleryCategory, "All">;
  caption: string;
};

export const GALLERY: GalleryItem[] = [
  // Kitchens
  {
    src: "/assets/gallery/kitchen-01.jpg",
    category: "Kitchens",
    caption: "Contemporary Open Kitchen   Tadepalli Residence",
  },
  {
    src: "/assets/gallery/kitchen-02.jpg",
    category: "Kitchens",
    caption: "White & Black Modular Kitchen   Guntur Villa",
  },
  {
    src: "/assets/gallery/kitchen-03.jpg",
    category: "Kitchens",
    caption: "Modern Island Kitchen   Mangalagiri Flat",
  },
  {
    src: "/assets/gallery/kitchen-04.jpg",
    category: "Kitchens",
    caption: "Luxury Kitchen with Brass Hardware",
  },
  {
    src: "/assets/gallery/kitchen-05.jpg",
    category: "Kitchens",
    caption: "Sleek Grey Kitchen   Vijayawada Home",
  },
  {
    src: "/assets/gallery/kitchen-06.jpg",
    category: "Kitchens",
    caption: "Full-Height Modular Kitchen   Tadepalli",
  },
  // Living Rooms
  {
    src: "/assets/gallery/living-01.jpg",
    category: "Living Rooms",
    caption: "Luxe Living Room with Partition   Guntur Duplex",
  },
  {
    src: "/assets/gallery/living-02.jpg",
    category: "Living Rooms",
    caption: "Boucle Sofa Living   Tadepalli Residence",
  },
  {
    src: "/assets/gallery/living-03.jpg",
    category: "Living Rooms",
    caption: "Contemporary Living with Wood Ceiling",
  },
  {
    src: "/assets/gallery/living-04.jpg",
    category: "Living Rooms",
    caption: "Modern Lounge   Mangalagiri Apartment",
  },
  {
    src: "/assets/gallery/living-05.jpg",
    category: "Living Rooms",
    caption: "Open Plan Living & Dining",
  },
  {
    src: "/assets/gallery/living-06.jpg",
    category: "Living Rooms",
    caption: "Elegant Living Room with TV Wall",
  },
  {
    src: "/assets/gallery/living-07.jpg",
    category: "Living Rooms",
    caption: "Grand Living   Tadepalli Villa",
  },
  {
    src: "/assets/gallery/living-08.jpg",
    category: "Living Rooms",
    caption: "Neutral Luxury Living Room",
  },
  {
    src: "/assets/gallery/living-09.jpg",
    category: "Living Rooms",
    caption: "Contemporary Living with Lift Lobby",
  },
  {
    src: "/assets/gallery/living-10.jpg",
    category: "Living Rooms",
    caption: "Open Concept Living Room   Guntur",
  },
  // Wardrobes
  {
    src: "/assets/gallery/wardrobe-01.jpg",
    category: "Wardrobes",
    caption: "Walk-in Wardrobe   Master Bedroom",
  },
  {
    src: "/assets/gallery/wardrobe-02.jpg",
    category: "Wardrobes",
    caption: "Sliding Mirror Wardrobe   Tadepalli",
  },
  {
    src: "/assets/gallery/wardrobe-03.jpg",
    category: "Wardrobes",
    caption: "Full-Height Wardrobe   Premium Finish",
  },
  {
    src: "/assets/gallery/wardrobe-04.jpg",
    category: "Wardrobes",
    caption: "Custom Wardrobe with Dressing Area",
  },
  {
    src: "/assets/gallery/wardrobe-05.jpg",
    category: "Wardrobes",
    caption: "Modular Wardrobe   Guntur Villa",
  },
  // Bedrooms
  {
    src: "/assets/gallery/bedroom-01.jpg",
    category: "Bedrooms",
    caption: "Master Bedroom   Tadepalli Residence",
  },
  {
    src: "/assets/gallery/bedroom-02.jpg",
    category: "Bedrooms",
    caption: "Luxury Bedroom with Panelled Headboard",
  },
  {
    src: "/assets/gallery/bedroom-03.jpg",
    category: "Bedrooms",
    caption: "Cozy Bedroom with Cove Lighting",
  },
  {
    src: "/assets/gallery/bedroom-04.jpg",
    category: "Bedrooms",
    caption: "Contemporary Bedroom   Guntur Flat",
  },
  {
    src: "/assets/gallery/bedroom-05.jpg",
    category: "Bedrooms",
    caption: "Premium Bedroom Suite   Vijayawada",
  },
  {
    src: "/assets/gallery/bedroom-06.jpg",
    category: "Bedrooms",
    caption: "Bedroom with Teak Headboard Wall",
  },
  {
    src: "/assets/gallery/bedroom-07.jpg",
    category: "Bedrooms",
    caption: "Kids' Bedroom   Tadepalli Home",
  },
  {
    src: "/assets/gallery/bedroom-08.jpg",
    category: "Bedrooms",
    caption: "Neutral Bedroom   Mangalagiri Apt",
  },
  // Ceilings
  {
    src: "/assets/gallery/ceiling-01.jpg",
    category: "Ceilings",
    caption: "Layered False Ceiling with Cove Lighting",
  },
  {
    src: "/assets/gallery/ceiling-02.jpg",
    category: "Ceilings",
    caption: "Wooden Tray Ceiling   Dining Area",
  },
  {
    src: "/assets/gallery/ceiling-03.jpg",
    category: "Ceilings",
    caption: "False Ceiling with Pendant Lights",
  },
  {
    src: "/assets/gallery/ceiling-04.jpg",
    category: "Ceilings",
    caption: "Grand Ceiling Design   Tadepalli Villa",
  },
  // Pooja Units
  {
    src: "/assets/gallery/pooja-01.jpg",
    category: "Pooja Units",
    caption: "Custom Teak Pooja Unit   Vijayawada",
  },
  {
    src: "/assets/gallery/pooja-02.jpg",
    category: "Pooja Units",
    caption: "Mandir with Marble Inlay   Guntur Home",
  },
  // TV Units
  {
    src: "/assets/gallery/tv-unit-01.jpg",
    category: "TV Units",
    caption: "Floating TV Unit   Contemporary Living",
  },
  {
    src: "/assets/gallery/tv-unit-02.jpg",
    category: "TV Units",
    caption: "Full-Wall Media Unit   Tadepalli Residence",
  },
  // Entryway
  {
    src: "/assets/gallery/entryway-01.jpg",
    category: "Entryway",
    caption: "Decorative Wood Partition   Foyer",
  },
  {
    src: "/assets/gallery/entryway-02.jpg",
    category: "Entryway",
    caption: "Statement Entryway   Guntur Duplex",
  },
  {
    src: "/assets/gallery/entryway-03.jpg",
    category: "Entryway",
    caption: "Geometric Partition   Staircase Lobby",
  },
  // Dining
  {
    src: "/assets/gallery/dining-01.jpg",
    category: "Living Rooms",
    caption: "Dining Area with Pichwai Mural   Tadepalli",
  },
  {
    src: "/assets/gallery/dining-02.jpg",
    category: "Living Rooms",
    caption: "Elegant Dining Space   Guntur Villa",
  },
];
