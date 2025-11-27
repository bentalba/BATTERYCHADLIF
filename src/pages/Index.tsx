import Navigation from "@/components/Navigation";
import BatteryFinder from "@/components/BatteryFinder";
import ValueCard from "@/components/ValueCard";
import ProductCard from "@/components/ProductCard";
import { ElectricButton } from "@/components/ui/button-variants";
import { Wrench, Recycle, Truck, Phone, MessageCircle } from "lucide-react";
import heroBattery from "@/assets/hero-battery.jpg";
import battery1 from "@/assets/battery-1.jpg";
import battery2 from "@/assets/battery-2.jpg";
import battery3 from "@/assets/battery-3.jpg";
import battery4 from "@/assets/battery-4.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,113,227,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight animate-fade-in-up">
              Démarrez. Toujours.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              Batteries premium pour Kenitra et région
            </p>

            <div className="relative my-12 animate-scale-in" style={{ animationDelay: "400ms" }}>
              <img
                src={heroBattery}
                alt="Premium Battery"
                className="max-w-2xl mx-auto rounded-2xl shadow-2xl"
              />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              <BatteryFinder />
            </div>

            <div className="flex justify-center animate-pulse" style={{ animationDelay: "800ms" }}>
              <div className="text-sm text-muted-foreground">
                ↓ Découvrez nos services
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 bg-soft-grey relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-electric-blue-light rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-energy-orange-light rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={Wrench}
              title="Installation Gratuite"
              description="Installation professionnelle incluse dans toute la région de Kenitra"
              delay={0}
            />
            <ValueCard
              icon={Recycle}
              title="Reprise jusqu'à 200 DH"
              description="Échangez votre ancienne batterie et économisez sur votre achat"
              delay={150}
            />
            <ValueCard
              icon={Truck}
              title="Livraison Rapide"
              description="Livraison gratuite dans toute la région sous 24h"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-soft-grey/30 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Batteries Populaires
            </h2>
            <p className="text-xl text-muted-foreground">
              Nos meilleures ventes pour votre véhicule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard
              name="Varta Silver Dynamic E38"
              specs="74 Ah • 750 CCA • 12V"
              originalPrice={1400}
              discountedPrice={1200}
              image={battery1}
              inStock={true}
            />
            <ProductCard
              name="Bosch S4 008"
              specs="70 Ah • 640 CCA • 12V"
              originalPrice={1200}
              discountedPrice={1000}
              image={battery2}
              inStock={true}
            />
            <ProductCard
              name="Exide Premium EA722"
              specs="72 Ah • 720 CCA • 12V"
              originalPrice={1350}
              discountedPrice={1150}
              image={battery3}
              inStock={true}
            />
            <ProductCard
              name="Fulmen Formula Xtreme"
              specs="85 Ah • 800 CCA • 12V"
              originalPrice={1600}
              discountedPrice={1400}
              image={battery4}
              inStock={true}
            />
          </div>

          <div className="text-center mt-12">
            <ElectricButton variant="outline-electric" className="text-lg px-8 py-6">
              Voir toutes les batteries →
            </ElectricButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-deep-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Besoin d'aide pour choisir?
          </h2>
          <p className="text-xl mb-12 text-white/80">
            Notre équipe est disponible 7j/7 pour vous conseiller
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ElectricButton variant="orange" className="text-lg px-8 py-6">
              <Phone className="w-5 h-5 mr-2" />
              Appeler maintenant
            </ElectricButton>
            <ElectricButton 
              variant="outline-electric" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-deep-black"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </ElectricButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-soft-grey border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">K</span>
                </div>
                <span className="font-bold text-xl">Kenitra Battery</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Batteries premium pour Kenitra et région
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produits</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Voitures</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Poids Lourds</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Marine</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Solaire</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Installation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Diagnostic</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Reprise</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Garantie</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Avenue Hassan II, Kenitra</li>
                <li>+212 537 XX XX XX</li>
                <li>contact@kenitrabattery.ma</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 Kenitra Battery. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
