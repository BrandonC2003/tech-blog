import { cache } from "react";
import { supabase } from "./supabase";
import { Post } from "./posts";

// Solo las columnas que necesita una tarjeta (sin `contenido`, que es el Markdown completo)
export type PostResumen = Pick<
  Post,
  "id" | "titulo" | "resumen" | "autor" | "tiempo_lectura" | "fecha_publicacion" | "categoria_id"
>;

export const obtenerPostsRecientes = cache(
  async (): Promise<PostResumen[]> => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, titulo, resumen, autor, tiempo_lectura, fecha_publicacion, categoria_id")
      .eq("publicado", true)
      .order("fecha_publicacion", { ascending: false });

    if (error) throw new Error(error.message);

    return data ?? [];
  }
);

export const obtenerPostPorId = cache(
  async (id: number): Promise<Post | null> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .eq("publicado", true) // los borradores no se muestran
      .maybeSingle(); // 0 filas → data: null (con .single() sería un error)

    if (error) throw new Error(error.message);

    return data;
  }
);
