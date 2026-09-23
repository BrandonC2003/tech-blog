import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryFilter from "@/components/CategoryFilter";
import Portada from "@/components/Portada";
import {
  obtenerCategoriaPorSlug,
  obtenerCategorias,
  obtenerPostsDeCategoria,
} from "@/lib/queries";
import { formatearFecha } from "@/lib/formato";

// ISR: la página se sirve desde caché y se regenera como máximo cada 60 s
export const revalidate = 60;

// Se generan en el build todas las categorías (incluso las vacías, que muestran su estado vacío)
export async function generateStaticParams() {
  const categorias = await obtenerCategorias();
  return categorias.map((c) => ({ slug: c.slug }));
}

export default async function CategoriaPage(props: PageProps<"/categorias/[slug]">) {
  const { slug } = await props.params;

  // La lista de categorías no depende del slug: se pide en paralelo
  const [categoria, categorias] = await Promise.all([
    obtenerCategoriaPorSlug(slug),
    obtenerCategorias(),
  ]);
  if (!categoria) notFound();

  const posts = await obtenerPostsDeCategoria(categoria.id);
  const esMagenta = categoria.color === "magenta";

  return (
    <>
      {/* Encabezado de la categoría */}
      <section className="border-b border-borde bg-grid">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 md:px-8 md:py-14 lg:px-20">
          <nav aria-label="Ruta de navegación" className="flex gap-2.5 font-mono text-xs text-secundario md:text-sm">
            <Link href="/" className="hover:text-texto">inicio</Link>
            <span>/</span>
            <span>categorias</span>
            <span>/</span>
            <span className={esMagenta ? "text-magenta-claro" : "text-cian"}>{categoria.slug}</span>
          </nav>
          <div className="flex items-end justify-between gap-6 md:gap-10">
            <div className="flex max-w-[760px] flex-col gap-3.5">
              <h1
                className={`font-display text-[40px] font-bold leading-none md:text-[64px] ${
                  esMagenta
                    ? "text-magenta-claro [text-shadow:0_0_28px_rgb(232_121_249/0.4)]"
                    : "text-cian [text-shadow:0_0_28px_rgb(34_211_238/0.4)]"
                }`}
              >
                {categoria.nombre}
              </h1>
              <p className="leading-[1.7] text-codigo md:text-lg">{categoria.descripcion}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5 font-mono">
              <span className="text-3xl font-medium md:text-[44px]">{posts.length}</span>
              <span className="text-xs text-secundario md:text-[13px]">
                {posts.length === 1 ? "artículo" : "artículos"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-20">
        <div className="border-b border-borde py-6 md:py-8">
          <CategoryFilter categorias={categorias} slugActivo={categoria.slug} />
        </div>

        <section className="flex flex-col gap-5 py-8 md:py-12">
          {posts.length === 0 ? (
            // Estado vacío: la categoría existe pero no tiene posts publicados
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-borde-fuerte px-6 py-16 text-center">
              <span className="font-mono text-sm text-secundario">SELECT * FROM posts → 0 filas</span>
              <p className="font-display text-2xl font-semibold">Todavía no hay artículos aquí</p>
              <p className="max-w-md text-secundario">
                Aún no se ha publicado nada en {categoria.nombre}. Mientras tanto, puedes explorar otras categorías.
              </p>
              <Link href="/" className="mt-2 font-mono text-sm text-cian hover:text-cian-claro">
                ← volver al inicio
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group grid gap-4 rounded-2xl border border-borde bg-superficie p-4 transition-colors hover:border-cian md:grid-cols-[220px_minmax(0,1fr)] md:items-center md:gap-8 md:p-5 lg:grid-cols-[280px_minmax(0,1fr)_140px]"
              >
                <Portada imagenUrl={post.imagen_url} alt="" className="h-36 rounded-[10px] md:h-40" />
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-xs text-cian md:text-[13px]">/posts/{post.id}</span>
                  <h2 className="font-display text-[22px] font-semibold leading-tight group-hover:text-cian md:text-[26px]">
                    {post.titulo}
                  </h2>
                  <p className="leading-relaxed text-secundario">{post.resumen}</p>
                  {/* En móvil y tablet la fecha va aquí; en escritorio en su propia columna */}
                  <p className="font-mono text-xs text-secundario lg:hidden">
                    {formatearFecha(post.fecha_publicacion)} · {post.tiempo_lectura} min
                  </p>
                </div>
                <div className="hidden flex-col items-end gap-2 font-mono text-[13px] text-secundario lg:flex">
                  <span>{formatearFecha(post.fecha_publicacion)}</span>
                  <span>{post.tiempo_lectura} min</span>
                  <span className="text-xl text-cian">→</span>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </>
  );
}
