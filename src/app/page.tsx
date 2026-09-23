import Link from "next/link";
import { obtenerPostsRecientes } from "@/lib/queries";

export const revalidate = 60; // ISR: regenera la página como máximo cada 60 s

export default async function Home() {
  const posts = await obtenerPostsRecientes();

  return (
    <div>
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
