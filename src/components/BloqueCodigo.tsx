"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
  Isla de cliente: el portapapeles y el clic solo existen en el navegador.
  Recibe `children` ya renderizados por el servidor (el código que armó
  react-markdown): un Client Component puede envolver contenido del servidor.
*/
export default function BloqueCodigo({ children }: { children: ReactNode }) {
  const pre = useRef<HTMLPreElement>(null);
  const [copiado, setCopiado] = useState(false);

  // Vuelve a "Copiar" después de 2 s; la limpieza evita el timer si el componente desaparece
  useEffect(() => {
    if (!copiado) return;
    const timer = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(timer);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pre.current?.textContent ?? "");
      setCopiado(true);
    } catch {
      // Sin permiso para el portapapeles (o sin HTTPS): no hacemos nada
    }
  }

  return (
    <div className="relative">
      <pre
        ref={pre}
        className="overflow-x-auto rounded-xl border border-borde bg-superficie-2 p-5 pr-24 font-mono text-[13px] leading-loose text-codigo md:px-7 md:pr-24 md:text-[15px] [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em] [&_code]:text-inherit"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={copiar}
        className="absolute right-3 top-3 h-8 rounded-md border border-borde-fuerte bg-fondo px-3 font-mono text-xs text-secundario hover:border-cian hover:text-cian"
      >
        {/* aria-live anuncia el cambio a lectores de pantalla */}
        <span aria-live="polite">{copiado ? "¡Copiado!" : "Copiar"}</span>
      </button>
    </div>
  );
}
