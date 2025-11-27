import { ShoppingCart, Phone, Zap, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { duration, ease, spring } from "@/lib/motion";

interface NavigationProps {
  cartItemsCount?: number;
  onCartClick?: () => void;
}

const Navigation = ({ cartItemsCount = 0, onCartClick }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [cartBounce, setCartBounce] = useState(false);

  // Track scroll for header opacity transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bounce cart when items change
  useEffect(() => {
    if (cartItemsCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  const navLinks = [
    { href: '#products', label: 'Batteries' },
    { href: '#value-props', label: 'Services' },
    { href: '#faq', label: 'FAQ' },
    { href: '#', label: 'Contact' },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: duration.smooth, ease: ease.out }}
    >
      {/* Background with scroll-based opacity */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
          backdropFilter: isScrolled ? "blur(20px)" : "blur(12px)",
          borderBottomColor: isScrolled ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.03)",
        }}
        transition={{ duration: duration.normal, ease: ease.out }}
        style={{ borderBottom: '1px solid' }}
      />
      
      {/* Shadow on scroll */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: isScrolled 
            ? "0 4px 30px rgba(0,0,0,0.08)" 
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: duration.normal }}
      />

      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a 
            href="#"
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="/logo.png" 
              alt="Chadli Batteries" 
              className="h-14 w-auto object-contain"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link, index) => (
              <motion.a 
                key={link.href + index}
                href={link.href} 
                className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                onHoverStart={() => setActiveLink(link.label)}
                onHoverEnd={() => setActiveLink(null)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.label}
                {/* Animated underline */}
                <AnimatePresence>
                  {activeLink === link.label && (
                    <motion.span 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071E3] rounded-full"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0, originX: 1 }}
                      transition={{ duration: duration.fast, ease: ease.out }}
                    />
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Phone CTA */}
            <motion.a 
              href="tel:+212537XXXXXX" 
              className="hidden sm:flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-[#0071E3]/5 border border-[#0071E3]/10 transition-colors duration-200 group"
              whileHover={{ 
                backgroundColor: "rgba(0,113,227,0.1)",
                borderColor: "rgba(0,113,227,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Phone className="w-4 h-4 text-[#0071E3]" />
              </motion.div>
              <span className="font-semibold text-[#0071E3]">+212 537 XX XX XX</span>
            </motion.a>

            {/* Cart Button */}
            <motion.button 
              onClick={onCartClick}
              className="relative p-3 bg-gray-50 hover:bg-[#0071E3]/5 rounded-xl transition-colors duration-200 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={cartBounce ? { scale: [1, 1.2, 1] } : {}}
              transition={spring.snappy}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#0071E3] transition-colors" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#0071E3] text-white text-xs font-bold rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={spring.bouncy}
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: duration.fast }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: duration.fast }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="lg:hidden overflow-hidden border-t border-gray-100"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: duration.normal, ease: ease.out }}
            >
              <motion.div 
                className="py-4 space-y-1"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.05 } },
                  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
                }}
              >
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={link.href + index}
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#0071E3]/5 transition-colors"
                    variants={{
                      open: { x: 0, opacity: 1 },
                      closed: { x: -20, opacity: 0 }
                    }}
                    transition={{ duration: duration.fast }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
