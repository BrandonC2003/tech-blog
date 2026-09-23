import type { ReactNode } from "react";
import { REPO_URL } from "@/lib/sitio";

type Props = {
  children: ReactNode;
  ruta?: string; // se agrega a la URL del repo, por ejemplo "/issues/new"
  className?: string;
  ariaLabel?: string; // obligatorio en la práctica cuando el botón es solo un ícono
};

// Enlace externo: se usa <a> y no <Link>, porque sale de nuestra app.
// El estilo lo decide quien lo usa; este componente solo garantiza la URL y el rel.
export default function GitHubButton({ children, ruta = "", className, ariaLabel }: Props) {
  return (
    <a
      href={`${REPO_URL}${ruta}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
