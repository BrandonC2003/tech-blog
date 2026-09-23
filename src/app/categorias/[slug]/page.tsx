import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerCategoriaPorSlug, obtenerPostsDeCategoria } from "@/lib/queries";

export const revalidate = 60;

export default async function CategoriaPage(props: PageProps<"/categorias/[slug]">) {
  const { slug } = await props.params;

  const categoria = await obtenerCategoriaPorSlug(slug);
  if (!categoria) notFound();

  const posts = await obtenerPostsDeCategoria(categoria.id);

  return (
    <div>
      <h1>{categoria.nombre}</h1>
      <p>{categoria.descripcion}</p>

      {posts.length === 0 ? (
        <p>Todavía no hay artículos publicados en esta categoría.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <h2>
              <Link href={`/posts/${post.id}`}>{post.titulo}</Link>
            </h2>
            <p>{post.resumen}</p>
          </div>
        ))
      )}
    </div>
  );
}
