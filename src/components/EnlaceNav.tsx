"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import IndicadorCarga from "./IndicadorCarga";

// Isla de cliente: usePathname lee la URL actual en el navegador para marcar el enlace activo
export default function EnlaceNav({ href, children }: { href: string; children: ReactNode }) {
  const ruta = usePathname();
  // "/categorias" también queda activo dentro de "/categorias/nextjs"
  const activo = ruta === href || ruta.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`hidden items-center gap-2 text-[15px] md:flex ${
        activo ? "text-texto" : "text-secundario hover:text-texto"
      }`}
    >
      {children}
      <IndicadorCarga />
    </Link>
  );
}
