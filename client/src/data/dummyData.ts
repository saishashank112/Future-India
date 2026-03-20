export const DUMMY_PRODUCTS = [
  // SPICES
  { id: 1, name: "Organic Turmeric Finger", category: "Spices", grade: "A1 Premium", origin: "Maharashtra", priceRange: "₹120 - ₹150", moq: "500 Kg", certs: "USDA, NPOP", image: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=800", description: "High curcumin content from Erode." },
  { id: 2, name: "Black Pepper (Tellicherry)", category: "Spices", grade: "Bold (4.5mm)", origin: "Kerala", priceRange: "₹450 - ₹550", moq: "200 Kg", certs: "FSSAI", image: "https://images.unsplash.com/photo-1599940859674-a7fef05b94ae?q=80&w=800", description: "King of Spices, intense aroma." },
  { id: 3, name: "Guntur Red Chilli", category: "Spices", grade: "S7/S13", origin: "A.P.", priceRange: "₹180 - ₹220", moq: "1000 Kg", certs: "BRC", image: "https://images.unsplash.com/photo-1610450949065-2f2258940801?q=80&w=800", description: "Highly pungent red chillies." },
  { id: 4, name: "Fresh Ginger Roots", category: "Spices", grade: "Export class", origin: "Karnataka", priceRange: "₹65 - ₹85", moq: "5000 Kg", certs: "Global GAP", image: "https://images.unsplash.com/photo-1615485500704-8e990f3900f7?q=80&w=800", description: "Double washed fiberless ginger." },
  
  // FRUITS
  { id: 5, name: "Pollachi Tender Coconuts", category: "Fruits", grade: "Extra Large", origin: "Tamil Nadu", priceRange: "₹35 - ₹45", moq: "2000 Pcs", certs: "Organic", image: "https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?q=80&w=800", description: "Refreshing sweet water coconuts." },
  { id: 6, name: "Alphanso Mangoes", category: "Fruits", grade: "Class A", origin: "Ratnagiri", priceRange: "₹800 - ₹1200", moq: "50 Cases", certs: "HACCP", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800", description: "King of Mangoes, sweet & fiberless." },
  { id: 7, name: "Cavendish Bananas", category: "Fruits", grade: "G9 Export", origin: "Gujarat", priceRange: "₹35 - ₹48", moq: "15 Tons", certs: "Global GAP", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=800", description: "Vacuum packed fresh bananas." },
  { id: 8, name: "Semi-Husked Coconuts", category: "Fruits", grade: "A Grade", origin: "A.P.", priceRange: "₹22 - ₹28", moq: "5000 Pcs", certs: "ISO 22000", image: "https://images.unsplash.com/photo-1594738522108-9fd349e54868?q=80&w=800", description: "Mature coconuts with high oil content." },

  // VEGETABLES
  { id: 9, name: "Nasik Red Onions", category: "Vegetables", grade: "45mm+ Jumbo", origin: "Maharashtra", priceRange: "₹25 - ₹35", moq: "15 Tons", certs: "APEDA", image: "https://images.unsplash.com/photo-1508747703725-7197771375a0?q=80&w=800", description: "Long shelf life red onions." },
  { id: 10, name: "White Bulbed Garlic", category: "Vegetables", grade: "40mm+", origin: "M.P.", priceRange: "₹80 - ₹110", moq: "10 Tons", certs: "HACCP", image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=800", description: "Snow-white Indian garlic." },
  { id: 11, name: "Fresh Green Chillies", category: "Vegetables", grade: "G-4 Bullet", origin: "Karnataka", priceRange: "₹40 - ₹60", moq: "1000 Kg", certs: "Global GAP", image: "https://images.unsplash.com/photo-1610450949065-2f2258940801?q=80&w=800", description: "Spicy dark green chillies." },
  { id: 12, name: "Moringa (Drumsticks)", category: "Vegetables", grade: "Extra Tender", origin: "T.N.", priceRange: "₹45 - ₹65", moq: "500 Kg", certs: "Organic", image: "https://images.unsplash.com/photo-1596450514735-244027729ed6?q=80&w=800", description: "Healthy, long green drumsticks." },

  // GRAINS
  { id: 13, name: "Basmati Rice 1121", category: "Grains", grade: "XXL Grain", origin: "Punjab", priceRange: "₹95 - ₹120", moq: "1 FCL", certs: "GMP", image: "https://images.unsplash.com/photo-1586201327693-51f6186b4d32?q=80&w=800", description: "Aromatic extra long grain rice." },
  { id: 14, name: "Sona Masoori Rice", category: "Grains", grade: "Fine Grain", origin: "Karnataka", priceRange: "₹65 - ₹85", moq: "1 FCL", certs: "FSSAI", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800", description: "Aged premium short grain rice." },
  { id: 15, name: "Yellow Maize", category: "Grains", grade: "Feed Grade", origin: "Bihar", priceRange: "₹22 - ₹28", moq: "100 Tons", certs: "SGS", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800", description: "Nutritive maize for export." },
  { id: 16, name: "Durum Wheat", category: "Grains", grade: "Milling", origin: "M.P.", priceRange: "₹32 - ₹42", moq: "100 Tons", certs: "FSSAI", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800", description: "High protein export wheat." },

  // SEEDS
  { id: 17, name: "Cumin Seeds (Jeera)", category: "Seeds", grade: "EU Quality", origin: "Gujarat", priceRange: "₹240 - ₹320", moq: "500 Kg", certs: "Spice Board", image: "https://images.unsplash.com/photo-1532152277401-443306d86016?q=80&w=800", description: "Pure cumin for global trade." },
  { id: 18, name: "Fennel Seeds (Saunf)", category: "Seeds", grade: "Premium Green", origin: "Rajasthan", priceRange: "₹180 - ₹250", moq: "500 Kg", certs: "NPOP", image: "https://images.unsplash.com/photo-1621319024090-eec32b982637?q=80&w=800", description: "Bold aromatic fennel seeds." },
  { id: 19, name: "White Sesame Seeds", category: "Seeds", grade: "99 Purity", origin: "Gujarat", priceRange: "₹160 - ₹220", moq: "1000 Kg", certs: "SGS", image: "https://images.unsplash.com/photo-1596753139363-2287c8d9d443?q=80&w=800", description: "Hulled premium sesame seeds." },
  { id: 20, name: "Coriander Seeds", category: "Seeds", grade: "Eagle Quality", origin: "Gujarat", priceRange: "₹140 - ₹190", moq: "500 Kg", certs: "ISO", image: "https://images.unsplash.com/photo-1627440026330-0196cb95188f?q=80&w=800", description: "Dried seeds with high oil content." },

  // POWDERS
  { id: 21, name: "Turmeric Powder", category: "Powders", grade: "Pure Mesh", origin: "Maharashtra", priceRange: "₹160 - ₹220", moq: "200 Kg", certs: "BRC", image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800", description: "Fine ground curcumin powder." },
  { id: 22, name: "Red Chilli Powder", category: "Powders", grade: "Sterilized", origin: "Guntur", priceRange: "₹220 - ₹280", moq: "200 Kg", certs: "FDA", image: "https://images.unsplash.com/photo-1532336414038-cf1905044314?q=80&w=800", description: "Pure color, high heat powder." },
  { id: 23, name: "Ginger Powder", category: "Powders", grade: "Premium", origin: "Karnataka", priceRange: "₹120 - ₹160", moq: "200 Kg", certs: "FSSAI", image: "https://images.unsplash.com/photo-1563203434-60ef0937a092?q=80&w=800", description: "Dried dehydrated ginger powder." },
  { id: 24, name: "Coriander Powder", category: "Powders", grade: "Extra Fresh", origin: "Maharashtra", priceRange: "₹150 - ₹190", moq: "200 Kg", certs: "HACCP", image: "https://images.unsplash.com/photo-1532152277401-443306d86016?q=80&w=800", description: "Ground coriander with high aroma." },
  { id: 25, name: "Pure Cardamom Powder", category: "Powders", grade: "AAA Grade", origin: "Kerala", priceRange: "₹380 - ₹450", moq: "50 Kg", certs: "ISO", image: "https://images.unsplash.com/photo-1634914144365-51f6186b4d32?q=80&w=800", description: "Concentrated green cardamom flavor." },
  { id: 26, name: "Black Cumin Powder", category: "Powders", grade: "Extra Bold", origin: "Rajasthan", priceRange: "₹320 - ₹410", moq: "100 Kg", certs: "NPOP", image: "https://images.unsplash.com/photo-1532152277401-443306d86016?q=80&w=800", description: "Deep earthy black cumin powder." }
];
