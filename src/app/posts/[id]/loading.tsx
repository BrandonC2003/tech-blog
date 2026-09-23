import Esqueleto from "@/components/Esqueleto";

// Respaldo instantáneo mientras llega el artículo (misma estructura que page.tsx)
export default function Cargando() {
  return (
    <div role="status" aria-label="Cargando artículo" className="mx-auto flex max-w-[1040px] flex-col gap-6 px-4 pt-7 md:px-8 md:pt-14 lg:px-0">
      <Esqueleto className="h-6 w-24" />
      <Esqueleto className="h-10 w-full md:h-14" />
      <Esqueleto className="h-10 w-3/4 md:h-14" />
      <Esqueleto className="h-5 w-64" />
      <Esqueleto className="mt-4 h-[210px] rounded-[14px] md:h-[340px] lg:h-[440px]" />
      <div className="flex max-w-[700px] flex-col gap-3">
        <Esqueleto className="h-5 w-full" />
        <Esqueleto className="h-5 w-full" />
        <Esqueleto className="h-5 w-2/3" />
      </div>
    </div>
  );
}
