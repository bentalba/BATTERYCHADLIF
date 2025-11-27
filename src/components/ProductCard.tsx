import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ElectricButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ProductCardProps {
  name: string;
  specs: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  inStock?: boolean;
}

const ProductCard = ({
  name,
  specs,
  originalPrice,
  discountedPrice,
  image,
  inStock = true,
}: ProductCardProps) => {
  const [hasOldBattery, setHasOldBattery] = useState(false);
  const currentPrice = hasOldBattery ? discountedPrice : originalPrice;
  const savings = originalPrice - discountedPrice;

  return (
    <Card className="group overflow-hidden hover-lift hover-glow-blue bg-gradient-card shadow-lg border border-border relative">
      <div className="relative aspect-square overflow-hidden bg-soft-grey">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {inStock && (
          <Badge className="absolute top-4 right-4 bg-success-green text-white">
            En stock
          </Badge>
        )}
        {hasOldBattery && (
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
            -{savings} DH
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{specs}</p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-soft-grey rounded-lg">
          <Switch
            checked={hasOldBattery}
            onCheckedChange={setHasOldBattery}
            className="data-[state=checked]:bg-primary"
          />
          <label className="text-sm font-medium cursor-pointer">
            J'ai une ancienne batterie
          </label>
        </div>

        <div className="flex items-baseline gap-3">
          {hasOldBattery && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice} DH
            </span>
          )}
          <span className="text-2xl font-bold text-primary">
            {currentPrice} DH
          </span>
        </div>

        <div className="space-y-2">
          <ElectricButton variant="electric" className="w-full">
            Ajouter au panier
          </ElectricButton>
          <ElectricButton variant="ghost-electric" className="w-full">
            Voir détails →
          </ElectricButton>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
