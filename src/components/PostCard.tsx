import Link from "next/link";
import IndicadorCarga from "./IndicadorCarga";
import Portada from "./Portada";
import type { PostResumen } from "@/lib/queries";
import { estiloCategoria, formatearFecha } from "@/lib/formato";

export default function PostCard({ post }: { post: PostResumen }) {
  const fecha = formatearFecha(post.fecha_publicacion);

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-superficie transition-colors hover:border-cian"
    >
      <Portada imagenUrl={post.imagen_url} alt="" className="h-[150px] md:h-[170px]">
        <span className={`rounded-md border bg-fondo px-2.5 py-1 font-mono text-xs ${estiloCategoria(post.categoria.color)}`}>
          {post.categoria.nombre}
        </span>
      </Portada>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <h3 className="font-display text-[21px] font-semibold leading-tight group-hover:text-cian md:text-[22px]">
          {post.titulo}
        </h3>
        <p className="flex-1 text-[15px] leading-relaxed text-secundario">{post.resumen}</p>
        <p className="font-mono text-xs text-secundario md:text-[13px]">
          {fecha && <>{fecha} · </>}
          {post.tiempo_lectura} min <IndicadorCarga />
        </p>
      </div>
    </Link>
  );
}
