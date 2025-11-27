import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Clock, MapPin, TrendingUp } from "lucide-react";
import { duration, ease, spring } from "@/lib/motion";

interface ActivityItem {
  id: number;
  type: 'install' | 'delivery' | 'purchase';
  location: string;
  product: string;
  timeAgo: string;
}

/**
 * Live Activity Counter
 * Shows real-time feel of activity: "14 batteries installed today"
 * Periodic updates create sense of urgency without being aggressive
 */
const LiveActivityCounter = () => {
  const [todayCount, setTodayCount] = useState(14);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem | null>(null);

  const locations = [
    "Kénitra", "Rabat", "Salé", "Témara", "Mohammedia", 
    "Skhirat", "Sidi Kacem", "Meknès", "Fès"
  ];
  
  const products = [
    "Varta Blue 60Ah", "Bosch S4", "Tudor High-Tech", 
    "Exide Premium", "Fulmen FA640", "Varta Silver"
  ];

  // Simulate occasional activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance of new activity every 20 seconds
      if (Math.random() > 0.7) {
        const newActivity: ActivityItem = {
          id: Date.now(),
          type: ['install', 'delivery', 'purchase'][Math.floor(Math.random() * 3)] as any,
          location: locations[Math.floor(Math.random() * locations.length)],
          product: products[Math.floor(Math.random() * products.length)],
          timeAgo: "À l'instant",
        };
        
        setRecentActivity(newActivity);
        setTodayCount(prev => prev + 1);
        setIsAnimating(true);
        
        setTimeout(() => setIsAnimating(false), 1000);
        setTimeout(() => setRecentActivity(null), 4000);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Main Counter Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full"
        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
        transition={spring.snappy}
      >
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-sm font-medium text-gray-700">
          <motion.span
            key={todayCount}
            className="inline-block font-bold text-green-600"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: duration.fast }}
          >
            {todayCount}
          </motion.span>
          {" "}batteries installées aujourd'hui
        </span>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </motion.div>

      {/* Recent Activity Toast */}
      <AnimatePresence>
        {recentActivity && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={spring.smooth}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  recentActivity.type === 'install' 
                    ? 'bg-green-100' 
                    : recentActivity.type === 'delivery'
                    ? 'bg-blue-100'
                    : 'bg-orange-100'
                }`}>
                  <Battery className={`w-5 h-5 ${
                    recentActivity.type === 'install' 
                      ? 'text-green-600' 
                      : recentActivity.type === 'delivery'
                      ? 'text-blue-600'
                      : 'text-orange-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {recentActivity.type === 'install' && 'Installation terminée'}
                    {recentActivity.type === 'delivery' && 'Livraison en cours'}
                    {recentActivity.type === 'purchase' && 'Nouvelle commande'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {recentActivity.product}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>{recentActivity.location}</span>
                    <Clock className="w-3 h-3 ml-1" />
                    <span>{recentActivity.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Progress bar for auto-dismiss */}
            <motion.div
              className="h-1 bg-[#0071E3]"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityCounter;
