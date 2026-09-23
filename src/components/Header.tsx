import Link from "next/link";
import GitHubButton from "./GitHubButton";
import { IconoGitHub } from "./Iconos";
import MenuMovil from "./MenuMovil";
import { obtenerCategorias } from "@/lib/queries";
import { NOMBRE_SITIO } from "@/lib/sitio";

// Sigue siendo Server Component: consulta las categorías y se las pasa a la isla MenuMovil
export default async function Header() {
  const categorias = await obtenerCategorias();

  return (
    // relative: el menú móvil se posiciona justo debajo del header
    <header className="relative border-b border-borde">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[76px] md:px-8 lg:px-20">
        <Link href="/" className="flex items-center gap-3 text-texto">
          <span className="flex size-8 items-center justify-center rounded-lg border border-cian font-mono text-xs text-cian shadow-[0_0_16px_rgb(34_211_238/0.35)] md:size-9 md:text-sm">
            &gt;_
          </span>
          <span className="font-display text-lg font-bold tracking-wide md:text-[22px]">
            {NOMBRE_SITIO}
          </span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-9">
          {/* En móvil se ocultan los textos: solo queda el botón de GitHub */}
          <Link href="/" className="hidden text-[15px] text-secundario hover:text-texto md:block">
            Inicio
          </Link>
          <Link href="/#categorias" className="hidden text-[15px] text-secundario hover:text-texto md:block">
            Categorías
          </Link>
          <GitHubButton
            ariaLabel="Repositorio en GitHub"
            className="flex size-11 items-center justify-center text-texto md:h-11 md:w-auto md:gap-2.5 md:rounded-[10px] md:border md:border-borde-fuerte md:px-[18px] md:font-mono md:text-[13px] md:hover:border-cian"
          >
            <IconoGitHub />
            <span className="hidden md:inline">GitHub</span>
          </GitHubButton>
          <MenuMovil categorias={categorias.map(({ slug, nombre }) => ({ slug, nombre }))} />
        </nav>
      </div>
    </header>
  );
}
