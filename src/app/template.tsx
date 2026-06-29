"use client";

import { motion, type Variants } from "framer-motion";

// Transición entre rutas (técnica ReactTricks/Framer Motion). App Router no
// soporta exit en cambio de ruta, así que animamos la ENTRADA: la página nueva
// entra con scale + slide + fade. template.tsx remonta en cada navegación.
const variants: Variants = {
  initial: { scale: 0.96, y: 30, opacity: 0 },
  enter: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96] },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="enter" variants={variants}>
      {children}
    </motion.div>
  );
}
