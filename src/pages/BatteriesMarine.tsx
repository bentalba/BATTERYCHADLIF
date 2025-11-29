import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Grid3X3, List, Anchor, Ship } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { 
  getProductsByCategory, 
} from "@/data/products";
import { useToast } from "@/hooks/use-toast";

// Marine batteries page - no filters as requested
const BatteriesMarine = () => {
  const { toast } = useToast();
  const categoryProducts = useMemo(() => getProductsByCategory('marine'), []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const addToCart = (product: { name: string; specs: string; discountedPrice: number }) => {
    const message = `Bonjour, je suis intéressé par: ${product.name} - ${product.discountedPrice} DHS`;
    const whatsappUrl = `https://wa.me/212661046044?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirection WhatsApp",
      description: "Vous allez être redirigé vers WhatsApp pour finaliser votre commande.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header with marine/cyan accent */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Batteries Marine</h1>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">MARINE</span>
                </div>
                <p className="text-white/80 text-sm">Bateaux, yachts et applications nautiques</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple header bar */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{categoryProducts.length} produits</p>
            
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Info banner */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 mb-6 flex items-center gap-4">
          <Ship className="w-8 h-8 text-cyan-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-cyan-900">Batteries Marine Premium</h3>
            <p className="text-sm text-cyan-700">Toutes nos batteries marine sont AGM avec une résistance aux vibrations et une décharge profonde optimisée pour les applications nautiques.</p>
          </div>
        </div>

        {/* Products Grid - full width since no sidebar */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          : "flex flex-col gap-4"
        }>
          {categoryProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
            >
              <ProductCard
                name={product.name}
                specs={product.specs}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                image={product.image}
                inStock={product.inStock}
                badge={product.badge || undefined}
                rating={product.rating}
                discount={product.discount}
                brand={product.brand}
                onAddToCart={addToCart}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatteriesMarine;
