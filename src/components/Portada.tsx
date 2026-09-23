import type { ReactNode } from "react";

type Props = {
  imagenUrl: string | null;
  alt: string;
  className?: string;
  children?: ReactNode; // lo que va encima (por ejemplo, la etiqueta de categoría)
};

// Si el post no tiene imagen, se muestra el patrón de cuadrícula
export default function Portada({ imagenUrl, alt, className = "", children }: Props) {
  return (
    <div className={`relative overflow-hidden bg-grid ${className}`}>
      {imagenUrl && (
        // <img> y no next/image: next/image exige declarar el dominio de las
        // imágenes en next.config, y todavía no sabemos de dónde vendrán.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imagenUrl} alt={alt} className="absolute inset-0 size-full object-cover" />
      )}
      {children && <div className="relative flex h-full items-end p-4 md:p-[18px]">{children}</div>}
    </div>
  );
}
