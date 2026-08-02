// Las 12 líneas del catálogo agrupadas por etapa de obra. El orden manda en la
// nav de /equipos.
//
// Vive acá y no dentro de catalog.tsx porque las fichas (server components)
// también lo necesitan: la miga de pan de un equipo tiene que saber en qué
// grupo cae su línea para poder devolver al catálogo con el filtro puesto.
//
// `id` es la clave que viaja en la URL (?linea=compactacion); `label` es lo que
// se muestra. Se separan para que renombrar el label no rompa links viejos.

export type Grupo = {
  id: string;
  label: string;
  slugs: string[];
};

export const GRUPOS: Grupo[] = [
  {
    id: "estructura-y-altura",
    label: "Estructura y altura",
    slugs: [
      "andamios",
      "formaleteria-para-columna-y-muro",
      "formaleteria-para-losas",
      "equipos-de-traccion-vertical",
    ],
  },
  {
    id: "concreto-y-acabado",
    label: "Concreto y acabado",
    slugs: ["concretadoras", "allanadoras"],
  },
  {
    id: "compactacion",
    label: "Compactación",
    slugs: ["vibradores-y-compactadores", "rodillos-compactadores"],
  },
  {
    id: "corte-y-demolicion",
    label: "Corte y demolición",
    slugs: ["cortadoras", "compresores"],
  },
  {
    id: "otros-equipos",
    label: "Otros equipos",
    slugs: ["mini-cargadores", "basculas-500kgs"],
  },
];

/** Grupo que contiene una línea del catálogo, o undefined si no está en ninguno. */
export function grupoDeCategoria(categoriaSlug: string) {
  return GRUPOS.find((g) => g.slugs.includes(categoriaSlug));
}

/** Grupo por su id de URL. */
export function grupoPorId(id: string | null | undefined) {
  if (!id) return undefined;
  return GRUPOS.find((g) => g.id === id);
}
