/**
 * Motion System - Apple-Inspired Animation Constants
 * 
 * Principles:
 * - Motion guides, never distracts
 * - Consistent timing builds trust
 * - Subtle and "chill" - let products be the star
 */

// ═══════════════════════════════════════════════════════════════════════════
// TIMING CONSTANTS - Consistent across all animations
// ═══════════════════════════════════════════════════════════════════════════

export const duration = {
  instant: 0.1,      // Micro-feedback (button press)
  fast: 0.2,         // Quick transitions (hover states)
  normal: 0.3,       // Standard transitions
  smooth: 0.5,       // Comfortable pace (page elements)
  slow: 0.8,         // Dramatic reveals
  gentle: 1.2,       // Hero animations
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// EASING CURVES - Apple-style natural motion
// ═══════════════════════════════════════════════════════════════════════════

export const ease = {
  // Standard Apple curve - feels natural and premium
  apple: [0.25, 0.1, 0.25, 1.0],
  
  // Smooth out - gentle deceleration
  out: [0, 0, 0.2, 1],
  
  // Smooth in-out - balanced feel
  inOut: [0.4, 0, 0.2, 1],
  
  // Bounce settle - for "landing" effects
  bounce: [0.68, -0.55, 0.265, 1.55],
  
  // Elastic - subtle spring feel
  elastic: [0.175, 0.885, 0.32, 1.275],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SPRING CONFIGS - For Framer Motion spring animations
// ═══════════════════════════════════════════════════════════════════════════

export const spring = {
  // Gentle - feels floaty and premium
  gentle: { type: "spring", stiffness: 100, damping: 15 },
  
  // Snappy - responsive but not harsh
  snappy: { type: "spring", stiffness: 300, damping: 25 },
  
  // Bouncy - for playful micro-interactions
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  
  // Smooth - Apple-like fluid motion
  smooth: { type: "spring", stiffness: 200, damping: 20 },
  
  // Stiff - for quick snaps
  stiff: { type: "spring", stiffness: 500, damping: 30 },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS - Reusable motion patterns
// ═══════════════════════════════════════════════════════════════════════════

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: duration.normal, ease: ease.out },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: duration.normal, ease: ease.out },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const slideInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: duration.smooth, ease: ease.out },
};

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER CHILDREN - For list animations
// ═══════════════════════════════════════════════════════════════════════════

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: duration.smooth, ease: ease.out },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// HOVER EFFECTS - Consistent interaction states
// ═══════════════════════════════════════════════════════════════════════════

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: spring.snappy,
};

export const hoverLift = {
  whileHover: { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
  transition: { duration: duration.fast, ease: ease.out },
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 0 30px rgba(0,113,227,0.3)",
  },
  transition: { duration: duration.normal, ease: ease.out },
};

// ═══════════════════════════════════════════════════════════════════════════
// SPECIAL ANIMATIONS - Unique micro-interactions
// ═══════════════════════════════════════════════════════════════════════════

// Slot machine number flip
export const slotMachine = {
  initial: { y: 0 },
  animate: { 
    y: [0, -30, -60, -30, 0],
    transition: { 
      duration: 0.6, 
      times: [0, 0.2, 0.5, 0.8, 1],
      ease: ease.bounce,
    },
  },
};

// Flying to cart
export const flyToCart = (targetX: number, targetY: number) => ({
  animate: {
    x: targetX,
    y: targetY,
    scale: [1, 1.1, 0.3],
    opacity: [1, 1, 0],
    transition: {
      duration: 0.8,
      ease: ease.inOut,
    },
  },
});

// Bounce landing
export const bounceLand = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.3, 0.9, 1.1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.5, 0.75, 1],
    },
  },
};

// Pulse for attention (WhatsApp button)
export const gentlePulse = {
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(37, 211, 102, 0.4)",
      "0 0 0 15px rgba(37, 211, 102, 0)",
      "0 0 0 0 rgba(37, 211, 102, 0)",
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Shimmer loading effect
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "linear",
  },
};

// Progress bar fill
export const progressFill = (percentage: number) => ({
  initial: { width: "0%" },
  animate: { 
    width: `${percentage}%`,
    transition: { duration: duration.smooth, ease: ease.out },
  },
});

// Checkmark draw animation
export const checkmarkDraw = {
  initial: { pathLength: 0 },
  animate: { 
    pathLength: 1,
    transition: { duration: duration.smooth, ease: ease.out },
  },
};

// Card selection glow
export const selectionGlow = {
  initial: { boxShadow: "0 0 0 0 rgba(0,113,227,0)" },
  animate: { 
    boxShadow: "0 0 20px 5px rgba(0,113,227,0.3)",
    transition: { duration: duration.normal, ease: ease.out },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS - Viewport triggered
// ═══════════════════════════════════════════════════════════════════════════

export const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const scrollRevealLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const scrollRevealRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: duration.smooth, ease: ease.out },
};

export const scrollRevealScale = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: duration.smooth, ease: ease.out },
};

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const navUnderline = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  exit: { scaleX: 0 },
  transition: { duration: duration.fast, ease: ease.out },
};

export const headerScroll = (isScrolled: boolean) => ({
  animate: {
    backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)",
    backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
    boxShadow: isScrolled ? "0 1px 20px rgba(0,0,0,0.1)" : "0 0 0 rgba(0,0,0,0)",
  },
  transition: { duration: duration.normal, ease: ease.out },
});

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE SPECIFIC
// ═══════════════════════════════════════════════════════════════════════════

export const bottomSheet = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: spring.smooth,
};

export const slideUpPanel = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
  transition: { duration: duration.smooth, ease: ease.out },
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Delay helper for staggered animations
export const withDelay = (delay: number, variant: any) => ({
  ...variant,
  transition: { ...variant.transition, delay },
});

// Create viewport animation with custom offset
export const createScrollTrigger = (offset: string = "-100px") => ({
  viewport: { once: true, margin: offset },
});
