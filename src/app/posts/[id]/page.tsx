import Link from "next/link";
import { notFound } from "next/navigation";
import BarraProgreso from "@/components/BarraProgreso";
import GitHubButton from "@/components/GitHubButton";
import IndiceArticulo from "@/components/IndiceArticulo";
import Markdown from "@/components/Markdown";
import Portada from "@/components/Portada";
import { obtenerPostPorId, obtenerPostsDeCategoria, obtenerPostsRecientes } from "@/lib/queries";
import { estiloCategoria, extraerTitulos, formatearFecha } from "@/lib/formato";

// ISR: la página se sirve desde caché y se regenera como máximo cada 60 s
export const revalidate = 60;

// Sin esta función la ruta es SSR (se renderiza en cada visita) y `revalidate` no tiene efecto.
// Aquí se generan en el build los posts publicados; uno nuevo se genera en su primera visita.
export async function generateStaticParams() {
  const posts = await obtenerPostsRecientes();
  return posts.map((post) => ({ id: String(post.id) })); // los params siempre son texto
}

export default async function PostPage(props: PageProps<"/posts/[id]">) {
  // `params` es una Promesa y su valor siempre llega como texto
  const { id } = await props.params;
  const postId = Number(id);

  // "/posts/abc" o "/posts/-1": ni siquiera vale la pena consultar
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  // null si no existe o si es un borrador
  const post = await obtenerPostPorId(postId);
  if (!post) notFound();

  // Depende de post.categoria_id, por eso va después de obtener el post
  const relacionados = await obtenerPostsDeCategoria(post.categoria_id, post.id);

  const fecha = formatearFecha(post.fecha_publicacion);
  const titulos = extraerTitulos(post.contenido); // se calcula en el servidor; la isla solo resalta
  const iniciales = post.autor
    .split(" ")
    .map((palabra) => palabra[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    // Columna central de 1040px; dentro, el texto a ~700px y una barra lateral en escritorio
    <div className="mx-auto max-w-[1040px] px-4 md:px-8 lg:px-0">
      <BarraProgreso />
      <article className="flex flex-col gap-8 pt-7 md:gap-10 md:pt-14">
        <header className="flex flex-col gap-5 md:gap-[22px]">
          <Link
            href={`/categorias/${post.categoria.slug}`}
            className="hidden font-mono text-sm text-secundario hover:text-texto md:block"
          >
            ← volver a {post.categoria.nombre}
          </Link>
          <Link
            href={`/categorias/${post.categoria.slug}`}
            className={`self-start rounded-md border px-3 py-1 font-mono text-xs md:text-[13px] ${estiloCategoria(post.categoria.color)}`}
          >
            {post.categoria.nombre}
          </Link>
          <h1 className="font-display text-[32px] font-bold leading-[1.12] md:text-[44px] lg:text-[54px] lg:leading-[1.1]">
            {post.titulo}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-sm text-secundario md:text-[15px]">
            <span className="hidden size-10 items-center justify-center rounded-full border border-magenta font-mono text-[13px] text-magenta-claro md:flex">
              {iniciales}
            </span>
            <span className="font-medium text-texto">{post.autor}</span>
            {fecha && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={post.fecha_publicacion ?? undefined}>{fecha}</time>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.tiempo_lectura} min de lectura</span>
          </div>
        </header>

        <Portada
          imagenUrl={post.imagen_url}
          alt={post.titulo}
          className="h-[210px] rounded-[14px] border border-borde md:h-[340px] lg:h-[440px] lg:rounded-[18px]"
        />

        <div className="grid gap-10 lg:grid-cols-[700px_260px] lg:gap-20">
          <Markdown contenido={post.contenido} />

          <aside className="flex flex-col gap-7 lg:sticky lg:top-28 lg:self-start">
            {/* El índice solo en escritorio: en móvil ocuparía demasiado antes del contenido */}
            {titulos.length > 0 && (
              <div className="hidden lg:block">
                <IndiceArticulo titulos={titulos} />
              </div>
            )}
            <div className="flex flex-col gap-3 rounded-[14px] border border-borde p-[22px]">
              <span className="font-mono text-xs tracking-wider text-secundario">¿ERRORES O IDEAS?</span>
              {/* Los artículos viven en Supabase, no en el repositorio: se invita a reportar, no a editar */}
              <p className="text-sm leading-relaxed text-secundario">
                Si encuentras un error en este artículo o tienes una sugerencia, cuéntamelo abriendo un issue
                en GitHub.
              </p>
              {/* ?title= rellena el título del issue con el nombre del artículo */}
              <GitHubButton
                ruta={`/issues/new?title=${encodeURIComponent(`Sobre el artículo: ${post.titulo}`)}`}
                className="font-mono text-sm text-magenta-claro hover:text-magenta"
              >
                Reportar en GitHub →
              </GitHubButton>
            </div>
          </aside>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section className="mt-12 flex flex-col gap-4 border-t border-borde pt-7 md:mt-18 md:gap-6 md:pt-12">
          <h2 className="font-display text-[21px] font-semibold md:text-[26px]">
            Más de {post.categoria.nombre}
          </h2>
          <div className="grid gap-3.5 md:grid-cols-2 md:gap-6">
            {relacionados.slice(0, 4).map((r) => (
              <Link
                key={r.id}
                href={`/posts/${r.id}`}
                className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-[18px] hover:border-cian md:rounded-[14px] md:p-6"
              >
                <span className="font-mono text-xs text-secundario">
                  {formatearFecha(r.fecha_publicacion)} · {r.tiempo_lectura} min
                </span>
                <span className="font-display text-lg font-semibold md:text-[21px]">{r.titulo}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
