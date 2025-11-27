import { motion, AnimatePresence } from "framer-motion";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="loading-content">
            {/* Brand Logo */}
            <motion.img 
              src="/logo.png" 
              alt="Chadli Batteries"
              className="loading-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Battery Grid Loader */}
            <div className="loader">
              <div className="cell d-0"></div>
              <div className="cell d-1"></div>
              <div className="cell d-2"></div>
              <div className="cell d-3"></div>
              <div className="cell d-4"></div>
              <div className="cell d-3"></div>
              <div className="cell d-2"></div>
              <div className="cell d-1"></div>
              <div className="cell d-0"></div>
            </div>
            
            {/* Tagline */}
            <motion.div 
              className="loading-brand"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="loading-subtitle">Dima Charger</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
