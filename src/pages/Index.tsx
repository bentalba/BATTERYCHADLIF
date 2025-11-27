import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import BatteryFinder from "@/components/BatteryFinder";
import ValueCard from "@/components/ValueCard";
import ProductCardPremium from "@/components/ProductCardPremium";
import EmergencyBar from "@/components/EmergencyBar";
import MobileStickyBar from "@/components/MobileStickyBar";
import HeroBattery3D from "@/components/HeroBattery3D";
import WhatsAppButton from "@/components/WhatsAppButton";
import LiveActivityCounter from "@/components/LiveActivityCounter";
import LogoLoop from "@/components/LogoLoop";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { duration, ease, spring, scrollReveal } from "@/lib/motion";
import { Wrench, Recycle, Truck, Phone, MessageCircle, ChevronDown, ChevronRight, Zap, MapPin, X, Plus, Minus, Star, Clock, Shield, Award, Battery, ArrowRight } from "lucide-react";
import { products, getBestSellers, getProductsByCategory, getBatteryImage, type Product } from "@/data/products";

// Brand logos for the animated loop
const brandLogos = [
  { src: "/logos/varta.png", alt: "VARTA", title: "VARTA" },
  { src: "/logos/exide.jpeg", alt: "EXIDE", title: "EXIDE" },
  { src: "/logos/bosch.jpg", alt: "BOSCH", title: "BOSCH" },
  { src: "/logos/tudor.png", alt: "TUDOR", title: "TUDOR" },
  { src: "/logos/electra.png", alt: "ELECTRA", title: "ELECTRA" },
  { src: "/logos/alma.jpeg", alt: "ALMA", title: "ALMA" },
];

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
  const { toast } = useToast();

  // Live activity notifications - Social proof
  useEffect(() => {
    const cities = ["Centre Ville", "Bir Rami", "Maamora", "Saknia", "Mehdia", "Ouled Oujih"];
    const batteries = ["VARTA E13", "EXIDE EK700 AGM", "TUDOR TC700", "BOSCH S5", "FULMEN FC700"];
    const actions = [
      { text: "vient de commander", icon: "🛒" },
      { text: "a reçu sa batterie", icon: "✅" },
      { text: "a demandé un dépannage", icon: "🚗" },
      { text: "vient d'être installé", icon: "🔧" },
    ];
    
    // First toast after 8 seconds
    const initialTimeout = setTimeout(() => {
      showRandomToast();
    }, 8000);

    // Then every 20-35 seconds randomly
    const interval = setInterval(() => {
      showRandomToast();
    }, 20000 + Math.random() * 15000);

    function showRandomToast() {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomBattery = batteries[Math.floor(Math.random() * batteries.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const minutesAgo = Math.floor(Math.random() * 10) + 1;
      
      toast({
        description: (
          <div className="flex items-center gap-3">
            <span className="text-lg">{randomAction.icon}</span>
            <div>
              <p className="font-medium text-gray-900">
                Client à <span className="text-[#0071E3]">{randomCity}</span>
              </p>
              <p className="text-sm text-gray-500">
                {randomAction.text} une {randomBattery} · il y a {minutesAgo} min
              </p>
            </div>
          </div>
        ),
        duration: 5000,
        className: "bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl"
      });
    }

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [toast]);

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
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Emergency SOS Bar - Top priority for stranded users */}
      <EmergencyBar />
      
      <Navigation
        cartItemsCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - "WOW" Premium Design 
          Inspired by Apple's product pages with 3D floating battery
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-20">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,113,227,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,rgba(34,197,94,0.1),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_0%_50%,rgba(255,107,0,0.08),transparent)]" />
        </div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, #000 1px, transparent 1px),
              linear-gradient(180deg, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Floating orbs */}
        <motion.div 
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)' }}
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 right-[15%] w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)' }}
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)]">
            
            {/* LEFT SIDE - Content */}
            <motion.div 
              className="space-y-8 text-center lg:text-left order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Trust badge */}
              <motion.div 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex -space-x-2">
                  {['K', 'M', 'S', 'A'].map((letter, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0071E3] to-[#00a8ff] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  <span className="text-[#0071E3]">10 000+</span> clients
                </span>
              </motion.div>

              {/* Main headline */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <span className="text-gray-900">L'énergie qui</span>
                  <br />
                  <span className="relative">
                    <span className="bg-gradient-to-r from-[#0071E3] via-[#00a8ff] to-[#0071E3] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      vous fait avancer
                    </span>
                    {/* Underline accent */}
                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none">
                      <motion.path 
                        d="M2 10C50 4 100 4 150 6C200 8 250 4 298 8" 
                        stroke="url(#underlineGrad)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                      />
                      <defs>
                        <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0071E3" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-500 max-w-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Batteries premium à <span className="text-gray-900 font-semibold">Kenitra</span>. 
                  Installation gratuite, livraison en 2h, garantie 2 ans.
                </motion.p>
              </div>

              {/* Value props row */}
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: Truck, text: "Livraison 2h", color: "text-[#0071E3]" },
                  { icon: Wrench, text: "Installation offerte", color: "text-green-500" },
                  { icon: Shield, text: "Garantie 2 ans", color: "text-orange-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Trade-in highlight */}
              <motion.div 
                className="inline-flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-600">-200 DH</div>
                  <div className="text-sm text-gray-600">Reprise de votre ancienne batterie</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button 
                  className="btn-voir-batteries"
                  onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Battery className="w-5 h-5" />
                  Voir les batteries
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  className="btn-trouver-batterie"
                  onClick={() => document.querySelector('.battery-finder')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="circle">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Trouver ma batterie</span>
                </button>
              </motion.div>

              {/* Live activity counter */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex justify-center lg:justify-start"
              >
                <LiveActivityCounter />
              </motion.div>
            </motion.div>

            {/* RIGHT SIDE - 3D Battery */}
            <motion.div 
              className="relative order-1 lg:order-2 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Glow behind battery */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120%] h-[120%] bg-gradient-to-br from-[#0071E3]/20 via-[#00a8ff]/10 to-[#22c55e]/20 rounded-full blur-3xl animate-pulse-subtle" />
              </div>
              
              {/* 3D Battery */}
              <div className="relative w-full max-w-lg">
                <HeroBattery3D scrollProgress={scrollY / 500} />
              </div>
              
              {/* Floating specs cards */}
              <motion.div 
                className="absolute -left-4 top-1/4 p-3 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-xs text-gray-500">Voltage</div>
                <div className="text-lg font-bold text-gray-900">12V</div>
              </motion.div>
              
              <motion.div 
                className="absolute -right-4 top-1/3 p-3 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="text-xs text-gray-500">Capacité</div>
                <div className="text-lg font-bold text-[#0071E3]">70Ah</div>
              </motion.div>
              
              <motion.div 
                className="absolute left-1/4 -bottom-4 p-3 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="text-xs text-gray-500">Courant</div>
                <div className="text-lg font-bold text-green-500">640A</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={() => document.getElementById('value-props')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          BATTERY FINDER SECTION - Glass morphism floating widget
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 battery-finder">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trouvez votre batterie en <span className="text-[#0071E3]">30 secondes</span>
            </h2>
            <p className="text-lg text-gray-500">
              Sélectionnez votre véhicule et découvrez la batterie parfaite
            </p>
          </motion.div>
          
          <BatteryFinder />
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
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* More Products Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {getProductsByCategory('voiture').slice(5, 9).map((product) => (
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

      {/* TRUSTED BRANDS SECTION - LogoLoop Animation */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white border-y border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-[#0071E3] uppercase tracking-widest">Nos Partenaires</span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              VARTA • EXIDE • BOSCH • TUDOR • ELECTRA • ALMA
            </h3>
            <p className="text-gray-500 mt-2">Distributeur officiel des marques leaders au Maroc</p>
          </div>
          
          <div className="h-24 relative">
            <LogoLoop
              logos={brandLogos}
              speed={50}
              direction="left"
              logoHeight={64}
              gap={60}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="rgb(249, 250, 251)"
              ariaLabel="Nos marques partenaires"
            />
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
                src="/products/poids-lourd.jpg" 
                alt="Batteries Poids Lourds"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

      {/* FAQ SECTION */}
      <FAQSection />

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

      {/* VALUE PROPOSITIONS - Why Choose Us */}
      <section id="value-props" className="py-24 bg-white">
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

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyBar />
    </div>
  );
};

export default Index;
