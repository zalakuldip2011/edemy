/**
 * Reusable Framer Motion Animation Variants
 * Use these variants across the app for consistent animations
 */

// Fade In animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4 }
};

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 }
};

export const scaleUp = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
  transition: { type: "spring", stiffness: 200, damping: 20 }
};

// Slide animations
export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: { type: "spring", stiffness: 100, damping: 20 }
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { type: "spring", stiffness: 100, damping: 20 }
};

export const slideInUp = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 },
  transition: { type: "spring", stiffness: 100, damping: 20 }
};

export const slideInDown = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
  transition: { type: "spring", stiffness: 100, damping: 20 }
};

// Stagger children animation
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4, ease: "easeInOut" }
};

// Hover effects
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

export const hoverLift = {
  whileHover: { y: -5, transition: { duration: 0.2 } },
  whileTap: { y: 0 }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 10px 40px rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3 }
  }
};

// Rotate animations
export const rotate = {
  whileHover: { rotate: 360 },
  transition: { duration: 0.5 }
};

export const rotateScale = {
  whileHover: { rotate: 5, scale: 1.1 },
  transition: { type: "spring", stiffness: 300 }
};

// Bounce animation
export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Loading spinner
export const spinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Card flip animation
export const flipCard = {
  initial: { rotateY: 0 },
  animate: { rotateY: 180 },
  transition: { duration: 0.6 }
};

// Viewport scroll animations (for whileInView)
export const viewportFadeIn = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6 }
};

export const viewportSlideIn = {
  initial: { opacity: 0, x: -100 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6 }
};

export const viewportScale = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6 }
};

// Modal/Dialog animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { type: "spring", duration: 0.4, bounce: 0.3 }
};

// Notification toast animations
export const toastSlideIn = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
  transition: { type: "spring", stiffness: 200, damping: 25 }
};

// Number counter animation (for stats)
export const counterAnimation = (from, to, duration = 2) => ({
  initial: { value: from },
  animate: { value: to },
  transition: { duration, ease: "easeOut" }
});

// Gradient animation
export const gradientShift = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Shake animation (for errors)
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

// Success checkmark animation
export const checkmark = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 0.5, ease: "easeInOut" }
};

// Typing indicator dots
export const typingDot = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay
    }
  }
});

// Progress bar animation
export const progressBar = (width) => ({
  initial: { width: 0 },
  animate: { width: `${width}%` },
  transition: { duration: 1, ease: "easeOut" }
});
