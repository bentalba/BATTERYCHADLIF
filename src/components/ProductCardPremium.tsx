import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, Sparkles, Star, Check, Truck, Zap } from "lucide-react";
import { duration, ease, spring } from "@/lib/motion";

export interface ProductCardProps {
  name: string;
  specs: string;
  originalPrice: number;
  discountedPrice: number;
  image?: string;
  inStock?: boolean;
  badge?: string;
  rating?: number;
  discount?: number;
  brand?: string;
  onAddToCart?: (product: { name: string; specs: string; discountedPrice: number }, buttonRef: HTMLButtonElement) => void;
}

const ProductCardPremium = ({
  name,
  specs,
  originalPrice,
  discountedPrice,
  image,
  inStock = true,
  badge,
  rating = 0,
  discount,
  brand,
  onAddToCart,
}: ProductCardProps) => {
  const [hasOldBattery, setHasOldBattery] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const currentPrice = hasOldBattery ? discountedPrice : originalPrice;
  const savings = originalPrice - discountedPrice;
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  // Mouse position for gloss effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position to gloss position
  const glossX = useTransform(mouseX, [0, 300], [-100, 400]);
  const glossY = useTransform(mouseY, [0, 400], [-100, 400]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  }, [mouseX, mouseY]);

  // Slot machine toggle animation
  const handleTradeInToggle = (checked: boolean) => {
    setIsToggling(true);
    setHasOldBattery(checked);
    
    // Reset toggle animation after it completes
    setTimeout(() => setIsToggling(false), 600);
  };

  const handleAddToCart = () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    // Show feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowAddedFeedback(true);
      
      // Trigger the flying animation via callback
      if (onAddToCart && buttonRef.current) {
        onAddToCart({ name, specs, discountedPrice: currentPrice }, buttonRef.current);
      }
      
      // Reset feedback
      setTimeout(() => setShowAddedFeedback(false), 2000);
    }, 400);
  };

  const displayBrand = brand || name.split(' ')[0];

  // Slot machine digits animation
  const SlotMachinePrice = ({ price, isAnimating }: { price: number; isAnimating: boolean }) => {
    const priceStr = price.toLocaleString();
    
    return (
      <span className="inline-flex overflow-hidden">
        {priceStr.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            animate={isAnimating ? {
              y: [0, -30, -60, -30, 0],
              opacity: [1, 0.5, 0.5, 0.5, 1],
            } : { y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.03,
              ease: ease.bounce,
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: duration.smooth, ease: ease.out }}
      whileHover={{ 
        y: -8,
        transition: { duration: duration.normal, ease: ease.out }
      }}
    >
      {/* Hover gloss sheen effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: `radial-gradient(300px circle at ${glossX}px ${glossY}px, rgba(255,255,255,0.4), transparent 40%)`,
        }}
      />
      
      {/* Card shadow that grows on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10"
        initial={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        whileHover={{ 
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          transition: { duration: duration.normal }
        }}
      />

      {/* Discount ribbon */}
      <AnimatePresence>
        {discountPercent > 0 && (
          <motion.div
            initial={{ x: -100, rotate: -45 }}
            animate={{ x: 0, rotate: -45 }}
            className="absolute top-4 -left-8 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold py-1 px-10 shadow-lg"
          >
            -{discountPercent}%
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        {/* Real Battery Image with hover zoom */}
        {image ? (
          <motion.img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain p-4"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: duration.smooth, ease: ease.out }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback SVG Battery */}
        <div className={`absolute inset-0 flex items-center justify-center ${image ? 'hidden' : ''}`}>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: duration.normal }}
          >
            <svg className="w-32 h-24 drop-shadow-lg" viewBox="0 0 120 80" fill="none">
              <rect x="5" y="15" width="100" height="55" rx="6" fill="url(#batteryGradPrem)" stroke="#374151" strokeWidth="2"/>
              <rect x="105" y="30" width="12" height="20" rx="2" fill="#374151"/>
              <rect x="107" y="33" width="8" height="14" rx="1" fill="#9CA3AF"/>
              <rect x="20" y="22" width="12" height="8" rx="1" fill="#EF4444"/>
              <text x="26" y="28" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">+</text>
              <rect x="78" y="22" width="12" height="8" rx="1" fill="#1F2937"/>
              <text x="84" y="28" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">−</text>
              <rect x="20" y="38" width="70" height="20" rx="2" fill="white" fillOpacity="0.9"/>
              <defs>
                <linearGradient id="batteryGradPrem" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b"/>
                  <stop offset="50%" stopColor="#334155"/>
                  <stop offset="100%" stopColor="#1e293b"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#0071E3] tracking-wide mt-2">{displayBrand}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0071E3] text-white text-xs font-bold rounded-full shadow-lg">
              12V
            </div>
          </motion.div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {badge && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-[#0071E3] to-[#00a8ff] text-white border-0 shadow-lg px-3 py-1 text-xs font-semibold">
                {badge}
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Brand tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 shadow-sm">
            {displayBrand}
          </span>
        </div>

        {/* Savings badge - animated appearance */}
        <AnimatePresence>
          {hasOldBattery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={spring.bouncy}
              className="absolute top-3 left-3"
            >
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Économisez {savings} DH
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 space-y-4">
        {/* Product Info */}
        <div>
          <h3 className="font-bold text-base text-gray-900 mb-1 group-hover:text-[#0071E3] transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs">
              {specs}
            </span>
          </p>
          
          {/* Rating & Stock */}
          <div className="flex items-center justify-between mt-3">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({rating})</span>
              </div>
            )}
            {inStock && (
              <motion.span 
                className="flex items-center gap-1 text-xs text-green-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span 
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                En stock
              </motion.span>
            )}
          </div>
        </div>

        {/* Trade-in Toggle with animation */}
        <motion.div 
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
            hasOldBattery 
              ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-orange-200' 
              : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'
          }`}
          animate={hasOldBattery ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Switch
            checked={hasOldBattery}
            onCheckedChange={handleTradeInToggle}
            className="data-[state=checked]:bg-orange-500"
          />
          <div className="flex-1">
            <label className="text-sm font-medium cursor-pointer text-gray-700 block">
              Reprise ancienne batterie
            </label>
            <motion.span 
              className="text-xs text-orange-600 font-semibold flex items-center gap-1"
              animate={hasOldBattery ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-3 h-3" />
              {hasOldBattery ? `Vous économisez ${savings} DH !` : `Économisez jusqu'à ${savings} DH`}
            </motion.span>
          </div>
        </motion.div>

        {/* Price with slot-machine animation */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <AnimatePresence>
              {hasOldBattery && (
                <motion.span 
                  className="text-sm text-gray-400 line-through block"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: duration.fast }}
                >
                  {originalPrice} DH
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-2xl font-bold text-gray-900">
              <SlotMachinePrice price={currentPrice} isAnimating={isToggling} />
              <span className="text-base font-medium ml-1">DH</span>
            </span>
          </div>
          <motion.div 
            className="flex items-center gap-1 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Truck className="w-3.5 h-3.5" />
            Livraison 24h
          </motion.div>
        </div>

        {/* Action Button with states */}
        <motion.div className="relative">
          <Button
            ref={buttonRef}
            onClick={handleAddToCart}
            disabled={isAddingToCart || showAddedFeedback}
            className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              showAddedFeedback 
                ? 'bg-green-500 hover:bg-green-500' 
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAddingToCart ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              ) : showAddedFeedback ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={spring.bouncy}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                  Ajouté !
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Ajouter au panier
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCardPremium;
