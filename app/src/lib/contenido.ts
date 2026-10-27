// Lee la carpeta ../contenido en tiempo de build y arma el catálogo de la ruta.
// La app nunca escribe contenido: solo lo lee (regla 1 de CLAUDE.md).
import { parse as parseYaml } from 'yaml';

const markdown = import.meta.glob('../../../contenido/**/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
const jsons = import.meta.glob('../../../contenido/**/*.json', {
  import: 'default', eager: true,
}) as Record<string, unknown>;
const datasets = import.meta.glob('../../../contenido/**/datasets/*.sql', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

export const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const;
export type Dia = (typeof DIAS)[number];

export const NOMBRE_DIA: Record<Dia, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes',
};

export interface Frontmatter {
  id: string;
  titulo: string;
  objetivo: string;
  duracion_min: number;
  dataset?: string;
  version: string;
}

export interface Ejercicio {
  id: string;
  archivo: string;
  seccion: string;
  titulo: string;
  enunciado: string;
  pistas: string[];
  solucion: string;
  filas_esperadas: number;
  orden_importa?: boolean;
}

export interface Sesion {
  clave: string;          // "m02-sql/s01-primera-consulta/lunes": identifica el avance
  dia: Dia;
  tipo: 'leccion' | 'proyecto' | 'nota';
  modulo: { id: string; nombre: string };
  semana: { id: string; titulo: string; numero: number };
  meta: Frontmatter;
  cuerpo: string;         // Markdown sin frontmatter
  dataset: string;        // script SQL que se carga en el editor
  ejercicios: Ejercicio[];
}

function separarFrontmatter(texto: string): { meta: Record<string, unknown>; cuerpo: string } {
  const m = texto.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, cuerpo: texto };
  return { meta: parseYaml(m[1]) ?? {}, cuerpo: m[2] };
}

function normalizarVersion(v: unknown): string {
  return typeof v === 'number' ? v.toFixed(1) : String(v ?? '1.0');
}

// Resuelve "../datasets/x.sql" relativo a la carpeta de la semana
function resolverRuta(base: string, relativa: string): string {
  const partes = base.split('/');
  for (const p of relativa.split('/')) {
    if (p === '..') partes.pop();
    else if (p !== '.') partes.push(p);
  }
  return partes.join('/');
}

function construirCatalogo(): Sesion[] {
  const sesiones: Sesion[] = [];
  const modulos = Object.entries(jsons)
    .filter(([ruta]) => ruta.endsWith('/modulo.json'))
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [rutaModulo, mod] of modulos) {
    const carpetaModulo = rutaModulo.replace(/\/modulo\.json$/, '');
    const modulo = mod as { id: string; nombre: string; semanas: { id: string; titulo: string }[] };

    for (const sem of modulo.semanas) {
      const carpeta = `${carpetaModulo}/${sem.id}`;
      const semana = jsons[`${carpeta}/semana.json`] as
        | { dataset: string; dias: Record<Dia, string> }
        | undefined;
      if (!semana) continue;
      const dataset = datasets[resolverRuta(carpeta, semana.dataset)] ?? '';
      const ejercicios =
        (jsons[`${carpeta}/ejercicios.json`] as { ejercicios: Ejercicio[] } | undefined)?.ejercicios ?? [];

      for (const dia of DIAS) {
        const archivo = semana.dias[dia];
        const texto = markdown[`${carpeta}/${archivo}`];
        if (!texto) continue;
        const { meta, cuerpo } = separarFrontmatter(texto);
        sesiones.push({
          clave: `${modulo.id}/${sem.id}/${dia}`,
          dia,
          tipo: archivo.startsWith('proyecto') ? 'proyecto' : archivo.startsWith('nota') ? 'nota' : 'leccion',
          modulo: { id: modulo.id, nombre: modulo.nombre },
          semana: { id: sem.id, titulo: sem.titulo, numero: Number(meta.semana ?? 1) },
          meta: {
            id: String(meta.id ?? ''),
            titulo: String(meta.titulo ?? archivo),
            objetivo: String(meta.objetivo ?? ''),
            duracion_min: Number(meta.duracion_min ?? 60),
            dataset: meta.dataset ? String(meta.dataset) : undefined,
            version: normalizarVersion(meta.version),
          },
          cuerpo,
          dataset,
          ejercicios: ejercicios.filter((e) => e.archivo === archivo),
        });
      }
    }
  }
  return sesiones;
}

export const catalogo = construirCatalogo();

export function buscarSesion(clave: string): Sesion | undefined {
  return catalogo.find((s) => s.clave === clave);
}

export interface Seccion {
  titulo: string | null;  // null = introducción antes del primer "##"
  markdown: string;
}

// Divide el Markdown en bloques por "## ", para leerlo por partes en el celular.
export function dividirEnSecciones(cuerpo: string): Seccion[] {
  const limpio = cuerpo.replace(/<!--[\s\S]*?-->/g, '').replace(/^# .*\n/, '');
  const secciones: Seccion[] = [];
  let actual: Seccion = { titulo: null, markdown: '' };
  let enCodigo = false;
  for (const linea of limpio.split('\n')) {
    if (linea.startsWith('```')) enCodigo = !enCodigo;
    if (!enCodigo && linea.startsWith('## ')) {
      if (actual.titulo || actual.markdown.trim()) secciones.push(actual);
      actual = { titulo: linea.slice(3).trim(), markdown: '' };
    } else {
      actual.markdown += linea + '\n';
    }
  }
  secciones.push(actual);
  return secciones;
}

// "9. Práctica guiada" → "Práctica guiada"
export function nombreSeccion(titulo: string | null): string {
  return (titulo ?? '').replace(/^\d+\.\s*/, '').trim();
}
