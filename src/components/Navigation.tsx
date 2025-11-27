import { ShoppingCart, Phone, Zap, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  cartItemsCount?: number;
  onCartClick?: () => void;
}

const Navigation = ({ cartItemsCount = 0, onCartClick }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-12 h-12 rounded-xl bg-[#0071E3] flex items-center justify-center shadow-lg shadow-[#0071E3]/20 group-hover:shadow-[#0071E3]/40 transition-all duration-500 group-hover:scale-105 group-hover:animate-electric-pulse">
              <Zap className="w-6 h-6 text-white fill-white group-hover:animate-lightning" />
              {/* Spark effects */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B00] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-charging-spark" />
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-charging-spark" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-gray-900">Batteries Chadli</span>
              <span className="text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase">dima charger</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#products" className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 group">
              Batteries
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0071E3] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#value-props" className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0071E3] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#" className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 group">
              À propos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0071E3] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#" className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0071E3] group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="tel:+212537XXXXXX" className="hidden sm:flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-[#0071E3]/5 border border-[#0071E3]/10 hover:border-[#0071E3]/30 transition-all duration-300 group">
              <Phone className="w-4 h-4 text-[#0071E3] group-hover:animate-pulse" />
              <span className="font-semibold text-[#0071E3]">+212 537 XX XX XX</span>
            </a>

            <button 
              onClick={onCartClick}
              className="relative p-3 bg-gray-50 hover:bg-[#0071E3]/5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#0071E3] transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#0071E3] text-white text-xs font-bold rounded-full shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 border-t border-gray-100">
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#0071E3]/5 transition-all duration-300">
              Batteries
            </a>
            <a href="#value-props" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#0071E3]/5 transition-all duration-300">
              Services
            </a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#0071E3]/5 transition-all duration-300">
              À propos
            </a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#0071E3]/5 transition-all duration-300">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
