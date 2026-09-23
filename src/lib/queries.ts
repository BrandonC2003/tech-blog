import { cache } from "react";
import { supabase } from "./supabase";
import { Post } from "./posts";
import { Categoria } from "./categoria";

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

// Post completo + su categoría (Supabase la une gracias a la FK categoria_id)
export type PostConCategoria = Post & {
  categoria: Pick<Categoria, "nombre" | "slug">;
};

export const obtenerPostPorId = cache(
  async (id: number): Promise<PostConCategoria | null> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, categoria:categorias(nombre, slug)")
      .eq("id", id)
      .eq("publicado", true) // los borradores no se muestran
      .maybeSingle(); // 0 filas → data: null (con .single() sería un error)

    if (error) throw new Error(error.message);

    return data;
  }
);

export const obtenerCategorias = cache(
  async (): Promise<Categoria[]> => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre");

    if (error) throw new Error(error.message);

    return data ?? [];
  }
);

export const obtenerCategoriaPorSlug = cache(
  async (slug: string): Promise<Categoria | null> => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
  }
);

// `excluirId` sirve para los relacionados: los de la misma categoría menos el actual
export const obtenerPostsDeCategoria = cache(
  async (categoriaId: number, excluirId?: number): Promise<PostResumen[]> => {
    let consulta = supabase
      .from("posts")
      .select("id, titulo, resumen, autor, tiempo_lectura, fecha_publicacion, categoria_id")
      .eq("categoria_id", categoriaId)
      .eq("publicado", true)
      .order("fecha_publicacion", { ascending: false });

    if (excluirId !== undefined) consulta = consulta.neq("id", excluirId);

    const { data, error } = await consulta;

    if (error) throw new Error(error.message);

    return data ?? [];
  }
);
