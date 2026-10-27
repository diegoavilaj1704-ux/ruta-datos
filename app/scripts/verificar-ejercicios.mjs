// Verifica que cada ejercicios.json coincide con su dataset:
// corre la solución con sql.js y compara contra filas_esperadas.
// También revisa las historias (*.historia.yaml): que los retos apunten a un
// ejercicio existente y que los ejemplos de la terminal corran sin error.
// Uso: npm run verificar
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';
import { parse as parseYaml } from 'yaml';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../../contenido');
const SQL = await initSqlJs();

function buscar(dir, nombre, hallados = []) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) buscar(ruta, nombre, hallados);
    else if (typeof nombre === 'string' ? entrada === nombre : nombre.test(entrada)) hallados.push(ruta);
  }
  return hallados;
}

let fallas = 0;
for (const archivo of buscar(raiz, 'ejercicios.json')) {
  const carpeta = dirname(archivo);
  const semana = JSON.parse(readFileSync(join(carpeta, 'semana.json'), 'utf8'));
  const dataset = readFileSync(resolve(carpeta, semana.dataset), 'utf8');
  const { ejercicios } = JSON.parse(readFileSync(archivo, 'utf8'));

  for (const ej of ejercicios) {
    const db = new SQL.Database();
    db.run(dataset);
    const res = db.exec(ej.solucion);
    const filas = res.length ? res[res.length - 1].values.length : 0;
    const ok = filas === ej.filas_esperadas;
    if (!ok) fallas++;
    console.log(`${ok ? '✔' : '✘'} ${ej.id}: ${filas} filas (esperadas ${ej.filas_esperadas})`);
    db.close();
  }
}

for (const archivo of buscar(raiz, /\.historia\.yaml$/)) {
  const carpeta = dirname(archivo);
  const semana = JSON.parse(readFileSync(join(carpeta, 'semana.json'), 'utf8'));
  const dataset = readFileSync(resolve(carpeta, semana.dataset), 'utf8');
  const ejercicios = new Map(JSON.parse(readFileSync(join(carpeta, 'ejercicios.json'), 'utf8')).ejercicios.map((e) => [e.id, e]));
  const { pasos } = parseYaml(readFileSync(archivo, 'utf8'));
  const nombre = basename(archivo);

  pasos.forEach((p, i) => {
    let error = null;
    if ((p.tipo === 'armar' || p.tipo === 'escribir') && !ejercicios.has(p.ejercicio)) error = `el ejercicio ${p.ejercicio} no existe`;
    // Las piezas de un reto deben alcanzar para armar la solución
    else if (p.tipo === 'armar') {
      const sol = ejercicios.get(p.ejercicio).solucion.replace(/\s+/g, ' ').trim();
      if (!sol.startsWith(p.antes) || !sol.endsWith(p.despues)) error = 'la solución no empieza con `antes` o no termina con `despues`';
      else {
        const faltan = [...sol.slice(p.antes.length, sol.length - p.despues.length).replace(/,/g, ' , ').trim().split(/\s+/)];
        const disponibles = [...p.piezas];
        for (const t of faltan) {
          const k = disponibles.indexOf(t);
          if (k === -1) { error = `falta la pieza «${t}» para armar la solución`; break; }
          disponibles.splice(k, 1);
        }
      }
    }
    if (p.tipo === 'error' && !(p.error >= 0 && p.error < p.piezas.length)) error = 'el índice del error está fuera de las piezas';
    if (p.tipo === 'quiz' && p.opciones.filter((o) => o.correcta).length !== 1) error = 'el quiz debe tener exactamente una opción correcta';
    if (p.tipo === 'terminal' || p.tipo === 'tabla') {
      const db = new SQL.Database();
      db.run(dataset);
      try { db.exec(p.codigo ?? p.consulta); } catch (e) { error = `la consulta falla: ${e.message}`; }
      db.close();
    }
    if (error) { fallas++; console.log(`✘ ${nombre} paso ${i + 1} (${p.tipo}): ${error}`); }
  });
  console.log(`✔ ${nombre}: ${pasos.length} pasos revisados`);
}

if (fallas) {
  console.error(`\n${fallas} problema(s) en ejercicios o historias.`);
  process.exit(1);
}
console.log('\nTodos los ejercicios e historias coinciden con el dataset.');
