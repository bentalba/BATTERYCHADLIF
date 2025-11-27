import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Car, Truck, Bike, Zap, ChevronRight } from "lucide-react";

const BatteryFinder = () => {
  const [vehicleType, setVehicleType] = useState<'car' | 'truck' | 'moto'>('car');
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Glassmorphic Card */}
      <div className="relative p-6 md:p-8 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 overflow-hidden">
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

          {/* Vehicle Type Selector */}
          <div className="flex justify-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl">
            {vehicleTypes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setVehicleType(id); setMake(""); setModel(""); setYear(""); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  vehicleType === id
                    ? 'bg-white text-[#0071E3] shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Marque</label>
              <Select value={make} onValueChange={(value) => { setMake(value); setModel(""); }}>
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
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modèle</label>
              <Select value={model} onValueChange={setModel} disabled={!make}>
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
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Année</label>
              <Select value={year} onValueChange={setYear} disabled={!model}>
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
            </div>
          </div>

          {/* Search Button */}
          <Button
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

          {/* Quick help */}
          <p className="text-center text-xs text-gray-400">
            Besoin d'aide ? Appelez-nous au <span className="font-semibold text-[#0071E3]">0537-XX-XX-XX</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatteryFinder;
