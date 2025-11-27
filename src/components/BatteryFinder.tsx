import { useState } from "react";
import { ElectricButton } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BatteryFinder = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const carMakes = ["Renault", "Dacia", "Volkswagen", "Mercedes", "Peugeot", "Citroën"];
  const carModels = {
    Renault: ["Clio", "Megane", "Captur", "Duster"],
    Dacia: ["Sandero", "Logan", "Duster"],
    // Add more as needed
  };

  const isComplete = make && model && year;

  return (
    <Card className="glass-card max-w-2xl mx-auto p-8 animate-fade-in-up">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Marque</label>
          <Select value={make} onValueChange={(value) => { setMake(value); setModel(""); }}>
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="Sélectionnez la marque" />
            </SelectTrigger>
            <SelectContent>
              {carMakes.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Modèle</label>
          <Select value={model} onValueChange={setModel} disabled={!make}>
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="Sélectionnez le modèle" />
            </SelectTrigger>
            <SelectContent>
              {make && carModels[make as keyof typeof carModels]?.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Année</label>
          <Select value={year} onValueChange={setYear} disabled={!model}>
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="Sélectionnez l'année" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => 2024 - i).map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ElectricButton 
          variant="electric" 
          className={`w-full h-14 text-lg ${isComplete ? 'animate-pulse' : ''}`}
          disabled={!isComplete}
        >
          Trouver ma batterie
        </ElectricButton>
      </div>
    </Card>
  );
};

export default BatteryFinder;
