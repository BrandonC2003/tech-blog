"use client";

import { useEffect, useState } from "react";
import type { Titulo } from "@/lib/formato";

// Isla de cliente: IntersectionObserver es una API del navegador
export default function IndiceArticulo({ titulos }: { titulos: Titulo[] }) {
  const [activo, setActivo] = useState(titulos[0]?.id);

  useEffect(() => {
    // Marca como activo el título que cruza una franja cerca de la parte de arriba
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActivo(entrada.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    for (const { id } of titulos) {
      const elemento = document.getElementById(id);
      if (elemento) observador.observe(elemento);
    }
    return () => observador.disconnect();
  }, [titulos]);

  return (
    <nav
      aria-label="En este artículo"
      className="flex flex-col gap-3.5 rounded-[14px] border border-borde bg-superficie-2 p-[22px]"
    >
      <span className="font-mono text-xs tracking-wider text-secundario">EN ESTE ARTÍCULO</span>
      {titulos.map((t) => (
        // <a> y no <Link>: es un salto dentro de la misma página, no una navegación
        <a
          key={t.id}
          href={`#${t.id}`}
          aria-current={t.id === activo ? "location" : undefined}
          className={`text-[15px] leading-snug ${
            t.id === activo ? "text-cian" : "text-codigo hover:text-texto"
          }`}
        >
          {t.texto}
        </a>
      ))}
    </nav>
  );
}
