import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import GitHubButton from "@/components/GitHubButton";
import { IconoEstrella } from "@/components/Iconos";
import PostCard from "@/components/PostCard";
import Portada from "@/components/Portada";
import { obtenerCategorias, obtenerPostsRecientes } from "@/lib/queries";
import { formatearFecha } from "@/lib/formato";
import { REPO_URL } from "@/lib/sitio";

export const revalidate = 60; // ISR: regenera la página como máximo cada 60 s

export default async function Home() {
  // Son independientes entre sí: se piden en paralelo
  const [categorias, posts] = await Promise.all([
    obtenerCategorias(),
    obtenerPostsRecientes(),
  ]);

  // El destacado va arriba; el resto forma "últimos artículos" sin repetirlo
  const destacado = posts.find((p) => p.destacado);
  const recientes = posts.filter((p) => p !== destacado);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-20">
      {/* Hero */}
      <section className="grid items-center gap-10 py-10 md:py-16 lg:grid-cols-2 lg:gap-16 lg:pb-18 lg:pt-24">
        <div className="flex flex-col gap-5 md:gap-6">
          <span className="font-mono text-xs text-cian md:text-sm">{"// blog tecnológico · open source"}</span>
          <h1 className="font-display text-[38px] font-bold leading-[1.08] md:text-5xl lg:text-[60px] lg:leading-[1.05]">
            Código, ideas y experimentos{" "}
            <span className="text-cian [text-shadow:0_0_24px_rgb(34_211_238/0.45)]">desde el servidor.</span>
          </h1>
          <p className="max-w-[540px] text-[17px] leading-[1.7] text-secundario md:text-[19px]">
            Artículos sobre desarrollo web, bases de datos y despliegue, escritos mientras aprendo y construyo.
          </p>
          <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#articulos"
              className="flex h-[52px] items-center justify-center rounded-[10px] bg-cian px-6 font-semibold text-[#041016] shadow-[0_0_28px_rgb(34_211_238/0.35)] hover:bg-cian-claro"
            >
              Leer artículos
            </a>
            <GitHubButton className="flex h-[52px] items-center justify-center gap-2.5 rounded-[10px] border border-magenta px-6 font-medium text-magenta-claro hover:bg-magenta/10">
              <IconoEstrella />
              Ver el repositorio
            </GitHubButton>
          </div>
        </div>

        {/* Ventana de "terminal": solo decorativa, se oculta en móvil */}
        <div className="hidden overflow-hidden rounded-2xl border border-borde bg-superficie-2 shadow-[0_0_60px_rgb(232_121_249/0.08)] md:block">
          <div className="flex h-11 items-center gap-2 border-b border-borde px-[18px]">
            <span className="size-[11px] rounded-full bg-borde-fuerte" />
            <span className="size-[11px] rounded-full bg-borde-fuerte" />
            <span className="size-[11px] rounded-full bg-borde-fuerte" />
            <span className="ml-3 font-mono text-xs text-secundario">estructura del proyecto</span>
          </div>
          <pre className="overflow-x-auto p-7 font-mono text-sm leading-[1.9] text-codigo lg:text-[15px]">
            {"app/\n├─ page.tsx                  "}
            <span className="text-secundario">→ /</span>
            {"\n├─ posts/\n│  └─ "}
            <span className="text-cian">[id]</span>
            {"/page.tsx         "}
            <span className="text-secundario">→ /posts/1</span>
            {"\n└─ categorias/\n   └─ "}
            <span className="text-magenta-claro">[slug]</span>
            {"/page.tsx       "}
            <span className="text-secundario">→ /categorias/nextjs</span>
          </pre>
        </div>
      </section>

      {/* Filtros */}
      <section className="flex flex-col gap-3 pb-10 md:flex-row md:items-center md:pb-14">
        <span className="font-mono text-[13px] text-secundario md:mr-2">filtrar_por:</span>
        <CategoryFilter categorias={categorias} />
      </section>

      {/* Post destacado */}
      {destacado && (
        <section className="pb-12 md:pb-18">
          <Link
            href={`/posts/${destacado.id}`}
            className="group grid overflow-hidden rounded-[18px] border border-cian bg-superficie shadow-[0_0_40px_rgb(34_211_238/0.18)] md:grid-cols-2"
          >
            <Portada imagenUrl={destacado.imagen_url} alt="" className="h-48 md:h-auto md:min-h-[360px]" />
            <div className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:p-12">
              <div className="flex items-center gap-3 font-mono text-xs md:text-[13px]">
                <span className="rounded-md bg-cian px-2.5 py-1 font-medium text-fondo">DESTACADO</span>
                <span className={destacado.categoria.color === "magenta" ? "text-magenta-claro" : "text-cian"}>
                  {destacado.categoria.nombre}
                </span>
              </div>
              <h2 className="font-display text-[28px] font-bold leading-[1.15] group-hover:text-cian lg:text-[38px]">
                {destacado.titulo}
              </h2>
              <p className="text-base leading-[1.7] text-secundario md:text-[17px]">{destacado.resumen}</p>
              <p className="text-sm text-secundario">
                {destacado.autor}
                {destacado.fecha_publicacion && <> · {formatearFecha(destacado.fecha_publicacion)}</>}
                {" · "}
                {destacado.tiempo_lectura} min de lectura
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Últimos artículos */}
      <section id="articulos" className="flex flex-col gap-6 pb-14 md:gap-8 md:pb-22">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[26px] font-semibold md:text-[32px]">Últimos artículos</h2>
          <span className="hidden font-mono text-[13px] text-secundario lg:block">
            SELECT * FROM posts ORDER BY fecha DESC
          </span>
        </div>
        {/* 1 columna en móvil, 2 en tablet, 3 en escritorio */}
        <div className="grid gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {recientes.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Open source */}
      <section className="flex flex-col gap-6 rounded-2xl border border-borde-fuerte bg-superficie-2 px-5 py-7 md:rounded-[18px] md:px-14 md:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-magenta-claro md:text-[13px]">open source</span>
          <h2 className="font-display text-2xl font-semibold md:text-[30px]">El código de este blog es público</h2>
          <p className="leading-[1.7] text-secundario">
            Hecho con Next.js (App Router), Supabase y desplegado en Vercel. Revisa el código, abre un issue o
            propón mejoras.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3.5 lg:items-end">
          <code className="break-all rounded-lg border border-borde bg-fondo px-3.5 py-2.5 font-mono text-xs text-codigo md:text-sm">
            {REPO_URL.replace("https://", "")}
          </code>
          <GitHubButton className="flex h-12 items-center justify-center rounded-[10px] bg-magenta px-[22px] font-semibold text-[#1a0520] hover:bg-magenta-claro">
            Ver repositorio
          </GitHubButton>
        </div>
      </section>
    </div>
  );
}
