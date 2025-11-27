import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import BatteryFinder from "@/components/BatteryFinder";
import ValueCard from "@/components/ValueCard";
import ProductCard from "@/components/ProductCard";
import PremiumBattery from "@/components/PremiumBattery";
import VoltageAnimation from "@/components/VoltageAnimation";
import { Button } from "@/components/ui/button";
import { Wrench, Recycle, Truck, Phone, MessageCircle, ChevronDown, ChevronRight, Zap, MapPin, X, Plus, Minus, Star, Clock } from "lucide-react";
import { products, getBestSellers, getProductsByCategory, getBatteryImage, getBrandLogo, type Product } from "@/data/products";

interface CartItem {
  name: string;
  specs: string;
  discountedPrice: number;
  quantity: number;
}

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [initialCharge, setInitialCharge] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const scrollRAF = useRef<number | null>(null);

  // Initial charging animation on page load
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame % 3 === 0) { // Throttle updates
        setInitialCharge(prev => {
          if (prev >= 25) return 25;
          return prev + 1;
        });
      }
      if (frame < 75) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // Optimized scroll handler with RAF throttling
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRAF.current) return;
      scrollRAF.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        scrollRAF.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRAF.current) cancelAnimationFrame(scrollRAF.current);
    };
  }, []);

  // Calculate battery charge based on scroll position
  const calculateBatteryCharge = () => {
    const productsSection = productsRef.current;
    if (!productsSection) return initialCharge;
    
    const productsSectionTop = productsSection.offsetTop;
    const maxScroll = productsSectionTop - window.innerHeight * 0.3;
    
    if (scrollY <= 0) return initialCharge;
    
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    return Math.max(initialCharge, 25 + scrollProgress * 75);
  };

  // Battery stays visible much longer - only starts fading after 80% of viewport
  const isBatteryInBackground = scrollY > window.innerHeight * 0.3;
  const batteryCharge = calculateBatteryCharge();
  
  // Main battery fades out, background battery fades in
  const mainBatteryOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.4));
  const backgroundBatteryOpacity = isBatteryInBackground 
    ? Math.min(0.2, (scrollY - window.innerHeight * 0.3) / (window.innerHeight * 0.5))
    : 0;

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (name: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.name !== name));
    } else {
      setCartItems(prev => prev.map(item =>
        item.name === name ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        cartItemsCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* HERO SECTION - Premium Design with Animated Wires */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,113,227,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.05),transparent_50%)]" />
        
        {/* ANIMATED CAR BATTERY CABLES - Red (+) and Black (-) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          
          {/* RED CABLE (+) - Thick jumper cable style flowing left to right */}
          <svg className="absolute top-[18%] left-0 w-full h-40" viewBox="0 0 1440 160" preserveAspectRatio="none">
            {/* Cable shadow */}
            <path 
              d="M-50,85 C150,40 300,120 500,70 C700,20 900,130 1100,60 C1250,10 1400,90 1550,80" 
              fill="none" 
              stroke="rgba(0,0,0,0.15)" 
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Main cable body - thick rubber look */}
            <path 
              d="M-50,80 C150,35 300,115 500,65 C700,15 900,125 1100,55 C1250,5 1400,85 1550,75" 
              fill="none" 
              stroke="url(#redCableGradient)" 
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Cable highlight - gives 3D rubber effect */}
            <path 
              d="M-50,75 C150,30 300,110 500,60 C700,10 900,120 1100,50 C1250,0 1400,80 1550,70" 
              fill="none" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Electricity spark traveling along red cable */}
            <circle r="6" fill="#fff" style={{ filter: 'drop-shadow(0 0 10px #ff0000) drop-shadow(0 0 20px #ff6666)' }}>
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M-50,80 C150,35 300,115 500,65 C700,15 900,125 1100,55 C1250,5 1400,85 1550,75" />
            </circle>
            <circle r="3" fill="#ffcccc">
              <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.3s" path="M-50,80 C150,35 300,115 500,65 C700,15 900,125 1100,55 C1250,5 1400,85 1550,75" />
            </circle>
            {/* Red cable clamp at start */}
            <g transform="translate(-30, 60)">
              <rect x="0" y="0" width="40" height="50" rx="5" fill="#dc2626" />
              <rect x="5" y="5" width="30" height="15" rx="2" fill="#991b1b" />
              <text x="20" y="38" fill="#fff" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
            </g>
            <defs>
              <linearGradient id="redCableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="30%" stopColor="#dc2626" />
                <stop offset="70%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
          </svg>

          {/* BLACK CABLE (-) - Thick jumper cable style flowing right to left */}
          <svg className="absolute bottom-[15%] left-0 w-full h-40" viewBox="0 0 1440 160" preserveAspectRatio="none">
            {/* Cable shadow */}
            <path 
              d="M1550,75 C1300,120 1150,30 950,90 C750,150 550,40 350,100 C150,160 0,60 -100,85" 
              fill="none" 
              stroke="rgba(0,0,0,0.2)" 
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Main cable body - thick rubber look */}
            <path 
              d="M1550,70 C1300,115 1150,25 950,85 C750,145 550,35 350,95 C150,155 0,55 -100,80" 
              fill="none" 
              stroke="url(#blackCableGradient)" 
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Cable highlight */}
            <path 
              d="M1550,65 C1300,110 1150,20 950,80 C750,140 550,30 350,90 C150,150 0,50 -100,75" 
              fill="none" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Electricity spark traveling along black cable */}
            <circle r="6" fill="#fff" style={{ filter: 'drop-shadow(0 0 10px #666) drop-shadow(0 0 20px #999)' }}>
              <animateMotion dur="3s" repeatCount="indefinite" path="M1550,70 C1300,115 1150,25 950,85 C750,145 550,35 350,95 C150,155 0,55 -100,80" />
            </circle>
            <circle r="3" fill="#ccc">
              <animateMotion dur="3s" repeatCount="indefinite" begin="0.4s" path="M1550,70 C1300,115 1150,25 950,85 C750,145 550,35 350,95 C150,155 0,55 -100,80" />
            </circle>
            {/* Black cable clamp at end */}
            <g transform="translate(1500, 50)">
              <rect x="0" y="0" width="40" height="50" rx="5" fill="#1f2937" />
              <rect x="5" y="5" width="30" height="15" rx="2" fill="#111827" />
              <text x="20" y="38" fill="#fff" fontSize="20" fontWeight="bold" textAnchor="middle">−</text>
            </g>
            <defs>
              <linearGradient id="blackCableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4b5563" />
                <stop offset="30%" stopColor="#374151" />
                <stop offset="70%" stopColor="#1f2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
          </svg>

          {/* Electric sparks/particles */}
          <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-red-500 rounded-full animate-float-particle opacity-80" style={{ animationDelay: '0s', filter: 'drop-shadow(0 0 6px #ef4444)' }} />
          <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-red-400 rounded-full animate-float-particle opacity-60" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-[20%] left-[25%] w-3 h-3 bg-gray-600 rounded-full animate-float-particle opacity-70" style={{ animationDelay: '1s', filter: 'drop-shadow(0 0 4px #666)' }} />
          <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-gray-500 rounded-full animate-float-particle opacity-50" style={{ animationDelay: '1.5s' }} />
          
          {/* Yellow electricity sparks */}
          <div className="absolute top-[22%] left-[40%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-spark opacity-90" style={{ animationDelay: '0.2s', filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
          <div className="absolute bottom-[18%] right-[35%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-spark opacity-90" style={{ animationDelay: '0.7s', filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
        </div>
        
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Background Battery */}
        {backgroundBatteryOpacity > 0 && (
          <div 
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
            style={{ opacity: backgroundBatteryOpacity }}
          >
            <div className="w-[180%] max-w-5xl">
              <PremiumBattery chargeLevel={batteryCharge} isBackground />
            </div>
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            
            {/* Trust badge - VERY PROMINENT */}
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0071E3] to-[#00a8ff] shadow-2xl shadow-blue-500/30 animate-pulse-subtle">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0071E3] text-sm font-bold ring-4 ring-white/50 shadow-lg">K</div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0071E3] text-sm font-bold ring-4 ring-white/50 shadow-lg">M</div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0071E3] text-sm font-bold ring-4 ring-white/50 shadow-lg">S</div>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="flex flex-col items-start">
                <span className="text-3xl font-black text-white tracking-tight">10 000+</span>
                <span className="text-sm text-white/90 font-medium">clients satisfaits</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
              </div>
            </div>

            {/* Main headline with gradient */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight">
                <span className="text-gray-900">Démarrez.</span>
                <br />
                <span className="bg-gradient-to-r from-[#0071E3] via-[#00a8ff] to-[#22c55e] bg-clip-text text-transparent">
                  Toujours.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                La référence des batteries auto à <span className="text-gray-900 font-medium">Kenitra</span>. 
                Livraison express, installation gratuite, garantie 2 ans.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2h</div>
                <div className="text-sm text-gray-500">Livraison express</div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">-200 DH</div>
                <div className="text-sm text-gray-500">Reprise ancienne</div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2 ans</div>
                <div className="text-sm text-gray-500">Garantie totale</div>
              </div>
            </div>

            {/* Main Battery with Voltage Display */}
            <div className="relative my-6">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                {/* Battery */}
                <div
                  className="relative transition-opacity duration-300 flex-1 max-w-md"
                  style={{ opacity: Math.max(0.4, mainBatteryOpacity) }}
                >
                  <PremiumBattery chargeLevel={batteryCharge} />
                </div>
                
                {/* Voltage Animation Panel - Desktop Only */}
                <div className="hidden lg:block w-full max-w-sm">
                  <VoltageAnimation chargeLevel={batteryCharge} />
                </div>
              </div>
              
              {/* Charged message */}
              {batteryCharge >= 95 && (
                <div className="mt-6 flex justify-center animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-medium">Votre batterie chargée vous attend !</span>
                    <Zap className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Battery Finder with enhanced styling */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0071E3]/10 via-transparent to-[#22c55e]/10 rounded-3xl blur-2xl" />
              <BatteryFinder />
            </div>

            {/* Scroll indicator */}
            <div
              className="flex flex-col items-center gap-2 pt-6 cursor-pointer group"
              onClick={() => document.getElementById('value-props')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm text-gray-400 group-hover:text-[#0071E3] transition-colors">
                Découvrez nos avantages
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2 group-hover:border-[#0071E3] transition-colors">
                <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce group-hover:bg-[#0071E3]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITIONS - Enhanced */}
      <section id="value-props" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-sm font-medium mb-4">
              Pourquoi nous choisir
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              L'excellence au service de votre véhicule
            </h2>
          </div>
          
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
              description="Livraison dans toute la région de Kenitra sous 24h"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* BRAND PARTNERS */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-gray-400 mb-8 uppercase tracking-wider font-medium">
            Marques de confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {['VARTA', 'EXIDE', 'BOSCH', 'TUDOR', 'FULMEN', 'DURACELL'].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-gray-400 hover:text-[#0071E3] transition-colors cursor-pointer">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section ref={productsRef} id="products" className="py-24 relative z-10 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          {/* 100% Charge indicator when reaching products */}
          {batteryCharge >= 95 && (
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-semibold shadow-sm">
                <Zap className="w-5 h-5" />
                Votre batterie chargée vous attend!
              </span>
            </div>
          )}
          
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium mb-4">
              Best-sellers
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Batteries les plus vendues
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Découvrez notre sélection des meilleures batteries, choisies par nos clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getBestSellers().slice(0, 4).map((product) => (
              <ProductCard
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
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* More Products Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {getProductsByCategory('voiture').slice(5, 9).map((product) => (
              <ProductCard
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
                onAddToCart={addToCart}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="text-[#0071E3] border-[#0071E3] hover:bg-[#0071E3] hover:text-white transition-all duration-300"
            >
              Voir toutes les batteries →
            </Button>
          </div>
        </div>
      </section>

      {/* TRUSTED BRANDS SECTION */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Marques officielles</span>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">Distributeur agréé des plus grandes marques</h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['VARTA', 'EXIDE', 'BOSCH', 'TUDOR', 'FULMEN', 'OPTIMA'].map((brand) => (
              <div key={brand} className="group flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <img 
                  src={getBrandLogo(brand)} 
                  alt={`${brand} logo`}
                  className="h-10 md:h-12 object-contain"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-xl font-bold text-gray-800">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIZED SOLUTIONS */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Solutions Spécialisées
            </h2>
            <p className="text-xl text-gray-500">
              Des batteries adaptées à chaque besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1586191582066-a29f3934f1a8?w=600&h=400&fit=crop&q=80" 
                alt="Batteries Poids Lourds"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-[#FF6B00] text-white text-xs font-bold rounded-full">PRO</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <h3 className="text-2xl font-bold mb-2">Batteries Poids Lourds</h3>
                <p className="text-white/80 mb-4">Solutions professionnelles haute puissance</p>
                <span className="inline-flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">Explorer →</span>
              </div>
            </div>

            <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0071E3]/90 via-[#0071E3]/50 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=400&fit=crop&q=80" 
                alt="Batteries Marine"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">MARINE</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <h3 className="text-2xl font-bold mb-2">Batteries Marine</h3>
                <p className="text-white/80 mb-4">Pour bateaux et yachts</p>
                <span className="inline-flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">Explorer →</span>
              </div>
            </div>

            <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-[#22c55e]/90 via-[#22c55e]/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&q=80" 
                alt="Batteries Solaire"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">ECO</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <h3 className="text-2xl font-bold mb-2">Batteries Solaire</h3>
                <p className="text-white/80 mb-4">Stockage d'énergie renouvelable</p>
                <span className="inline-flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">Explorer →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Plus de 500 installations
              </h2>
              <p className="text-xl text-gray-500 mb-8">
                Nous avons installé des batteries dans toute la région de Kenitra. Notre équipe professionnelle assure un service rapide et fiable.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071E3] to-[#0071E3]/70 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">+500 clients satisfaits</p>
              </div>
            </div>
            <div className="relative h-80 bg-gray-100 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-[#0071E3] animate-pulse" />
              </div>
              <div className="absolute top-4 left-4 w-3 h-3 bg-[#0071E3] rounded-full animate-ping" />
              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#0071E3] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#0071E3] rounded-full animate-ping" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-8 right-8 w-3 h-3 bg-[#0071E3] rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0071E3]/10 rounded-full blur-3xl animate-orb-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl animate-orb-float" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Animated lightning icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-[#0071E3]/20 animate-electric-pulse">
            <Zap className="w-8 h-8 text-[#0071E3] animate-lightning" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Besoin d'aide pour choisir?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Notre équipe est disponible 7j/7 pour vous conseiller
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+212537XXXXXX" className="group">
              <Button size="lg" className="relative bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 overflow-hidden group-hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]">
                {/* Power surge effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Phone className="w-5 h-5 mr-2 relative z-10 group-hover:animate-level-bounce" />
                <span className="relative z-10">Appeler maintenant</span>
              </Button>
            </a>
            <a href="https://wa.me/212537XXXXXX" target="_blank" rel="noopener noreferrer" className="group">
              <Button size="lg" variant="outline" className="relative border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg rounded-xl transition-all duration-300 overflow-hidden group-hover:border-[#0071E3]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0071E3]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <MessageCircle className="w-5 h-5 mr-2 relative z-10 group-hover:animate-level-bounce" />
                <span className="relative z-10">WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden">
        {/* Top CTA Section */}
        <div className="bg-gradient-to-r from-[#0071E3] to-[#0051a3] py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Besoin d'aide pour choisir ?
                </h3>
                <p className="text-white/80">
                  Nos experts sont disponibles pour vous guider vers la batterie parfaite.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:+212537XXXXXX"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0071E3] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-5 h-5" />
                  Appeler maintenant
                </a>
                <a 
                  href="https://wa.me/212537XXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20bd5a] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Footer */}
        <div className="bg-gray-900 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Column */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0071E3] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xl text-white">Batteries Chadli</span>
                    <p className="text-sm text-[#0071E3]">dima charger ⚡</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Votre partenaire de confiance pour les batteries automobiles à Kenitra. 
                  Qualité premium, installation gratuite et service impeccable.
                </p>
                {/* Social Links */}
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0071E3] hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0071E3] hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                </div>
              </div>
              
              {/* Products Column */}
              <div>
                <h4 className="font-semibold text-white mb-6 text-lg">Nos Produits</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Batteries Voitures</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Poids Lourds</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Batteries Marine</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Énergie Solaire</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Accessoires</a></li>
                </ul>
              </div>
              
              {/* Services Column */}
              <div>
                <h4 className="font-semibold text-white mb-6 text-lg">Services</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Installation Gratuite</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Diagnostic Batterie</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Reprise Éco</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Garantie Étendue</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#0071E3] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />Livraison Express</a></li>
                </ul>
              </div>
              
              {/* Contact Column */}
              <div>
                <h4 className="font-semibold text-white mb-6 text-lg">Contact</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-400">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#0071E3]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Adresse</p>
                      <p>Avenue Hassan II, Kenitra</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#0071E3]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Téléphone</p>
                      <a href="tel:+212537XXXXXX" className="hover:text-[#0071E3] transition-colors">+212 537 XX XX XX</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#0071E3]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Horaires</p>
                      <p>Lun - Sam: 8h30 - 19h00</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 text-sm">
                  © 2024 Batteries Chadli. Tous droits réservés.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-[#0071E3] transition-colors">Mentions légales</a>
                  <a href="#" className="hover:text-[#0071E3] transition-colors">Politique de confidentialité</a>
                  <a href="#" className="hover:text-[#0071E3] transition-colors">CGV</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/212537XXXXXX?text=Bonjour,%20je%20cherche%20une%20batterie%20pour%20ma%20voiture"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25"></div>
          {/* Main Button */}
          <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            <p className="text-sm font-medium text-gray-900">Besoin d'aide ?</p>
            <p className="text-xs text-gray-500">Réponse rapide sur WhatsApp</p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </div>
        </div>
      </a>

      {/* CART SIDEBAR */}
      <div className={`fixed inset-0 z-50 ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Votre Panier ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Zap className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.name} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#0071E3]/20 to-[#0071E3]/5 rounded-lg flex items-center justify-center">
                        <Zap className="w-8 h-8 text-[#0071E3]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.specs}</p>
                        <p className="font-bold text-[#0071E3] mt-1">{item.discountedPrice} DH</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-[#0071E3] transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-[#0071E3] transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#0071E3]">{cartTotal} DH</span>
                </div>
                <Button className="w-full bg-[#0071E3] hover:bg-[#0071E3]/90 text-white py-6 rounded-xl text-lg">
                  Commander maintenant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
