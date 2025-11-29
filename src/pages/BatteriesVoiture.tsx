import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import BatteryFilters, { ActiveFilters } from "@/components/BatteryFilters";
import { Button } from "@/components/ui/button";
import { 
  getProductsByCategory, 
  getFilterCounts, 
  getPriceRange,
  filterProducts,
  Product 
} from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const BatteriesVoiture = () => {
  const { toast } = useToast();
  const categoryProducts = useMemo(() => getProductsByCategory('voiture'), []);
  
  // Get filter counts and price range for this category
  const filterCounts = useMemo(() => getFilterCounts(categoryProducts), [categoryProducts]);
  const [minPrice, maxPrice] = useMemo(() => getPriceRange(categoryProducts), [categoryProducts]);
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    brands: [],
    technologies: [],
    batteryTypes: [],
    priceRange: [minPrice, maxPrice],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Apply filters
  const filteredProducts = useMemo(() => {
    return filterProducts(categoryProducts, activeFilters);
  }, [categoryProducts, activeFilters]);

  const addToCart = (product: { name: string; specs: string; discountedPrice: number }) => {
    const message = `Bonjour, je suis intéressé par: ${product.name} - ${product.discountedPrice} DHS`;
    const whatsappUrl = `https://wa.me/212661046044?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirection WhatsApp",
      description: "Vous allez être redirigé vers WhatsApp pour finaliser votre commande.",
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      brands: [],
      technologies: [],
      batteryTypes: [],
      priceRange: [minPrice, maxPrice],
    });
  };

  const hasActiveFilters = activeFilters.brands.length > 0 || activeFilters.technologies.length > 0 || 
    activeFilters.batteryTypes.length > 0 || activeFilters.priceRange[0] > minPrice || activeFilters.priceRange[1] < maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Batteries Voiture</h1>
                <p className="text-sm text-gray-500">{filteredProducts.length} produits sur {categoryProducts.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              
              {/* View mode toggle */}
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
          
          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              {activeFilters.brands.map(brand => (
                <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {brand}
                  <button onClick={() => setActiveFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {activeFilters.technologies.map(tech => (
                <span key={tech} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {tech}
                  <button onClick={() => setActiveFilters(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {activeFilters.batteryTypes.map(type => (
                <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {type}
                  <button onClick={() => setActiveFilters(prev => ({ ...prev, batteryTypes: prev.batteryTypes.filter(t => t !== type) }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearAllFilters} className="text-xs text-red-600 hover:text-red-800 ml-2">
                Tout effacer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-36">
              <BatteryFilters
                availableBrands={filterCounts.brands}
                availableTechnologies={filterCounts.technologies}
                availableBatteryTypes={filterCounts.batteryTypes}
                priceRange={[minPrice, maxPrice]}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                totalProducts={categoryProducts.length}
                filteredCount={filteredProducts.length}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères</p>
                <Button onClick={clearAllFilters} variant="outline" className="mt-4">
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-4"
              }>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
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
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="font-semibold">Filtres</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <BatteryFilters
                availableBrands={filterCounts.brands}
                availableTechnologies={filterCounts.technologies}
                availableBatteryTypes={filterCounts.batteryTypes}
                priceRange={[minPrice, maxPrice]}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
                totalProducts={categoryProducts.length}
                filteredCount={filteredProducts.length}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4">
              <Button onClick={() => setShowMobileFilters(false)} className="w-full bg-[#0071E3]">
                Voir {filteredProducts.length} résultats
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BatteriesVoiture;
