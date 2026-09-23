"use client";

import { useLinkStatus } from "next/link";

/*
  Debe ir DENTRO de un <Link>: useLinkStatus lee el estado de ese enlace.
  `pending` es true desde el clic hasta que la nueva página está lista.
  La clase .indicador-carga (globals.css) espera 100 ms antes de mostrarse:
  si la navegación es instantánea, no parpadea.
*/
export default function IndicadorCarga() {
  const { pending } = useLinkStatus();
  return <span aria-hidden="true" className={`indicador-carga ${pending ? "is-pending" : ""}`} />;
}
