// Verifica que cada ejercicios.json coincide con su dataset:
// corre la solución con sql.js y compara contra filas_esperadas.
// Uso: npm run verificar
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../../contenido');
const SQL = await initSqlJs();

function buscar(dir, nombre, hallados = []) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) buscar(ruta, nombre, hallados);
    else if (entrada === nombre) hallados.push(ruta);
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

if (fallas) {
  console.error(`\n${fallas} ejercicio(s) no coinciden con el dataset.`);
  process.exit(1);
}
console.log('\nTodos los ejercicios coinciden con el dataset.');
