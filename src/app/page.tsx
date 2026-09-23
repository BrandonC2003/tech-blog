import Link from "next/link";
import GitHubButton from "@/components/GitHubButton";
import { obtenerCategorias, obtenerPostsRecientes } from "@/lib/queries";

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
    <div>
      <section>
        <h1>Tech Blog</h1>
        <p>Artículos sobre desarrollo web, escritos mientras aprendo.</p>
        <GitHubButton texto="Ver el repositorio" />
      </section>

      <nav>
        {categorias.map((c) => (
          <Link key={c.id} href={`/categorias/${c.slug}`}>
            {c.nombre}{" "}
          </Link>
        ))}
      </nav>

      {destacado && (
        <section>
          <p>Destacado</p>
          <h2>
            <Link href={`/posts/${destacado.id}`}>{destacado.titulo}</Link>
          </h2>
          <p>{destacado.resumen}</p>
        </section>
      )}

      <h2>Últimos artículos</h2>
      {recientes.map((post) => (
        <div key={post.id}>
          <h2>
            <Link href={`/posts/${post.id}`}>{post.titulo}</Link>
          </h2>
          <p>{post.resumen}</p>
        </div>
      ))}

      <section>
        <h2>Open source</h2>
        <p>Todo el código de este blog es público. Revísalo, aprende de él o propón mejoras.</p>
        <GitHubButton texto="Ver en GitHub" />
      </section>
    </div>
  );
}
