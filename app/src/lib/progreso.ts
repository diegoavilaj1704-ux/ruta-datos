// Avance del alumno, guardado en el dispositivo (localStorage).
// En la Fase 2 esto se sincroniza con Supabase; por ahora vive solo en el teléfono.
import { useCallback, useSyncExternalStore } from 'react';
import type { Perfil } from './personajes';
import type { Regalo } from './regalos';

const LLAVE = 'ruta-datos:progreso:v1';

export interface Progreso {
  completadas: Record<string, string>;            // clave de sesión → fecha ISO
  diasActivos: string[];                           // "2026-10-27" (fecha local)
  ejercicios: Record<string, { codigo: string; resuelto: boolean }>;
  quiz: Record<string, number>;                    // "clave#n" → opción elegida
  notas: Record<string, string>;                   // borrador de la nota pública del repaso
  xp: number;                                      // XP disponibles: se ganan en lecciones y se gastan en el clóset
  historias: Record<string, { paso: number; xp: number }>; // tarjeta actual y XP de la lección en curso
  perfil?: Perfil;                                 // avatar y nombre del alumno (protagonista de las historias)
  sonido: boolean;
  comprados: string[];                             // prendas desbloqueadas ("ropa:jersey")
  premios: string[];                               // unidades cuyo premio (Banco de Datos) ya se cobró
  regalos: Record<string, string>;                 // regalos de monedas abiertos ("m02-s01#3") → lo que salió
  dobleXP: boolean;                                // la siguiente parada que termines da el doble de XP
}

const vacio: Progreso = { completadas: {}, diasActivos: [], ejercicios: {}, quiz: {}, notas: {}, xp: 0, historias: {}, sonido: true, comprados: [], premios: [], regalos: {}, dobleXP: false };

// Antes la ruta iba por días; las claves viejas se renombran a su parada
const DIA_A_PARADA: Record<string, string> = {
  lunes: 'leccion-1', martes: 'leccion-2', miercoles: 'proyecto-1', jueves: 'proyecto-2', viernes: 'repaso',
};
function migrarClave(clave: string): string {
  return clave.replace(/\/(lunes|martes|miercoles|jueves|viernes)(?=$|#)/, (_, d: string) => `/${DIA_A_PARADA[d]}`);
}
function migrarLlaves<T>(r: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [migrarClave(k), v]));
}

function leer(): Progreso {
  try {
    const guardado = localStorage.getItem(LLAVE);
    if (!guardado) return vacio;
    const p: Progreso = { ...vacio, ...JSON.parse(guardado) };
    return {
      ...p,
      completadas: migrarLlaves(p.completadas),
      historias: migrarLlaves(p.historias),
      quiz: migrarLlaves(p.quiz),
      notas: migrarLlaves(p.notas),
    };
  } catch {
    return vacio;
  }
}

let estado = leer();
const oyentes = new Set<() => void>();

function guardar(nuevo: Progreso) {
  estado = nuevo;
  try {
    localStorage.setItem(LLAVE, JSON.stringify(nuevo));
  } catch {
    // modo privado o almacenamiento lleno: el avance sigue en memoria
  }
  oyentes.forEach((f) => f());
}

export function hoyLocal(fecha = new Date()): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function marcarActivo(p: Progreso): string[] {
  const hoy = hoyLocal();
  return p.diasActivos.includes(hoy) ? p.diasActivos : [...p.diasActivos, hoy];
}

export const acciones = {
  completar(clave: string) {
    guardar({ ...estado, completadas: { ...estado.completadas, [clave]: new Date().toISOString() }, diasActivos: marcarActivo(estado) });
  },
  desmarcar(clave: string) {
    const { [clave]: _, ...resto } = estado.completadas;
    guardar({ ...estado, completadas: resto });
  },
  guardarEjercicio(id: string, codigo: string, resuelto?: boolean) {
    const previo = estado.ejercicios[id];
    guardar({
      ...estado,
      ejercicios: { ...estado.ejercicios, [id]: { codigo, resuelto: resuelto ?? previo?.resuelto ?? false } },
      diasActivos: resuelto !== undefined ? marcarActivo(estado) : estado.diasActivos,
    });
  },
  responderQuiz(llave: string, opcion: number) {
    guardar({ ...estado, quiz: { ...estado.quiz, [llave]: opcion } });
  },
  reiniciarQuiz(claveSesion: string) {
    const quiz = Object.fromEntries(Object.entries(estado.quiz).filter(([k]) => !k.startsWith(`${claveSesion}#`)));
    guardar({ ...estado, quiz });
  },
  guardarNota(clave: string, texto: string) {
    guardar({ ...estado, notas: { ...estado.notas, [clave]: texto } });
  },
  avanzarHistoria(clave: string, paso: number, xpGanado = 0) {
    const previo = estado.historias[clave] ?? { paso: 0, xp: 0 };
    guardar({
      ...estado,
      historias: { ...estado.historias, [clave]: { paso, xp: previo.xp + xpGanado } },
      // Cualquier tarjeta que avanzas cuenta como día estudiado, aunque no dé XP (repasar también es estudiar)
      diasActivos: marcarActivo(estado),
    });
  },
  // Suma el XP al total solo la primera vez que se termina la lección
  terminarHistoria(clave: string) {
    const primeraVez = !estado.completadas[clave];
    // Un regalo de doble XP se usa en la siguiente parada que termines por primera vez
    const doble = primeraVez && estado.dobleXP;
    const xpLeccion = (estado.historias[clave]?.xp ?? 0) * (doble ? 2 : 1);
    const { [clave]: _, ...resto } = estado.historias;
    guardar({
      ...estado,
      dobleXP: estado.dobleXP && !doble,
      xp: estado.xp + (primeraVez ? xpLeccion : 0),
      historias: resto,
      completadas: { ...estado.completadas, [clave]: estado.completadas[clave] ?? new Date().toISOString() },
      diasActivos: marcarActivo(estado),
    });
  },
  guardarPerfil(perfil: Perfil) {
    guardar({ ...estado, perfil: { ...perfil, nombre: perfil.nombre.trim() } });
  },
  // Descuenta los XP y deja la prenda puesta; devuelve false si no alcanzan
  comprar(clave: string, precio: number): boolean {
    if (estado.comprados.includes(clave)) return true;
    if (estado.xp < precio) return false;
    guardar({ ...estado, xp: estado.xp - precio, comprados: [...estado.comprados, clave] });
    return true;
  },
  // Premio al terminar una unidad: se cobra una sola vez
  reclamarPremio(unidad: string, xp: number): boolean {
    if (estado.premios.includes(unidad)) return false;
    guardar({ ...estado, xp: estado.xp + xp, premios: [...estado.premios, unidad] });
    return true;
  },
  // Regalo de monedas del camino: se abre una sola vez y entrega lo que salió
  abrirRegalo(clave: string, regalo: Regalo): boolean {
    if (estado.regalos[clave]) return false;
    guardar({
      ...estado,
      regalos: { ...estado.regalos, [clave]: regalo.titulo },
      xp: estado.xp + (regalo.tipo === 'xp' ? regalo.cantidad : 0),
      comprados: regalo.tipo === 'prenda' ? [...estado.comprados, regalo.clave] : estado.comprados,
      dobleXP: estado.dobleXP || regalo.tipo === 'doble',
    });
    return true;
  },
  alternarSonido() {
    guardar({ ...estado, sonido: !estado.sonido });
  },
  reiniciar() {
    guardar(vacio);
  },
};

// Lectura fuera de React (por ejemplo, para saber si suena o no)
export function progresoActual(): Progreso {
  return estado;
}

export function useProgreso(): Progreso {
  const suscribir = useCallback((f: () => void) => {
    oyentes.add(f);
    return () => oyentes.delete(f);
  }, []);
  return useSyncExternalStore(suscribir, () => estado);
}

// Racha: días hábiles seguidos con actividad. Sábado y domingo no la rompen,
// y hoy cuenta solo si ya estudiaste (si no, la racha de ayer sigue viva).
export function calcularRacha(diasActivos: string[], ahora = new Date()): number {
  const activos = new Set(diasActivos);
  const dia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const esHabil = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6;
  const retroceder = () => dia.setDate(dia.getDate() - 1);

  if (!activos.has(hoyLocal(dia))) retroceder();
  let racha = 0;
  for (let i = 0; i < 400; i++) {
    if (!esHabil(dia)) { retroceder(); continue; }
    if (!activos.has(hoyLocal(dia))) break;
    racha++;
    retroceder();
  }
  return racha;
}
