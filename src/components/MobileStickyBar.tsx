import { Phone, MessageCircle, Zap } from "lucide-react";
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
      className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden z-40"
    >
      <div className="flex items-center gap-3">
        {/* Deal highlight */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            <p className="text-xs text-gray-400 line-through">Installation 50 DH</p>
          </div>
          <p className="text-sm font-bold text-green-600 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Installation GRATUITE
          </p>
        </div>
        
        {/* Call button */}
        <Button 
          onClick={handleCall}
          className="flex-1 h-12 bg-gradient-to-r from-[#0071E3] to-[#00a8ff] text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
        >
          <Phone className="w-4 h-4 mr-2" />
          Appeler
        </Button>
        
        {/* WhatsApp button */}
        <Button 
          onClick={handleWhatsApp}
          size="icon" 
          variant="outline" 
          className="h-12 w-12 rounded-xl border-2 border-[#25D366] text-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366] hover:text-white transition-all"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Bottom safe area for notched phones */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  );
};

export default MobileStickyBar;
