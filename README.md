# Tech Blog

Blog tecnológico construido con **Next.js (App Router)** y **Supabase**, desarrollado como actividad de un curso para demostrar **rutas dinámicas** y **lectura de datos desde componentes del servidor**.

Los artículos y las categorías se guardan en Supabase. Cada artículo y cada categoría tiene su propia URL generada a partir de los datos: `/posts/1`, `/categorias/nextjs`, etc. El diseño sigue un estilo "terminal con neón": oscuro, con acentos cian y magenta, pensado primero para móvil.

## Características

- **Rutas dinámicas** `/posts/[id]` y `/categorias/[slug]`, con respuesta 404 (`notFound()`) cuando el id o el slug no existen.
- **Datos leídos en Server Components**: las consultas a Supabase se ejecutan en el servidor, nunca en el navegador.
- **Renderizado estático con ISR**: las páginas se generan en el build con `generateStaticParams` y se regeneran como máximo cada 60 segundos.
- **Estados de carga y vacío**: esqueletos con `loading.tsx`, indicador en el enlace clicado con `useLinkStatus` y mensaje para las categorías sin artículos.
- **Artículos en Markdown** renderizados con `react-markdown`, con índice de secciones y barra de progreso de lectura.
- **Islas de cliente** solo donde hace falta interactividad: menú móvil, índice del artículo, barra de progreso y botón para copiar código.
- **Diseño responsive** con Tailwind CSS v4.

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) + React 19 | Framework y renderizado |
| TypeScript | Tipado |
| [Supabase](https://supabase.com) (`@supabase/supabase-js`) | Base de datos PostgreSQL (solo lectura) |
| Tailwind CSS v4 | Estilos |
| `next/font` | Fuentes Chakra Petch, IBM Plex Sans y JetBrains Mono |
| `react-markdown` | Contenido de los artículos |
| Vercel | Despliegue |

## Rutas

| Ruta | Tipo | Contenido |
|---|---|---|
| `/` | Estática (ISR) | Presentación, filtros por categoría, artículo destacado, últimos artículos y sección open source |
| `/categorias` | Estática (ISR) | Todas las categorías con su número de artículos |
| `/categorias/[slug]` | Dinámica (ISR) | Encabezado de la categoría y sus artículos publicados |
| `/posts/[id]` | Dinámica (ISR) | Artículo completo, índice y artículos relacionados |

## Estructura del proyecto

```
src/
├─ app/                      qué página se muestra en cada URL
│  ├─ layout.tsx             header, footer y fuentes
│  ├─ page.tsx               inicio
│  ├─ globals.css            tema de colores de Tailwind
│  ├─ categorias/
│  │  ├─ page.tsx            listado de categorías
│  │  └─ [slug]/             página de una categoría (+ loading.tsx)
│  └─ posts/
│     └─ [id]/               página de un artículo (+ loading.tsx)
├─ components/               cómo se ve cada pieza (tarjetas, chips, header, islas de cliente…)
└─ lib/                      cómo se obtienen los datos
   ├─ supabase.ts            cliente de Supabase
   ├─ queries.ts             todas las consultas a la base de datos
   └─ formato.ts             fechas, colores de categoría y títulos del Markdown
```

## Instalación local

### Requisitos

- [Node.js](https://nodejs.org) **20.9 o superior**.
- Una cuenta de [Supabase](https://supabase.com); el plan gratuito es suficiente.

### 1. Clonar el repositorio e instalar las dependencias

```bash
git clone https://github.com/BrandonC2003/tech-blog.git
cd tech-blog
npm install
```

### 2. Preparar la base de datos en Supabase

Crea un proyecto en Supabase. Luego, en **SQL Editor**, ejecuta el siguiente script. Crea las tablas y activa **Row Level Security** para que el público solo pueda *leer* las categorías y los artículos publicados:

```sql
create table categorias (
  id          bigint generated always as identity primary key,
  nombre      text not null,
  slug        text not null unique,
  descripcion text,
  color       text not null default 'cyan' check (color in ('cyan', 'magenta')),
  created_at  timestamptz not null default now()
);

create table posts (
  id                bigint generated always as identity primary key,
  titulo            text not null,
  resumen           text,
  contenido         text,              -- Markdown
  imagen_url        text,              -- si es null se muestra un patrón de cuadrícula
  categoria_id      bigint not null references categorias (id),
  autor             text,
  tiempo_lectura    int,               -- minutos
  destacado         boolean not null default false,
  publicado         boolean not null default false,
  fecha_publicacion timestamptz,
  created_at        timestamptz not null default now()
);

alter table categorias enable row level security;
alter table posts enable row level security;

create policy "Leer categorías" on categorias
  for select to anon using (true);

create policy "Leer posts publicados" on posts
  for select to anon using (publicado = true);
```

Después agrega algunos datos, desde **Table Editor** (acepta importar CSV) o con SQL. Por ejemplo:

```sql
insert into categorias (nombre, slug, descripcion, color)
values ('Next.js', 'nextjs', 'Rutas, componentes del servidor y más.', 'cyan');

insert into posts (titulo, resumen, contenido, categoria_id, autor, tiempo_lectura, destacado, publicado, fecha_publicacion)
values ('Mi primer artículo', 'Un resumen corto.', E'Hola.\n\n## Una sección\n\nTexto en **Markdown**.',
        1, 'Tu nombre', 3, true, true, now());
```

> Solo aparecen en el sitio los artículos con `publicado = true`. El que tenga `destacado = true` se muestra arriba en el inicio.

### 3. Configurar las variables de entorno

Copia la plantilla y completa los valores de tu proyecto de Supabase:

```bash
cp .env.example .env.local
```

Consulta la sección [Variables de entorno](#variables-de-entorno) para saber de dónde sale cada valor.

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> En modo desarrollo cada página se compila la primera vez que se visita y Next.js no precarga los enlaces, así que la navegación se siente más lenta. Para probar el comportamiento real, compila y ejecuta la versión de producción:
>
> ```bash
> npm run build
> npm start
> ```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Compila la versión de producción (consulta Supabase para generar las páginas) |
| `npm start` | Ejecuta la versión compilada |
| `npm run lint` | Revisa el código con ESLint |

## Variables de entorno

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto de Supabase | Supabase → *Project Settings* → *API* → *Project URL* |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública (*publishable*) del proyecto | Supabase → *Project Settings* → *API Keys* → *Publishable key* |

El archivo [`.env.example`](.env.example) contiene estos nombres sin valores. Tus valores reales van en `.env.local`, que está en `.gitignore` y **nunca se sube al repositorio**. Si falta alguna variable, la aplicación se detiene con un mensaje claro en lugar de fallar más adelante.

**Sobre la seguridad:** el prefijo `NEXT_PUBLIC_` hace que la variable sea visible en el navegador. Eso es aceptable para la clave *publishable* porque su acceso lo limitan las políticas de Row Level Security: con ella solo se pueden leer categorías y artículos publicados. **Nunca** uses aquí la clave *secret* ni la `service_role`, porque saltan esas políticas.

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. En *Settings → Environment Variables* agrega las dos variables anteriores.
3. Cada `git push` a `main` genera un despliegue nuevo automáticamente.

Como las páginas se generan durante el build, Supabase debe estar accesible y las variables configuradas en Vercel; si no, el despliegue falla.

