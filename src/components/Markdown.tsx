import ReactMarkdown, { type Components } from "react-markdown";

/*
  react-markdown convierte el texto Markdown en elementos de React (no usa
  innerHTML, así que no hay riesgo de inyectar HTML). Con `components`
  decidimos qué clases de Tailwind lleva cada etiqueta.
*/
const componentes: Components = {
  h2: ({ children }) => (
    <h2 className="mt-4 font-display text-[25px] font-semibold leading-tight text-texto md:text-[32px]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-2 font-display text-xl font-semibold text-texto md:text-2xl">{children}</h3>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-cian underline underline-offset-4 hover:text-cian-claro">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="rounded-xl border border-magenta bg-magenta/7 px-5 py-4 text-base text-texto md:text-[17px]">
      {children}
    </blockquote>
  ),
  // [&_code]:... quita el estilo de código en línea a los <code> que estén dentro del bloque
  pre: ({ children }) => (
    <pre className="overflow-x-auto [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em] [&_code]:text-inherit rounded-xl border border-borde bg-superficie-2 p-5 font-mono text-[13px] leading-loose text-codigo md:px-7 md:text-[15px]">
      {children}
    </pre>
  ),
  // `code` se usa tanto dentro de <pre> (bloque) como suelto (en línea); el <pre> anula este estilo
  code: ({ children }) => (
    <code className="rounded border border-borde bg-superficie-2 px-1.5 py-0.5 font-mono text-[0.85em] text-cian">
      {children}
    </code>
  ),
};

export default function Markdown({ contenido }: { contenido: string }) {
  return (
    // Cuerpo del artículo: 19px en escritorio, interlineado 1.8
    <div className="flex flex-col gap-6 text-lg leading-[1.75] text-lectura md:text-[19px] md:leading-[1.8]">
      <ReactMarkdown components={componentes}>{contenido}</ReactMarkdown>
    </div>
  );
}
