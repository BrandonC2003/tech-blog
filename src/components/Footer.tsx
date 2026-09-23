import GitHubButton from "./GitHubButton";
import { NOMBRE_SITIO } from "@/lib/sitio";

export default function Footer() {
  return (
    <footer>
      <p>
        {NOMBRE_SITIO} · Hecho con Next.js y Supabase ·{" "}
        <GitHubButton texto="Código fuente" />
      </p>
    </footer>
  );
}
