import CategoryChip from "./CategoryChip";
import type { Categoria } from "@/lib/categoria";

type Props = {
  categorias: Categoria[];
  slugActivo?: string; // sin slug = estamos en el inicio ("Todas")
};

export default function CategoryFilter({ categorias, slugActivo }: Props) {
  return (
    // En móvil los chips no caben: se desplazan en horizontal en vez de saltar de línea
    <nav
      aria-label="Categorías"
      className="-mx-4 flex gap-2.5 overflow-x-auto [scrollbar-width:none] px-4 pb-1 md:mx-0 md:flex-wrap md:gap-3 md:overflow-visible md:px-0"
    >
      <CategoryChip href="/" nombre="Todas" activo={!slugActivo} />
      {categorias.map((c) => (
        <CategoryChip
          key={c.id}
          href={`/categorias/${c.slug}`}
          nombre={c.nombre}
          activo={c.slug === slugActivo}
        />
      ))}
    </nav>
  );
}
