import Link from "next/link";
import { obtenerCategorias, obtenerPostsRecientes } from "@/lib/queries";

export const revalidate = 60; // ISR: regenera la página como máximo cada 60 s

export default async function Home() {
  // Son independientes entre sí: se piden en paralelo
  const [categorias, posts] = await Promise.all([
    obtenerCategorias(),
    obtenerPostsRecientes(),
  ]);

  return (
    <div>
      <nav>
        {categorias.map((c) => (
          <Link key={c.id} href={`/categorias/${c.slug}`}>
            {c.nombre}{" "}
          </Link>
        ))}
      </nav>

      {posts.map((post) => (
        <div key={post.id}>
          <h2>
            <Link href={`/posts/${post.id}`}>{post.titulo}</Link>
          </h2>
          <p>{post.resumen}</p>
        </div>
      ))}
    </div>
  );
}
