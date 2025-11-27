import { useState } from "react";
import { Phone, MapPin, AlertTriangle, X, Zap, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const EmergencyBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEmergency, setIsEmergency] = useState(false);

  const handleCall = () => {
    window.location.href = "tel:+212537371207";
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("🆘 SOS Batterie! Je suis en panne à Kenitra. Pouvez-vous m'aider rapidement?");
    window.open(`https://wa.me/212661238104?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Emergency Alert Bar */}
      <AnimatePresence>
        {isVisible && !isEmergency && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white relative z-50 overflow-hidden"
          >
            {/* Animated background pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] animate-pulse" />
            
            <div className="container mx-auto px-4 py-2.5 flex items-center justify-between text-sm md:text-base relative">
              <div className="flex items-center gap-2 font-bold">
                <div className="relative">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                </div>
                <span className="hidden sm:inline">En panne maintenant ?</span>
                <span className="sm:hidden">Panne ?</span>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => setIsEmergency(true)}
                  className="px-4 py-1.5 bg-white text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-all hover:scale-105 shadow-lg"
                >
                  <span className="hidden sm:inline">🚨 Mode Urgence</span>
                  <span className="sm:hidden">🚨 SOS</span>
                </button>
                <button 
                  onClick={() => setIsVisible(false)} 
                  className="p-1 opacity-80 hover:opacity-100 hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Emergency Mode */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-b from-white via-red-50/30 to-white overflow-y-auto"
          >
            {/* Close button */}
            <button 
              onClick={() => setIsEmergency(false)} 
              className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all z-10"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Content */}
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-red-500/30"
              >
                <Zap className="w-12 h-12 md:w-14 md:h-14 text-white" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-black text-gray-900 mb-3"
              >
                SOS Batterie Kenitra
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl text-gray-600 mb-2"
              >
                Ne paniquez pas. Nous arrivons en
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-5xl md:text-7xl font-black text-red-600 mb-8"
              >
                30 min
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md space-y-4"
              >
                <Button 
                  onClick={handleCall}
                  size="lg" 
                  className="w-full h-16 md:h-20 text-xl md:text-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-2xl shadow-red-600/30 rounded-2xl font-bold"
                >
                  <Phone className="mr-3 w-7 h-7 animate-pulse" />
                  Appeler Maintenant
                </Button>
                
                <Button 
                  onClick={handleWhatsApp}
                  size="lg" 
                  variant="outline" 
                  className="w-full h-16 md:h-20 text-xl md:text-2xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-2xl font-bold transition-all"
                >
                  <MapPin className="mr-3 w-7 h-7" />
                  Envoyer ma Position
                </Button>
              </motion.div>
              
              {/* Trust signals */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10 grid grid-cols-3 gap-4 md:gap-8 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 font-medium">24/7</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 font-medium">Déplacement Gratuit</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 font-medium">Garantie 2 ans</span>
                </div>
              </motion.div>

              {/* Live activity indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 flex items-center gap-2 text-sm text-gray-500"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span>3 techniciens disponibles maintenant à Kenitra</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyBar;
