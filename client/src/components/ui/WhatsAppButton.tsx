import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "919123456789"; // Example number
  const message = encodeURIComponent("Hello Future India Exim, I am interested in your premium agricultural exports.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 lg:bottom-8 right-8 z-[90] w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center group"
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-0" />
      <MessageCircle className="w-8 h-8 fill-current" />
      
      <div className="absolute right-20 bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg shadow-xl opacity-0 translate-x-4 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
        Chat with our Export Team
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
