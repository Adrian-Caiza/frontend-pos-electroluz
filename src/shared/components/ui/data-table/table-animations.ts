import type { Variants } from "framer-motion"

// Variantes para el contenedor de las filas (tbody)
export const tableBodyVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Variantes para cada fila (tr)
export const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for a snappier feel
    }
  },
  exit: { 
    opacity: 0, 
    x: -40, 
    height: 0,
    transition: {
      duration: 0.3,
    }
  },
}

// Variantes para el contenedor de la cabecera (thead)
export const tableHeaderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Variantes para cada cabecera (th)
export const tableHeadVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    }
  },
}
