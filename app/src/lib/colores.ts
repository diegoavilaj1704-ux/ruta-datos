// Color de cada módulo en el mapa: el fondo va en degradado del color principal al profundo
// (maqueta aprobada: docs/maquetas/mapa-degradados.html, propuesta A). Por etapa:
// Fundamentos en violetas y azules, Data Analyst en verdes, Data Scientist en corales y
// naranjas, Data Engineer en azules oscuros.

export interface ColorModulo { principal: string; profundo: string }

const PALETA: [string, string][] = [
  ['#4B6BFB', '#1B2A7A'], // M1
  ['#6C4CF1', '#2A1670'], // M2 SQL desde cero
  ['#E0569B', '#5C1440'], // M3 SQL para análisis
  ['#3A86C8', '#123A5E'], // M4
  ['#0E9F9A', '#06433F'], // M5
  ['#1FA463', '#0B4A2A'], // M6
  ['#5BAA2E', '#284B12'], // M7
  ['#0A8FB5', '#04394A'], // M8
  ['#FF6B5B', '#7A1F16'], // M9
  ['#F08A24', '#6E3504'], // M10
  ['#E8A317', '#5E3F00'], // M11
  ['#C2410C', '#4A1704'], // M12
  ['#2B4BEE', '#0E1B66'], // M13
  ['#3A3658', '#121022'], // M14
  ['#6E56CF', '#251A55'], // M15
  ['#14B8A6', '#06463F'], // M16
  ['#4B6BFB', '#101C5C'], // M17
  ['#7C3AED', '#2A0F5E'], // M18
  ['#0EA5E9', '#073B54'], // M19
];

// "m02-sql" → módulo 2
export function colorModulo(idModulo: string): ColorModulo {
  const n = Number(/^m(\d+)/.exec(idModulo)?.[1] ?? 2);
  const [principal, profundo] = PALETA[(n - 1) % PALETA.length] ?? PALETA[1];
  return { principal, profundo };
}
