import { ShoppingCart, Phone } from "lucide-react";
import { ElectricButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="font-bold text-xl">Kenitra Battery</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Batteries
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              À propos
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span className="font-medium">+212 537 XX XX XX</span>
            </div>
            
            <button className="relative p-2 hover:bg-soft-grey rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                0
              </Badge>
            </button>

            <div className="hidden sm:flex items-center gap-1 p-1 bg-soft-grey rounded-lg">
              <button className="px-3 py-1 rounded text-sm font-medium bg-background">
                FR
              </button>
              <button className="px-3 py-1 rounded text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                AR
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
