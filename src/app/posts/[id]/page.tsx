import { notFound } from "next/navigation";
import { obtenerPostPorId } from "@/lib/queries";

export const revalidate = 60;

export default async function PostPage(props: PageProps<"/posts/[id]">) {
  // `params` es una Promesa y su valor siempre llega como texto
  const { id } = await props.params;
  const postId = Number(id);

  // "/posts/abc" o "/posts/-1": ni siquiera vale la pena consultar
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  // null si no existe o si es un borrador (RLS lo oculta al rol anónimo)
  const post = await obtenerPostPorId(postId);
  if (!post) notFound();

  const fecha = post.fecha_publicacion
    ? new Date(post.fecha_publicacion).toLocaleDateString("es", { dateStyle: "long" })
    : null;

  return (
    <article>
      <h1>{post.titulo}</h1>
      <p>
        {post.autor}
        {fecha && <> · {fecha}</>} · {post.tiempo_lectura} min de lectura
      </p>
      {/* Markdown como texto plano por ahora; se renderiza en la fase de diseño */}
      <div className="whitespace-pre-line">{post.contenido}</div>
    </article>
  );
}
