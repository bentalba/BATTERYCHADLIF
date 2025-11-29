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
import { Search, Car, Truck, Bike, ChevronDown, Check, Battery, X } from "lucide-react";

const BatteryFinderCompact = () => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1200);
  };

  const reset = () => {
    setMake("");
    setModel("");
    setYear("");
    setShowResult(false);
    setIsExpanded(false);
  };

  // Compact collapsed view
  if (!isExpanded) {
    return (
      <motion.div 
        className="max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#0071E3]/30 transition-all duration-300 group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#00a8ff] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-900">Trouver ma batterie</h3>
              <p className="text-sm text-gray-500">Sélectionnez votre véhicule</p>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#0071E3] transition-colors" />
          </div>
        </motion.button>
      </motion.div>
    );
  }

  // Expanded view
  return (
    <motion.div 
      className="max-w-xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative p-5 bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Close button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0071E3] via-[#00a8ff] to-[#22c55e] rounded-t-2xl" />

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#00a8ff] flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Trouver ma batterie</h3>
              <p className="text-xs text-gray-500">Résultat instantané</p>
            </div>
          </div>

          {/* Vehicle Type Selector - Compact */}
          <div className="flex gap-2">
            {vehicleTypes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setVehicleType(id); setMake(""); setModel(""); setYear(""); setShowResult(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                  vehicleType === id
                    ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#0071E3]'
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Selectors - Compact Grid */}
          <div className="grid grid-cols-3 gap-2">
            <Select value={make} onValueChange={(value) => { setMake(value); setModel(""); setShowResult(false); }}>
              <SelectTrigger className="h-10 bg-gray-50 border-0 rounded-xl text-sm">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {carMakes.map((brand) => (
                  <SelectItem key={brand} value={brand} className="text-sm">{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={model} onValueChange={(val) => { setModel(val); setShowResult(false); }} disabled={!make}>
              <SelectTrigger className="h-10 bg-gray-50 border-0 rounded-xl text-sm disabled:opacity-40">
                <SelectValue placeholder="Modèle" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {make && carModels[make]?.map((m) => (
                  <SelectItem key={m} value={m} className="text-sm">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={(val) => { setYear(val); setShowResult(false); }} disabled={!model}>
              <SelectTrigger className="h-10 bg-gray-50 border-0 rounded-xl text-sm disabled:opacity-40">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-48">
                {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
                  <SelectItem key={y} value={y.toString()} className="text-sm">{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button / Result */}
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-12 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-xl animate-pulse"
              />
            ) : showResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm">Batterie trouvée !</h4>
                    <p className="text-xs text-gray-600 truncate">{make} {model} {year}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#0071E3]">890 DH</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#0071E3] hover:bg-[#0051a3] rounded-lg text-sm">
                    <Battery className="w-4 h-4 mr-1" />
                    Voir détails
                  </Button>
                  <Button size="sm" variant="outline" onClick={reset} className="rounded-lg text-sm">
                    Nouvelle recherche
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="button">
                <Button
                  onClick={handleSearch}
                  className={`w-full h-11 text-sm rounded-xl font-semibold transition-all ${
                    isComplete
                      ? 'bg-gradient-to-r from-[#0071E3] to-[#00a8ff] hover:shadow-lg hover:shadow-blue-500/20'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isComplete}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Trouver ma batterie
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick help */}
          <p className="text-center text-xs text-gray-400">
            Besoin d'aide ? <a href="tel:+212661377866" className="text-[#0071E3] font-medium">0661-377866</a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BatteryFinderCompact;
