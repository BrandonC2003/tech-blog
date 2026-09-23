export interface Post {
  id: number;
  created_at: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen_url: string | null;
  categoria_id: number;
  autor: string;
  tiempo_lectura: number;
  destacado: boolean;
  publicado: boolean;
  fecha_publicacion: string | null;
}