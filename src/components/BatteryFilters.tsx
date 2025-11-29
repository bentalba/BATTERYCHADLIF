import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterOptions {
  brands: string[];
  technologies: string[];
  batteryTypes: string[];
  priceRange: [number, number];
}

export interface ActiveFilters {
  brands: string[];
  technologies: string[];
  batteryTypes: string[];
  priceRange: [number, number];
}

interface FilterCount {
  name: string;
  count: number;
}

interface BatteryFiltersProps {
  availableBrands: FilterCount[];
  availableTechnologies: FilterCount[];
  availableBatteryTypes: FilterCount[];
  priceRange: [number, number]; // min, max from all products
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  totalProducts: number;
  filteredCount: number;
}

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors px-1"
    >
      <span className="font-semibold text-gray-900">{title}</span>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pb-4 px-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const CheckboxFilter = ({
  items,
  selectedItems,
  onChange,
}: {
  items: FilterCount[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
}) => (
  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
    {items.map((item) => (
      <label
        key={item.name}
        className="flex items-center gap-3 cursor-pointer group py-1"
      >
        <Checkbox
          checked={selectedItems.includes(item.name)}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange([...selectedItems, item.name]);
            } else {
              onChange(selectedItems.filter((i) => i !== item.name));
            }
          }}
          className="border-gray-300 data-[state=checked]:bg-[#0071E3] data-[state=checked]:border-[#0071E3]"
        />
        <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
          {item.name}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {item.count}
        </span>
      </label>
    ))}
  </div>
);

export default function BatteryFilters({
  availableBrands,
  availableTechnologies,
  availableBatteryTypes,
  priceRange,
  activeFilters,
  onFilterChange,
  totalProducts,
  filteredCount,
}: BatteryFiltersProps) {
  const [openSections, setOpenSections] = useState({
    brands: true,
    technologies: true,
    batteryTypes: false,
    price: true,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    activeFilters.brands.length > 0 ||
    activeFilters.technologies.length > 0 ||
    activeFilters.batteryTypes.length > 0 ||
    activeFilters.priceRange[0] !== priceRange[0] ||
    activeFilters.priceRange[1] !== priceRange[1];

  const resetFilters = () => {
    onFilterChange({
      brands: [],
      technologies: [],
      batteryTypes: [],
      priceRange: priceRange,
    });
  };

  const activeFilterCount =
    activeFilters.brands.length +
    activeFilters.technologies.length +
    activeFilters.batteryTypes.length +
    (activeFilters.priceRange[0] !== priceRange[0] ||
    activeFilters.priceRange[1] !== priceRange[1]
      ? 1
      : 0);

  const FilterContent = () => (
    <>
      {/* Header with reset */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div>
          <h3 className="font-bold text-gray-900">Filtres</h3>
          <p className="text-sm text-gray-500">
            {filteredCount} sur {totalProducts} produits
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[#0071E3] hover:text-[#0071E3] hover:bg-blue-50"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Active filters tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
          {activeFilters.brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#0071E3]/10 text-[#0071E3] rounded-full text-sm"
            >
              {brand}
              <button
                onClick={() =>
                  onFilterChange({
                    ...activeFilters,
                    brands: activeFilters.brands.filter((b) => b !== brand),
                  })
                }
                className="hover:bg-[#0071E3]/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {activeFilters.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
            >
              {tech}
              <button
                onClick={() =>
                  onFilterChange({
                    ...activeFilters,
                    technologies: activeFilters.technologies.filter(
                      (t) => t !== tech
                    ),
                  })
                }
                className="hover:bg-emerald-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {activeFilters.batteryTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {type}
              <button
                onClick={() =>
                  onFilterChange({
                    ...activeFilters,
                    batteryTypes: activeFilters.batteryTypes.filter(
                      (t) => t !== type
                    ),
                  })
                }
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Brand Filter */}
      <FilterSection
        title="Filtré par marque"
        isOpen={openSections.brands}
        onToggle={() => toggleSection("brands")}
      >
        <CheckboxFilter
          items={availableBrands}
          selectedItems={activeFilters.brands}
          onChange={(brands) => onFilterChange({ ...activeFilters, brands })}
        />
      </FilterSection>

      {/* Technology Filter */}
      <FilterSection
        title="Filtré par Technologie"
        isOpen={openSections.technologies}
        onToggle={() => toggleSection("technologies")}
      >
        <CheckboxFilter
          items={availableTechnologies}
          selectedItems={activeFilters.technologies}
          onChange={(technologies) =>
            onFilterChange({ ...activeFilters, technologies })
          }
        />
      </FilterSection>

      {/* Battery Type Filter */}
      <FilterSection
        title="Filtré par Type de Batterie"
        isOpen={openSections.batteryTypes}
        onToggle={() => toggleSection("batteryTypes")}
      >
        <CheckboxFilter
          items={availableBatteryTypes}
          selectedItems={activeFilters.batteryTypes}
          onChange={(batteryTypes) =>
            onFilterChange({ ...activeFilters, batteryTypes })
          }
        />
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection
        title="Filtré par Prix"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#0071E3]">
              {activeFilters.priceRange[0].toLocaleString("fr-MA")} DH
            </span>
            <span className="font-medium text-[#0071E3]">
              {activeFilters.priceRange[1].toLocaleString("fr-MA")} DH
            </span>
          </div>
          <Slider
            value={activeFilters.priceRange}
            min={priceRange[0]}
            max={priceRange[1]}
            step={50}
            onValueChange={(value) =>
              onFilterChange({
                ...activeFilters,
                priceRange: value as [number, number],
              })
            }
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{priceRange[0].toLocaleString("fr-MA")} DH</span>
            <span>{priceRange[1].toLocaleString("fr-MA")} DH</span>
          </div>
        </div>
      </FilterSection>
    </>
  );

  return (
    <>
      {/* Desktop Filters - Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters - Bottom Sheet / Modal */}
      <div className="lg:hidden">
        {/* Mobile Filter Button */}
        <Button
          onClick={() => setMobileFiltersOpen(true)}
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeFilterCount > 0 && (
            <span className="bg-[#0071E3] text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setMobileFiltersOpen(false)}
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
              >
                {/* Handle */}
                <div className="flex justify-center py-3">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-lg">Filtres</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[60vh] p-6">
                  <FilterContent />
                </div>

                {/* Footer with Apply Button */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <Button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white"
                  >
                    Voir {filteredCount} résultats
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
