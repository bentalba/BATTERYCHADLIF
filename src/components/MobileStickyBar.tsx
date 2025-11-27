import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const MobileStickyBar = () => {
  const handleCall = () => {
    window.location.href = "tel:+212537371207";
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Salam, je suis intéressé par vos batteries. Pouvez-vous m'aider?");
    window.open(`https://wa.me/212661238104?text=${message}`, "_blank");
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 p-2 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden z-40"
    >
      <div className="flex items-center gap-2">
        {/* Call button */}
        <Button 
          onClick={handleCall}
          className="flex-1 h-11 bg-gradient-to-r from-[#0071E3] to-[#00a8ff] text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all text-sm"
        >
          <Phone className="w-4 h-4 mr-2" />
          Appeler
        </Button>
        
        {/* WhatsApp button */}
        <Button 
          onClick={handleWhatsApp}
          className="flex-1 h-11 bg-[#25D366] text-white rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-xl transition-all text-sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};

export default MobileStickyBar;
