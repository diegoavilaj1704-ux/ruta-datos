// Formato de las lecciones contadas como historia (<dia>.historia.yaml en contenido/).
import type { Quien } from './personajes';

export interface Mensaje { quien: Quien; texto: string }

export type Paso =
  | { tipo: 'portada' }
  | { tipo: 'chat'; mensajes: Mensaje[] }
  | { tipo: 'tabla'; quien?: Quien; texto: string; consulta: string; nota?: string }
  | { tipo: 'idea'; quien?: Quien; texto: string; nota?: string }
  | { tipo: 'analogia'; quien: Quien; titulo: string; texto: string; limite?: string }
  | { tipo: 'conceptos'; titulo?: string; items: { codigo: string; significado: string }[]; nota?: string }
  | { tipo: 'terminal'; quien?: Quien; texto: string; codigo: string; despues?: string }
  | { tipo: 'armar'; encargo?: Mensaje; titulo: string; antes: string; despues: string; piezas: string[]; ejercicio: string }
  | { tipo: 'error'; titulo: string; piezas: string[]; error: number; explicacion: string; pista?: string; tip?: string }
  | { tipo: 'tip'; quien: Quien; texto: string }
  | { tipo: 'escribir'; encargo?: Mensaje; titulo: string; ejercicio: string }
  | { tipo: 'quiz'; pregunta: string; etiqueta?: string; opciones: { texto: string; correcta?: boolean; porque?: string }[] }
  | { tipo: 'resumen'; ideas: string[]; cierre?: Mensaje };

export interface Historia {
  id: string;
  version: string;
  pasos: Paso[];
}

// Pasos que se tienen que resolver antes de continuar (dan XP)
export const INTERACTIVOS: Paso['tipo'][] = ['terminal', 'armar', 'error', 'escribir', 'quiz'];

// Une piezas de código respetando la puntuación: "producto , cantidad" → "producto, cantidad"
export function unirPiezas(piezas: string[]): string {
  return piezas.join(' ').replace(/\s+([,;])/g, '$1');
}
