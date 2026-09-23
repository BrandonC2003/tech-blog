import Link from "next/link";

type Props = {
  href: string;
  nombre: string;
  activo?: boolean;
};

export default function CategoryChip({ href, nombre, activo = false }: Props) {
  return (
    <Link
      href={href}
      // aria-current le dice a los lectores de pantalla cuál es la página actual
      aria-current={activo ? "page" : undefined}
      className={`flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium md:px-[18px] ${
        activo
          ? "border-cian bg-cian/12 text-cian"
          : "border-borde-fuerte text-codigo hover:border-cian hover:text-cian"
      }`}
    >
      {nombre}
    </Link>
  );
}
