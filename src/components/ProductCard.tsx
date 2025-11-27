import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, Sparkles, Zap, Star, Check, Truck } from "lucide-react";

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
  onAddToCart?: (product: { name: string; specs: string; discountedPrice: number }) => void;
}

const ProductCard = ({
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
  const currentPrice = hasOldBattery ? discountedPrice : originalPrice;
  const savings = originalPrice - discountedPrice;
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ name, specs, discountedPrice: currentPrice });
    }
  };

  // Extract brand from name if not provided
  const displayBrand = brand || name.split(' ')[0];

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1">
      {/* Discount ribbon */}
      {discountPercent > 0 && (
        <div className="absolute top-4 -left-8 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold py-1 px-10 rotate-[-45deg] shadow-lg">
          -{discountPercent}%
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100">
        {/* Real Battery Image */}
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback to SVG if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback SVG Battery (shown if no image or image fails) */}
        <div className={`absolute inset-0 flex items-center justify-center ${image ? 'hidden' : ''}`}>
          <div className="relative">
            <svg className="w-32 h-24 drop-shadow-lg" viewBox="0 0 120 80" fill="none">
              <rect x="5" y="15" width="100" height="55" rx="6" fill="url(#batteryGrad)" stroke="#374151" strokeWidth="2"/>
              <rect x="105" y="30" width="12" height="20" rx="2" fill="#374151"/>
              <rect x="107" y="33" width="8" height="14" rx="1" fill="#9CA3AF"/>
              <rect x="20" y="22" width="12" height="8" rx="1" fill="#EF4444"/>
              <text x="26" y="28" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">+</text>
              <rect x="78" y="22" width="12" height="8" rx="1" fill="#1F2937"/>
              <text x="84" y="28" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">−</text>
              <rect x="20" y="38" width="70" height="20" rx="2" fill="white" fillOpacity="0.9"/>
              <defs>
                <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {badge && (
            <Badge className="bg-gradient-to-r from-[#0071E3] to-[#00a8ff] text-white border-0 shadow-lg px-3 py-1 text-xs font-semibold">
              {badge}
            </Badge>
          )}
        </div>

        {/* Brand tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 shadow-sm">
            {displayBrand}
          </span>
        </div>

        {/* Savings badge */}
        {hasOldBattery && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Économisez {savings} DH
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Product Info */}
        <div>
          <h3 className="font-bold text-base text-gray-900 mb-1 group-hover:text-[#0071E3] transition-colors line-clamp-1">
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
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                En stock
              </span>
            )}
          </div>
        </div>

        {/* Trade-in Toggle */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
          <Switch
            checked={hasOldBattery}
            onCheckedChange={setHasOldBattery}
            className="data-[state=checked]:bg-orange-500"
          />
          <div className="flex-1">
            <label className="text-sm font-medium cursor-pointer text-gray-700 block">
              Reprise ancienne batterie
            </label>
            <span className="text-xs text-orange-600 font-medium">Économisez jusqu'à {savings} DH</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            {hasOldBattery && (
              <span className="text-sm text-gray-400 line-through block">
                {originalPrice} DH
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              {currentPrice.toLocaleString()} <span className="text-base font-medium">DH</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Truck className="w-3.5 h-3.5" />
            Livraison 24h
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all duration-300 hover:shadow-lg group/btn"
        >
          <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
