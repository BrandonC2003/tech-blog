import Esqueleto from "@/components/Esqueleto";

/*
  Next envuelve page.tsx en un <Suspense> y usa esto como respaldo.
  Se muestra al instante al navegar, mientras llega la página real.
  Imita la forma de la página para que el cambio no "salte".
*/
export default function Cargando() {
  return (
    <div role="status" aria-label="Cargando categoría">
      <section className="border-b border-borde bg-grid">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 md:px-8 md:py-14 lg:px-20">
          <Esqueleto className="h-4 w-56" />
          <Esqueleto className="h-10 w-64 md:h-16" />
          <Esqueleto className="h-5 w-full max-w-xl" />
        </div>
      </section>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:px-8 md:py-12 lg:px-20">
        {[0, 1, 2].map((i) => (
          <Esqueleto key={i} className="h-44 rounded-2xl border border-borde md:h-[202px]" />
        ))}
      </div>
    </div>
  );
}
