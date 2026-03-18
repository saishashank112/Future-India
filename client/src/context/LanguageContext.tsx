import { createContext, useContext } from 'react';

export type Language = 'EN' | 'EN_IN' | 'AR' | 'FR' | 'DE' | 'ES' | 'HI' | 'ZH' | 'RU' | 'PT' | 'JA';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const currencyConfig: Record<Language, { code: string, symbol: string, rate: number }> = {
  EN: { code: 'USD', symbol: '$', rate: 0.012 },
  EN_IN: { code: 'INR', symbol: '₹', rate: 1.0 },
  AR: { code: 'AED', symbol: 'د.إ', rate: 0.044 },
  FR: { code: 'EUR', symbol: '€', rate: 0.011 },
  DE: { code: 'EUR', symbol: '€', rate: 0.011 },
  ES: { code: 'EUR', symbol: '€', rate: 0.011 },
  HI: { code: 'INR', symbol: '₹', rate: 1 },
  ZH: { code: 'CNY', symbol: '¥', rate: 0.086 },
  RU: { code: 'RUB', symbol: '₽', rate: 1.1 },
  PT: { code: 'EUR', symbol: '€', rate: 0.011 },
  JA: { code: 'JPY', symbol: '¥', rate: 1.8 }
};

export const translations: Record<Language, Record<string, string>> = {
  EN: {
    hero_title: "India’s Agricultural Excellence, Delivered Globally",
    hero_subtitle: "Sourcing the finest spices and grains from the heart of India. Quality that transcends borders.",
    get_enquiry: "Get Enquiry",
    our_portfolio: "Our Portfolio",
    home: "Home",
    products: "Products",
    global_network: "Global Network",
    our_process: "Our Process",
    about: "About",
    contact: "Contact",
    request_sample: "Request a Sample",
    explore_network: "Explore Network",
    catalog_title: "Export Excellence",
    catalog_subtitle: "Explore our curated selection of high-grade agricultural commodities.",
    trace_title: "Trace the Source",
    trace_subtitle: "Radical transparency from farm to port.",
    hero_title_2: "From Farm to Port, With Precision",
    hero_subtitle_2: "Integrated logistics and direct farm sourcing ensuring freshness and traceability.",
    hero_title_3: "Trusted Export Partners Worldwide",
    hero_subtitle_3: "Serving over 40+ countries with compliant, certified, and premium products.",
    global_presence_title: "Global Export Network",
    global_presence_description: "From our headquarters in India, we manage a sophisticated supply chain that spans across continents.",
    live_export_feed: "Live Export Feed",
    countries_served: "Countries Served",
    on_time_delivery: "On-Time Delivery",
    annual_tonnage: "Annual Tonnage",
    global_certs: "Global Certs",
    trace_origin_label: "Origin & Traceability",
    view_farm_details: "View Farm Details",
    south_india: "South India",
    north_india: "North India",
    east_india: "East India",
    west_india: "West India"
  },
  EN_IN: {
    hero_title: "India’s Agricultural Excellence, Delivered Globally",
    hero_subtitle: "Sourcing the finest spices and grains from the heart of India. Quality that transcends borders.",
    get_enquiry: "Get Enquiry",
    our_portfolio: "Our Portfolio",
    home: "Home",
    products: "Products",
    global_network: "Global Network",
    our_process: "Our Process",
    about: "About",
    contact: "Contact",
    request_sample: "Request a Sample",
    explore_network: "Explore Network",
    catalog_title: "Export Excellence",
    catalog_subtitle: "Explore our curated selection of high-grade agricultural commodities.",
    trace_title: "Trace the Source",
    trace_subtitle: "Radical transparency from farm to port.",
    hero_title_2: "From Farm to Port, With Precision",
    hero_subtitle_2: "Integrated logistics and direct farm sourcing ensuring freshness and traceability.",
    hero_title_3: "Trusted Export Partners Worldwide",
    hero_subtitle_3: "Serving over 40+ countries with compliant, certified, and premium products.",
    global_presence_title: "Global Export Network",
    global_presence_description: "From our headquarters in India, we manage a sophisticated supply chain that spans across continents.",
    live_export_feed: "Live Export Feed",
    countries_served: "Countries Served",
    on_time_delivery: "On-Time Delivery",
    annual_tonnage: "Annual Tonnage",
    global_certs: "Global Certs",
    trace_origin_label: "Origin & Traceability",
    view_farm_details: "View Farm Details",
    south_india: "South India",
    north_india: "North India",
    east_india: "East India",
    west_india: "West India"
  },
  HI: {
    hero_title: "भारत की कृषि उत्कृष्टता, विश्व स्तर पर वितरित",
    hero_subtitle: "भारत के हृदय से बेहतरीन मसालों और अनाज की सोर्सिंग। गुणवत्ता जो सीमाओं से परे है।",
    get_enquiry: "पूछताछ प्राप्त करें",
    home: "होम",
    products: "उत्पाद",
    contact: "संपर्क करें",
    catalog_title: "निर्यात उत्कृष्टता",
    trace_title: "स्रोत का पता लगाएं",
    hero_title_2: "खेत से बंदरगाह तक, सटीकता के साथ",
    hero_subtitle_2: "एकीकृत रसद और प्रत्यक्ष कृषि सोर्सिंग ताजगी सुनिश्चित करती है।"
  },
  AR: {
    hero_title: "التميز الزراعي في الهند، يتم تسليمه عالميًا",
    hero_subtitle: "تزويد أجود التوابل والحبوب من قلب الهند. جودة تتجاوز الحدود.",
    get_enquiry: "احصل على استفسار",
    home: "الرئيسية",
    products: "المنتجات",
    contact: "اتصل بنا",
    catalog_title: "تميز التصدير",
    trace_title: "تتبع المصدر"
  },
  // Adding others as needed or keeping default EN
  FR: { hero_title: "L'excellence agricole de l'Inde", get_enquiry: "Obtenir une enquête", home: "Accueil" },
  DE: { hero_title: "Indiens landwirtschaftliche Exzellenz", get_enquiry: "Anfrage erhalten", home: "Startseite" },
  ES: { hero_title: "Excelencia agrícola de la India", get_enquiry: "Obtener consulta", home: "Inicio" },
  ZH: { hero_title: "印度的卓越农业", get_enquiry: "获取查询", home: "首页" },
  RU: { hero_title: "Сельскохозяйственное превосходство Индии", get_enquiry: "Получить запрос", home: "Главная" },
  PT: { hero_title: "Excelência Agrícola da Índia", get_enquiry: "Obter inquérito", home: "Início" },
  JA: { hero_title: "インドの卓越した農業", get_enquiry: "お問い合わせ", home: "ホーム" },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const getCurrencyConfig = (lang: Language) => currencyConfig[lang] || currencyConfig.EN;
