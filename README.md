# Diálogos, fragmentos y secuencias

Sitio del proyecto transmedia "Mujeres en la Comunicación Audiovisual". HTML + CSS + JS
vanilla (sin build step), con Supabase como base de datos para el inventario de voces,
las presentaciones/actividades y los trabajos de estudiantes.

## Estructura

```
index.html              → las 5 etiquetas de la plataforma
css/styles.css           → identidad visual (paleta, tipografía, tabs)
js/supabaseClient.js     → configuración de conexión a Supabase
js/app.js                → navegación, búsqueda, filtros y carga de datos
supabase/schema.sql      → tablas + políticas de seguridad (RLS)
```

Si Supabase no está configurado todavía, el sitio funciona igual con datos de
referencia embebidos en `app.js` (`FALLBACK_VOCES`, `FALLBACK_EVENTOS`, `FALLBACK_TRABAJOS`),
para poder revisar el diseño sin depender de la base.

## 1. Configurar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegar y ejecutar el contenido de `supabase/schema.sql`.
3. En **Settings → API**, copiar el **Project URL** y la **anon public key**.
4. Pegar esos dos valores en `js/supabaseClient.js`:

```js
export const SUPABASE_URL = "https://tu-proyecto.supabase.co";
export const SUPABASE_ANON_KEY = "tu-anon-key-publica";
```

La `anon key` es pública por diseño (queda visible en el navegador). La seguridad real
la da Row Level Security: por defecto solo se permite lectura pública; para que el
equipo editor pueda cargar datos, hay que habilitar Auth y políticas de `insert`/`update`
(ver el comentario al final de `schema.sql`).

5. Cargar datos de prueba desde **Table Editor** en las tablas `voces`, `eventos` y
   `trabajos`, o insertarlos por SQL.

## 2. Probar en local

No hace falta build: es HTML/CSS/JS plano. Alcanza con levantar un servidor estático,
por ejemplo:

```bash
npx serve .
```

y abrir la URL que indique en la terminal.

## 3. Deploy en Vercel

Como es un sitio estático, no requiere configuración especial:

1. Subir esta carpeta a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New Project** → importar el repo.
3. Framework Preset: **Other** (sitio estático). No hace falta build command ni
   output directory: Vercel sirve `index.html` directamente.
4. Deploy.

Si preferís no dejar la key de Supabase hardcodeada en el repo público, se puede definir
como variable de entorno en Vercel y generar `js/supabaseClient.js` en un paso de build,
pero para un sitio de cátedra con RLS activo alcanza con el archivo tal como está.

## Contenido pendiente de completar

El sitio deja marcados como "a completar" los espacios que, según la consigna, todavía
no tienen datos definitivos: fichas del equipo editor, fotografías de las reuniones,
referentes del inventario, eventos y trabajos de estudiantes. Reemplazar cargando filas
en las tablas de Supabase (o editando los `FALLBACK_*` en `app.js` si se decide no usar
base de datos para alguna sección).
