"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { REPO_URL } from "@/lib/sitio";

type Props = {
  // Las categorías llegan como props desde el Header (Server Component).
  // Así esta isla no consulta Supabase: solo se encarga de abrir y cerrar.
  categorias: { slug: string; nombre: string }[];
};

// Isla de cliente: necesita estado (abierto/cerrado) y eventos (clic, tecla Escape)
export default function MenuMovil({ categorias }: Props) {
  const [abierto, setAbierto] = useState(false);

  // Escape cierra el menú. El listener solo existe mientras está abierto,
  // y la función de limpieza lo quita al cerrarse.
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        className="flex size-11 items-center justify-center text-texto"
      >
        <svg className="size-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {abierto ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h10" />
            </>
          )}
        </svg>
      </button>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Menú principal"
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-borde bg-fondo px-4 pb-6 pt-3 shadow-[0_16px_32px_rgb(0_0_0/0.5)]"
        >
          {/* Cada enlace cierra el menú: al navegar, el Header no se vuelve a montar */}
          <Link href="/" onClick={cerrar} className="flex h-11 items-center text-texto">
            Inicio
          </Link>
          <span className="mt-3 font-mono text-xs text-secundario">categorias/</span>
          {categorias.map((c) => (
            <Link
              key={c.slug}
              href={`/categorias/${c.slug}`}
              onClick={cerrar}
              className="flex h-11 items-center pl-3 text-codigo hover:text-cian"
            >
              {c.nombre}
            </Link>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-12 items-center justify-center rounded-[10px] border border-magenta text-magenta-claro"
          >
            Ver el repositorio
          </a>
        </nav>
      )}
    </div>
  );
}
