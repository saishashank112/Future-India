import type { Product } from '../context/ModalContext';

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Organic Turmeric Finger",
    category: "Spices",
    priceRange: "$1200 - $1500 / Ton",
    price: 120,
    moq: "1 Ton",
    grade: "Premium (Curcumin 5%+)",
    origin: "Nizamabad, India",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=800",
    description: "Highly potent turmeric fingers sourced directly from the volcanic soils of Nizamabad.",
    certs: "ISO 9001, FSSAI, Organic India"
  },
  {
    id: 2,
    name: "Black Pepper (Tellicherry)",
    category: "Spices",
    priceRange: "$4500 - $5000 / Ton",
    price: 450,
    moq: "500 Kg",
    grade: "Bold (TGSEB)",
    origin: "Kerala, India",
    image: "https://images.unsplash.com/photo-1599481238505-b8b0537a3f77?auto=format&fit=crop&q=80&w=800",
    description: "The 'King of Spices'. Tellicherry extra bold black pepper.",
    certs: "HALAL, GMP, FSSAI"
  },
  {
    id: 3,
    name: "Basmati Rice (1121 Sella)",
    category: "Grains",
    priceRange: "$950 - $1100 / Ton",
    price: 95,
    moq: "20 Tons (1 FCL)",
    grade: "Extra Long Grain",
    origin: "Haryana, India",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    description: "World-renowned 1121 Sella Basmati.",
    certs: "ISO, APEDA, FSSAI"
  },
  {
    id: 4,
    name: "Green Cardamom (8mm Bold)",
    category: "Spices",
    priceRange: "$18000 - $22000 / Ton",
    price: 1800,
    moq: "100 Kg",
    grade: "Highest Export Grade",
    origin: "Idukki, India",
    image: "https://images.unsplash.com/photo-1543322194-d2e7d7008f51?auto=format&fit=crop&q=80&w=800",
    description: "Premium green cardamom pods.",
    certs: "FSSAI, Organic Certified"
  },
  {
    id: 5,
    name: "Cavendish Bananas",
    category: "Fruits",
    priceRange: "$400 - $600 / Ton",
    price: 40,
    moq: "18 Tons (Reefer)",
    grade: "A-Grade Export",
    origin: "Maharashtra, India",
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=800",
    description: "Fresh premium Cavendish bananas.",
    certs: "GLOBALG.A.P, FSSAI"
  },
  {
    id: 6,
    name: "Red Chili (Teja/S17)",
    category: "Spices",
    priceRange: "$2200 - $2500 / Ton",
    price: 220,
    moq: "5 Tons",
    grade: "High Pungency",
    origin: "Guntur, India",
    image: "https://images.unsplash.com/photo-1588253508568-a92654c6827b?auto=format&fit=crop&q=80&w=800",
    description: "Guntur Teja dry red chilies.",
    certs: "ISO, FSSAI"
  }
];
