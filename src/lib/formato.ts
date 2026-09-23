import type { Categoria } from "./categoria";

// "2026-09-12T..." → "12 sept 2026"
export function formatearFecha(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/*
  Tailwind solo genera las clases que encuentra escritas completas en el código.
  Por eso NO se puede hacer `text-${color}`: hay que tener cada clase literal.
*/
const ESTILOS_COLOR = {
  cyan: "text-cian border-cian",
  magenta: "text-magenta-claro border-magenta",
} as const;

export function estiloCategoria(color: Categoria["color"]): string {
  return color === "magenta" ? ESTILOS_COLOR.magenta : ESTILOS_COLOR.cyan;
}
