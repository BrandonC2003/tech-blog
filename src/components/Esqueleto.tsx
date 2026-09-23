// Bloque gris que late: ocupa el lugar del contenido mientras carga
export default function Esqueleto({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-superficie ${className}`} />;
}
