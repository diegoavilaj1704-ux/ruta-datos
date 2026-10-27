// Convierte la sección "Revisa tu comprensión" del Markdown en preguntas interactivas.
// Formato esperado (el de la skill docente-datos):
//   **Pregunta 1.** enunciado
//   - a) opción
//   - b) opción ✅
//   > a) por qué está mal · c) por qué está mal

export interface Pregunta {
  enunciado: string;
  etiqueta?: string;          // "repaso del M1"
  opciones: { letra: string; texto: string; correcta: boolean; explicacion: string }[];
}

export function extraerPreguntas(md: string): Pregunta[] {
  const bloques = md.split(/\n(?=\*\*Pregunta \d+)/).filter((b) => b.trim().startsWith('**Pregunta'));
  return bloques.map((bloque) => {
    const lineas = bloque.trim().split('\n');
    const cabecera = lineas[0].match(/^\*\*Pregunta \d+\s*(?:\(([^)]*)\))?\.\*\*\s*(.*)$/);
    const etiqueta = cabecera?.[1];
    const enunciado = cabecera?.[2] ?? lineas[0];
    const opciones = lineas
      .filter((l) => /^- [a-z]\)/.test(l))
      .map((l) => {
        const m = l.match(/^- ([a-z])\)\s*(.*)$/)!;
        const correcta = m[2].includes('✅');
        return { letra: m[1], texto: m[2].replace('✅', '').trim(), correcta, explicacion: '' };
      });

    // Retroalimentación: "> a) texto · c) texto"
    const retro = lineas.filter((l) => l.startsWith('>')).map((l) => l.replace(/^>\s?/, '')).join(' ');
    for (const parte of retro.split(/\s·\s/)) {
      const m = parte.match(/^([a-z])\)\s*([\s\S]*)$/);
      const op = m && opciones.find((o) => o.letra === m[1]);
      if (op) op.explicacion = m![2].trim();
    }
    return { enunciado, etiqueta, opciones };
  });
}
