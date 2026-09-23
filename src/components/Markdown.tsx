import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import BloqueCodigo from "./BloqueCodigo";
import { slugificar } from "@/lib/formato";

// Texto plano de lo que React va a mostrar (para calcular el id de un título)
function textoDe(nodo: ReactNode): string {
  if (typeof nodo === "string" || typeof nodo === "number") return String(nodo);
  if (Array.isArray(nodo)) return nodo.map(textoDe).join("");
  if (isValidElement<{ children?: ReactNode }>(nodo)) return textoDe(nodo.props.children);
  return "";
}

/*
  react-markdown convierte el texto Markdown en elementos de React (no usa
  innerHTML, así que no hay riesgo de inyectar HTML). Con `components`
  decidimos qué clases de Tailwind lleva cada etiqueta.
*/
const componentes: Components = {
  // El id permite saltar a la sección (#id); IndiceArticulo calcula el mismo id con extraerTitulos
  h2: ({ children }) => (
    <h2 id={slugificar(textoDe(children))} className="scroll-mt-8 mt-4 font-display text-[25px] font-semibold leading-tight text-texto md:text-[32px]">
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
  // El bloque de código es una isla de cliente (tiene botón de copiar)
  pre: ({ children }) => <BloqueCodigo>{children}</BloqueCodigo>,
  // `code` se usa tanto dentro de <pre> (bloque) como suelto (en línea); BloqueCodigo anula este estilo
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
