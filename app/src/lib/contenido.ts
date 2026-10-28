// Lee la carpeta ../contenido en tiempo de build y arma el catálogo de la ruta.
// La app nunca escribe contenido: solo lo lee (regla 1 de CLAUDE.md).
import { parse as parseYaml } from 'yaml';
import type { Historia } from './historia';

const markdown = import.meta.glob('../../../contenido/**/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
const jsons = import.meta.glob('../../../contenido/**/*.json', {
  import: 'default', eager: true,
}) as Record<string, unknown>;
const historias = import.meta.glob('../../../contenido/**/*.historia.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
const yamls = import.meta.glob('../../../contenido/**/conceptos.yaml', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
const datasets = import.meta.glob('../../../contenido/**/datasets/*.sql', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

export type TipoParada = 'leccion' | 'proyecto' | 'repaso';

// Una parada del camino de la unidad (unidad.json → paradas)
export interface Parada {
  id: string;             // "leccion-1": también nombra su historia (<id>.historia.yaml)
  tipo: TipoParada;
  corto: string;          // etiqueta en el mapa: "SELECT", "Proyecto 1"
  archivo: string;        // lección completa en Markdown
  titulo?: string;        // si no se indica, sale del frontmatter del archivo
  objetivo?: string;
  duracion_min?: number;
}

// Ficha de un tema en el mapa (conceptos.yaml de la unidad)
export interface Concepto {
  id: string;
  parada: string;
  codigo: string;
  titulo: string;
  significado: string;
  ejemplo?: string;
}

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
  clave: string;          // "m02-sql/s01-primera-consulta/leccion-1": identifica el avance
  parada: Parada;
  tipo: TipoParada;
  modulo: { id: string; nombre: string };
  semana: { id: string; titulo: string; numero: number };   // la unidad
  meta: Frontmatter;
  cuerpo: string;         // Markdown sin frontmatter
  dataset: string;        // script SQL que se carga en el editor
  ejercicios: Ejercicio[];
  historia?: Historia;    // versión en tarjetas (<dia>.historia.yaml), si existe
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

function leerHistoria(ruta: string): Historia | undefined {
  const texto = historias[ruta];
  if (!texto) return undefined;
  const h = parseYaml(texto) as Historia;
  return { ...h, version: String(h.version ?? '1.0') };
}

// Unidad del módulo tal como la ve el mapa: con contenido (sesiones) o "próximamente"
export interface Unidad {
  id: string;
  numero: number;
  titulo: string;
  temas: string[];
  modulo: { id: string; nombre: string };
  sesiones: Sesion[];      // vacío si aún no está escrita
  conceptos: Concepto[];
  tipsHashy: string[];
}

interface ModuloJson {
  id: string;
  nombre: string;
  unidades: { id: string; titulo: string; temas?: string[] }[];
}

interface UnidadJson {
  numero: number;
  dataset: string;
  paradas: Parada[];
}

function construirUnidades(): Unidad[] {
  const unidades: Unidad[] = [];
  const modulos = Object.entries(jsons)
    .filter(([ruta]) => ruta.endsWith('/modulo.json'))
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [rutaModulo, mod] of modulos) {
    const carpetaModulo = rutaModulo.replace(/\/modulo\.json$/, '');
    const modulo = mod as ModuloJson;
    const infoModulo = { id: modulo.id, nombre: modulo.nombre };

    modulo.unidades.forEach((u, n) => {
      const carpeta = `${carpetaModulo}/${u.id}`;
      const unidad = jsons[`${carpeta}/unidad.json`] as UnidadJson | undefined;
      const extra = yamls[`${carpeta}/conceptos.yaml`];
      const fichas = extra ? (parseYaml(extra) as { conceptos?: Concepto[]; tips_hashy?: string[] }) : {};
      const base: Unidad = {
        id: u.id, numero: unidad?.numero ?? n + 1, titulo: u.titulo, temas: u.temas ?? [],
        modulo: infoModulo, sesiones: [], conceptos: fichas.conceptos ?? [], tipsHashy: fichas.tips_hashy ?? [],
      };
      unidades.push(base);
      if (!unidad) return;

      const dataset = datasets[resolverRuta(carpeta, unidad.dataset)] ?? '';
      const ejercicios =
        (jsons[`${carpeta}/ejercicios.json`] as { ejercicios: Ejercicio[] } | undefined)?.ejercicios ?? [];

      for (const parada of unidad.paradas) {
        const texto = markdown[`${carpeta}/${parada.archivo}`];
        if (!texto) continue;
        const { meta, cuerpo } = separarFrontmatter(texto);
        base.sesiones.push({
          clave: `${modulo.id}/${u.id}/${parada.id}`,
          parada,
          tipo: parada.tipo,
          modulo: infoModulo,
          semana: { id: u.id, titulo: u.titulo, numero: base.numero },
          meta: {
            id: String(meta.id ?? ''),
            titulo: parada.titulo ?? String(meta.titulo ?? parada.archivo),
            objetivo: parada.objetivo ?? String(meta.objetivo ?? ''),
            duracion_min: parada.duracion_min ?? Number(meta.duracion_min ?? 60),
            dataset: meta.dataset ? String(meta.dataset) : undefined,
            version: normalizarVersion(meta.version),
          },
          cuerpo,
          dataset,
          // Las paradas de proyecto comparten archivo; su historia elige los retos por id
          ejercicios: ejercicios.filter((e) => e.archivo === parada.archivo),
          historia: leerHistoria(`${carpeta}/${parada.id}.historia.yaml`),
        });
      }
    });
  }
  return unidades;
}

export const unidades = construirUnidades();
export const catalogo = unidades.flatMap((u) => u.sesiones);

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
