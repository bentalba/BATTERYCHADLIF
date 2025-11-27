import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Car, Truck, Bike, Zap, ChevronRight, Check, Battery } from "lucide-react";
import { duration, ease, spring } from "@/lib/motion";

const BatteryFinder = () => {
  const [vehicleType, setVehicleType] = useState<'car' | 'truck' | 'moto'>('car');
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const vehicleTypes = [
    { id: 'car', icon: Car, label: 'Voiture' },
    { id: 'truck', icon: Truck, label: 'Poids Lourd' },
    { id: 'moto', icon: Bike, label: 'Moto' },
  ] as const;

  const carMakes = ["Renault", "Dacia", "Volkswagen", "Mercedes", "Peugeot", "Citroën", "BMW", "Audi", "Toyota", "Hyundai"];
  const carModels: Record<string, string[]> = {
    Renault: ["Clio", "Megane", "Captur", "Duster", "Scenic", "Kadjar"],
    Dacia: ["Sandero", "Logan", "Duster", "Stepway", "Spring"],
    Volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "T-Roc"],
    Mercedes: ["Classe A", "Classe C", "Classe E", "GLA", "GLC"],
    Peugeot: ["208", "308", "3008", "2008", "508"],
    Citroën: ["C3", "C4", "C5", "Berlingo", "C3 Aircross"],
    BMW: ["Série 1", "Série 3", "Série 5", "X1", "X3"],
    Audi: ["A3", "A4", "A6", "Q3", "Q5"],
    Toyota: ["Yaris", "Corolla", "RAV4", "C-HR", "Camry"],
    Hyundai: ["i10", "i20", "i30", "Tucson", "Kona"],
  };

  const isComplete = make && model && year;

  const handleSearch = () => {
    if (!isComplete) return;
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1200);
  };

  // Shimmer loading component
  const ShimmerLoader = () => (
    <div className="space-y-3">
      <div className="h-20 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-xl animate-shimmer bg-[length:200%_100%]" />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="h-12 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Glassmorphic Card */}
      <motion.div 
        className="relative p-6 md:p-8 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: duration.smooth, ease: ease.out }}
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0071E3] via-[#00a8ff] to-[#22c55e]" />
        
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0071E3] to-[#00a8ff] mb-4 shadow-lg shadow-blue-500/25">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Trouvez votre batterie</h3>
            <p className="text-sm text-gray-500 mt-1">Résultat instantané • Prix imbattables</p>
          </div>

          {/* Vehicle Type Selector - Visual Cards with Animation */}
          <div className="grid grid-cols-3 gap-3">
            {vehicleTypes.map(({ id, icon: Icon, label }, index) => (
              <motion.button
                key={id}
                onClick={() => { setVehicleType(id); setMake(""); setModel(""); setYear(""); setShowResult(false); }}
                className={`relative flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl border-2 transition-colors duration-300 overflow-hidden group ${
                  vehicleType === id
                    ? 'border-[#0071E3] bg-gradient-to-br from-[#0071E3]/5 to-[#00a8ff]/10 text-[#0071E3]'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: duration.normal }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator glow */}
                <AnimatePresence>
                  {vehicleType === id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/10 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: duration.fast }}
                    />
                  )}
                </AnimatePresence>
                <motion.div
                  animate={vehicleType === id ? { scale: 1.1 } : { scale: 1 }}
                  transition={spring.snappy}
                >
                  <Icon className="w-8 h-8 md:w-10 md:h-10 mb-2 relative z-10" />
                </motion.div>
                <span className="font-bold text-sm md:text-base relative z-10">{label}</span>
                <AnimatePresence>
                  {vehicleType === id && (
                    <motion.span 
                      className="absolute -bottom-1 left-1/2 w-8 h-1 bg-[#0071E3] rounded-full"
                      initial={{ scaleX: 0, x: "-50%" }}
                      animate={{ scaleX: 1, x: "-50%" }}
                      exit={{ scaleX: 0, x: "-50%" }}
                      transition={{ duration: duration.fast }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Marque</label>
              <Select value={make} onValueChange={(value) => { setMake(value); setModel(""); setShowResult(false); }}>
                <SelectTrigger className="h-13 bg-white border-gray-200/80 rounded-xl hover:border-[#0071E3]/50 focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all shadow-sm">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                  {carMakes.map((brand) => (
                    <SelectItem key={brand} value={brand} className="rounded-lg cursor-pointer">
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modèle</label>
              <Select value={model} onValueChange={(val) => { setModel(val); setShowResult(false); }} disabled={!make}>
                <SelectTrigger className="h-13 bg-white border-gray-200/80 rounded-xl hover:border-[#0071E3]/50 focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                  {make && carModels[make]?.map((m) => (
                    <SelectItem key={m} value={m} className="rounded-lg cursor-pointer">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Année</label>
              <Select value={year} onValueChange={(val) => { setYear(val); setShowResult(false); }} disabled={!model}>
                <SelectTrigger className="h-13 bg-white border-gray-200/80 rounded-xl hover:border-[#0071E3]/50 focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl max-h-60">
                  {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
                    <SelectItem key={y} value={y.toString()} className="rounded-lg cursor-pointer">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Search Button with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShimmerLoader />
                </motion.div>
              ) : showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={spring.smooth}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={spring.bouncy}
                      className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center"
                    >
                      <Check className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Batterie trouvée !</h4>
                      <p className="text-sm text-gray-600">Compatible avec {make} {model} {year}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#0071E3]">890 DH</span>
                      <p className="text-xs text-gray-500">Installation incluse</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1 bg-[#0071E3] hover:bg-[#0051a3] rounded-xl">
                      <Battery className="w-4 h-4 mr-2" />
                      Voir les détails
                    </Button>
                    <Button variant="outline" className="rounded-xl border-gray-200">
                      Autres options
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="button">
                  <Button
                    onClick={handleSearch}
                    className={`w-full h-14 text-base rounded-xl font-semibold transition-all duration-300 ${
                      isComplete
                        ? 'bg-gradient-to-r from-[#0071E3] to-[#00a8ff] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isComplete}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Trouver ma batterie
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick help */}
          <p className="text-center text-xs text-gray-400">
            Besoin d'aide ? Appelez-nous au <span className="font-semibold text-[#0071E3]">0537-XX-XX-XX</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BatteryFinder;
