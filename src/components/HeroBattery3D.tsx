import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface HeroBattery3DProps {
  scrollProgress?: number;
}

const HeroBattery3D = ({ scrollProgress = 0 }: HeroBattery3DProps) => {
  const rotateY = scrollProgress * 25; // Rotate up to 25 degrees on scroll
  const rotateX = scrollProgress * -10;
  const scale = 1 + scrollProgress * 0.1;
  
  // Glowing core intensity based on scroll
  const glowIntensity = 0.3 + scrollProgress * 0.7;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -20 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Glow effect behind battery */}
        <div 
          className="absolute inset-0 blur-3xl rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(0,113,227,${glowIntensity * 0.4}) 0%, rgba(34,197,94,${glowIntensity * 0.2}) 50%, transparent 70%)`,
            transform: "scale(1.5) translateZ(-50px)",
          }}
        />
        
        {/* Main Battery SVG - Premium 3D look */}
        <svg 
          viewBox="0 0 200 120" 
          className="w-full h-auto drop-shadow-2xl"
          style={{ filter: `drop-shadow(0 25px 50px rgba(0,0,0,0.25))` }}
        >
          <defs>
            {/* Battery body gradient - metallic look */}
            <linearGradient id="batteryBody3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d3748" />
              <stop offset="15%" stopColor="#4a5568" />
              <stop offset="50%" stopColor="#2d3748" />
              <stop offset="85%" stopColor="#1a202c" />
              <stop offset="100%" stopColor="#171923" />
            </linearGradient>
            
            {/* Top surface gradient */}
            <linearGradient id="batteryTop3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="50%" stopColor="#718096" />
              <stop offset="100%" stopColor="#4a5568" />
            </linearGradient>
            
            {/* Glowing core gradient */}
            <radialGradient id="glowCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={glowIntensity} />
              <stop offset="40%" stopColor="#0071E3" stopOpacity={glowIntensity * 0.7} />
              <stop offset="100%" stopColor="#0071E3" stopOpacity="0" />
            </radialGradient>
            
            {/* Energy pulse */}
            <radialGradient id="energyPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
            
            {/* Reflection gradient */}
            <linearGradient id="reflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="50%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Battery shadow */}
          <ellipse cx="100" cy="115" rx="70" ry="8" fill="rgba(0,0,0,0.2)" />
          
          {/* Main battery body */}
          <rect x="20" y="25" width="150" height="80" rx="8" fill="url(#batteryBody3D)" />
          
          {/* Top edge highlight */}
          <rect x="20" y="25" width="150" height="3" rx="2" fill="url(#batteryTop3D)" opacity="0.8" />
          
          {/* Battery terminal positive */}
          <g>
            <rect x="175" y="45" width="18" height="30" rx="3" fill="#374151" />
            <rect x="177" y="47" width="14" height="26" rx="2" fill="#4b5563" />
            <rect x="179" y="49" width="10" height="22" rx="1" fill="#6b7280" />
          </g>
          
          {/* Positive terminal cap */}
          <rect x="35" y="30" width="25" height="12" rx="2" fill="#dc2626" />
          <text x="47.5" y="40" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">+</text>
          
          {/* Negative terminal cap */}
          <rect x="130" y="30" width="25" height="12" rx="2" fill="#1f2937" />
          <text x="142.5" y="40" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">−</text>
          
          {/* Inner energy core (visible through translucent case) */}
          <rect x="30" y="50" width="130" height="45" rx="4" fill="rgba(0,0,0,0.3)" />
          
          {/* Glowing energy inside */}
          <rect x="35" y="55" width="120" height="35" rx="3" fill="url(#glowCore)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </rect>
          
          {/* Energy cells */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect 
                x={40 + i * 19} 
                y="58" 
                width="15" 
                height="29" 
                rx="2" 
                fill={`rgba(34, 197, 94, ${0.3 + (i * 0.1)})`}
                style={{
                  animation: `cellPulse ${1.5 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
              {/* Cell energy level */}
              <rect 
                x={42 + i * 19} 
                y={60 + (25 - (5 + i * 4))} 
                width="11" 
                height={5 + i * 4} 
                rx="1" 
                fill="#22c55e"
                opacity={0.6 + i * 0.07}
              >
                <animate 
                  attributeName="height" 
                  values={`${5 + i * 4};${8 + i * 4};${5 + i * 4}`} 
                  dur={`${1 + i * 0.3}s`} 
                  repeatCount="indefinite" 
                />
              </rect>
            </g>
          ))}
          
          {/* Brand label area */}
          <rect x="55" y="70" width="80" height="18" rx="2" fill="rgba(255,255,255,0.1)" />
          <text x="95" y="83" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.9">
            CHADLI
          </text>
          
          {/* Voltage indicator */}
          <text x="95" y="97" fill="#22c55e" fontSize="8" fontWeight="bold" textAnchor="middle">
            12V • 70Ah • 640A
          </text>
          
          {/* Reflection overlay */}
          <rect x="20" y="25" width="150" height="40" rx="8" fill="url(#reflection)" />
          
          {/* Animated energy flow lines */}
          <g opacity="0.6">
            <line x1="40" y1="75" x2="150" y2="75" stroke="#22c55e" strokeWidth="1" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
            </line>
            <line x1="40" y1="80" x2="150" y2="80" stroke="#0071E3" strokeWidth="1" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
            </line>
          </g>
        </svg>
        
        {/* Floating particles around battery */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "#0071E3" : "#22c55e",
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 45}%`,
                boxShadow: `0 0 10px ${i % 2 === 0 ? "#0071E3" : "#22c55e"}`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroBattery3D;
