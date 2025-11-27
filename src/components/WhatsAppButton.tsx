import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { spring } from "@/lib/motion";

/**
 * WhatsApp Floating Button with Subtle Pulse
 * - Gentle attention-grabbing animation
 * - NOT aggressive - just enough to be noticed
 * - Positioned in thumb-friendly zone on mobile
 */
const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/212537XXXXXX?text=Bonjour, je cherche une batterie pour mon véhicule"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-40 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, ...spring.bouncy }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring - subtle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.4, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      
      {/* Second pulse ring - offset timing */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.3, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />
      
      {/* Main button */}
      <div className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:shadow-xl group-hover:shadow-[#25D366]/40 transition-shadow">
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </div>
      
      {/* Tooltip */}
      <motion.div
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ x: 10 }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.2 }}
      >
        Besoin d'aide ?
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900" />
      </motion.div>
    </motion.a>
  );
};

export default WhatsAppButton;
