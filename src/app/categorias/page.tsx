import Link from "next/link";
import IndicadorCarga from "@/components/IndicadorCarga";
import { obtenerCategorias, obtenerPostsRecientes } from "@/lib/queries";

// Ruta estática con ISR, igual que el inicio
export const revalidate = 60;

export default async function CategoriasPage() {
  // Reutiliza consultas que ya existen (y que `cache` comparte con el Header)
  const [categorias, posts] = await Promise.all([obtenerCategorias(), obtenerPostsRecientes()]);

  // Cuántos posts publicados tiene cada categoría: { 1: 4, 2: 2, ... }
  const conteo = new Map<number, number>();
  for (const post of posts) conteo.set(post.categoria_id, (conteo.get(post.categoria_id) ?? 0) + 1);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-20">
      <section className="flex flex-col gap-4 py-10 md:py-14">
        <nav aria-label="Ruta de navegación" className="flex gap-2.5 font-mono text-xs text-secundario md:text-sm">
          <Link href="/" className="hover:text-texto">inicio</Link>
          <span>/</span>
          <span className="text-cian">categorias</span>
        </nav>
        <h1 className="font-display text-[40px] font-bold leading-none md:text-[64px]">Categorías</h1>
        <p className="max-w-2xl leading-[1.7] text-secundario md:text-lg">
          Cada categoría es una ruta dinámica: <code className="font-mono text-cian">/categorias/[slug]</code>.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((c) => {
          const total = conteo.get(c.id) ?? 0;
          const esMagenta = c.color === "magenta";
          return (
            <Link
              key={c.id}
              href={`/categorias/${c.slug}`}
              className={`group flex flex-col gap-3 rounded-2xl border border-borde bg-superficie p-6 transition-colors ${
                esMagenta ? "hover:border-magenta" : "hover:border-cian"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  className={`font-display text-2xl font-semibold ${
                    esMagenta ? "text-magenta-claro" : "text-cian"
                  }`}
                >
                  {c.nombre}
                </h2>
                <span className="flex items-center gap-2 font-mono text-xs text-secundario">
                  <IndicadorCarga />
                  {total} {total === 1 ? "artículo" : "artículos"}
                </span>
              </div>
              <p className="leading-relaxed text-secundario">{c.descripcion}</p>
              <span className="mt-auto font-mono text-xs text-secundario group-hover:text-texto">
                /categorias/{c.slug} →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
