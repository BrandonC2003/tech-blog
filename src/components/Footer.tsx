import Link from "next/link";
import GitHubButton from "./GitHubButton";
import { NOMBRE_SITIO } from "@/lib/sitio";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-borde">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-secundario md:flex-row md:items-center md:justify-between md:px-8 md:py-8 lg:px-20">
        <span className="font-mono text-xs md:text-sm">
          © {new Date().getFullYear()} {NOMBRE_SITIO} · hecho con Next.js + Supabase
        </span>
        <div className="flex gap-7">
          <GitHubButton className="hover:text-texto">GitHub</GitHubButton>
          <Link href="/#categorias" className="hover:text-texto">
            Categorías
          </Link>
        </div>
      </div>
    </footer>
  );
}
