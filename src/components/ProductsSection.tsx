import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCardPremium from "@/components/ProductCardPremium";
import BatteryFilters, { ActiveFilters } from "@/components/BatteryFilters";
import { Button } from "@/components/ui/button";
import { 
  Product, 
  getBatteryImage, 
  getFilterCounts, 
  getPriceRange, 
  filterProducts 
} from "@/data/products";
import { Filter, Grid3X3, List } from "lucide-react";

interface ProductsSectionProps {
  products: Product[];
  title: string;
  subtitle?: string;
  badge?: string;
  showFilters?: boolean;
  onAddToCart: (product: { name: string; specs: string; discountedPrice: number }) => void;
}

const ProductsSection = ({
  products,
  title,
  subtitle,
  badge,
  showFilters = true,
  onAddToCart,
}: ProductsSectionProps) => {
  // Get available filter options from products
  const filterCounts = useMemo(() => getFilterCounts(products), [products]);
  const [minPrice, maxPrice] = useMemo(() => getPriceRange(products), [products]);

  // Filter state - initialize with actual price range
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    brands: [],
    technologies: [],
    batteryTypes: [],
    priceRange: [minPrice, maxPrice],
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Apply filters
  const filteredProducts = useMemo(() => {
    return filterProducts(products, activeFilters);
  }, [products, activeFilters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      brands: [],
      technologies: [],
      batteryTypes: [],
      priceRange: [minPrice, maxPrice],
    });
  };

  return (
    <section className="py-24 relative z-10 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          {badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium mb-4">
              {badge}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {showFilters ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Component (handles both desktop sidebar and mobile drawer) */}
            <BatteryFilters
              availableBrands={filterCounts.brands}
              availableTechnologies={filterCounts.technologies}
              availableBatteryTypes={filterCounts.batteryTypes}
              priceRange={[minPrice, maxPrice]}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              totalProducts={products.length}
              filteredCount={filteredProducts.length}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count & View Toggle */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-gray-500">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> batteries trouvées
                </p>
                
                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[#0071E3] text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-[#0071E3] text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <AnimatePresence mode="wait">
                {filteredProducts.length > 0 ? (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                      >
                        <ProductCardPremium
                          name={product.name}
                          specs={product.specs}
                          originalPrice={product.originalPrice}
                          discountedPrice={product.discountedPrice}
                          inStock={product.inStock}
                          badge={product.badge}
                          rating={product.rating}
                          discount={product.discount}
                          brand={product.brand}
                          image={product.image || getBatteryImage(product.brand, product.category)}
                          onAddToCart={onAddToCart}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Filter className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune batterie trouvée
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Essayez de modifier vos filtres pour voir plus de résultats
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white"
                    >
                      Effacer tous les filtres
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* No Filters Mode - Simple Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCardPremium
                key={product.id}
                name={product.name}
                specs={product.specs}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                inStock={product.inStock}
                badge={product.badge}
                rating={product.rating}
                discount={product.discount}
                brand={product.brand}
                image={product.image || getBatteryImage(product.brand, product.category)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
