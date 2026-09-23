"use client";

import { useEffect, useState } from "react";

// Isla de cliente: el scroll solo existe en el navegador
export default function BarraProgreso() {
  const [progreso, setProgreso] = useState(0); // de 0 a 1

  useEffect(() => {
    const actualizar = () => {
      const recorrible = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(recorrible > 0 ? Math.min(window.scrollY / recorrible, 1) : 0);
    };
    actualizar();
    // passive: le promete al navegador que no llamaremos preventDefault → scroll más fluido
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      window.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progreso * 100)}
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-borde/60"
    >
      {/* scaleX en lugar de width: el navegador no tiene que recalcular el layout */}
      <div
        className="h-full origin-left bg-cian shadow-[0_0_12px_var(--color-cian)]"
        style={{ transform: `scaleX(${progreso})` }}
      />
    </div>
  );
}
