// Motor SQL en el dispositivo (sql.js = SQLite compilado a WebAssembly).
// Cada ejecución usa una base nueva con el dataset: el alumno no puede romper la tabla.
import initSqlJs, { type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { Ejercicio } from './contenido';

let motor: Promise<SqlJsStatic> | null = null;
export function cargarMotor(): Promise<SqlJsStatic> {
  motor ??= initSqlJs({ locateFile: () => wasmUrl });
  return motor;
}

type Valor = string | number | null | Uint8Array;

export interface Resultado {
  columnas: string[];
  filas: Valor[][];
}

export type Ejecucion =
  | { ok: true; resultado: Resultado | null; ms: number }
  | { ok: false; error: string; original: string };

export async function ejecutar(dataset: string, consulta: string): Promise<Ejecucion> {
  const SQL = await cargarMotor();
  const db = new SQL.Database();
  try {
    db.run(dataset);
    const inicio = performance.now();
    // Sentencia por sentencia: db.exec() omite las consultas con 0 filas,
    // y "0 filas" es justo el resultado que más hay que explicar.
    let resultado: Resultado | null = null;
    for (const sentencia of db.iterateStatements(consulta)) {
      const columnas = sentencia.getColumnNames();
      const filas: Valor[][] = [];
      while (sentencia.step()) filas.push(sentencia.get() as Valor[]);
      if (columnas.length) resultado = { columnas, filas };
      sentencia.free();
    }
    return { ok: true, ms: performance.now() - inicio, resultado };
  } catch (e) {
    const original = e instanceof Error ? e.message : String(e);
    return { ok: false, error: explicarError(original), original };
  } finally {
    db.close();
  }
}

// Traduce los errores de SQLite a una explicación que enseña (estándar docente-datos).
export function explicarError(msg: string): string {
  let m: RegExpMatchArray | null;
  if ((m = msg.match(/no such column: (.+)$/i))) {
    return `No existe una columna llamada "${m[1]}". Revisa cómo está escrita en la tabla. Si es un texto como 'Norte', ponlo entre comillas simples.`;
  }
  if ((m = msg.match(/no such table: (.+)$/i))) {
    return `No existe una tabla llamada "${m[1]}". En esta semana la tabla se llama ventas.`;
  }
  if (/near "FROM": syntax error/i.test(msg)) {
    return 'SQL se confundió justo antes de FROM. ¿Dejaste una coma después de la última columna?';
  }
  if ((m = msg.match(/near "(.+?)": syntax error/i))) {
    return `SQL no entendió lo que escribiste cerca de "${m[1]}". Revisa el orden SELECT → FROM → WHERE, las comas y las comillas.`;
  }
  if (/incomplete input/i.test(msg)) {
    return 'La consulta quedó incompleta. ¿Falta algo después de FROM o de WHERE?';
  }
  if (/unrecognized token: "'/i.test(msg)) {
    return 'Hay una comilla sin cerrar. Los textos van entre dos comillas simples: \'Norte\'.';
  }
  return 'SQL encontró un problema en la consulta. Lee el mensaje original de abajo y revisa la línea indicada.';
}

export type Veredicto =
  | { estado: 'correcto'; mensaje: string }
  | { estado: 'casi' | 'incorrecto'; mensaje: string };

const clave = (fila: Valor[]) => JSON.stringify(fila);

// Compara el resultado del alumno contra el de la solución.
// Los nombres de columna no importan (se permiten alias); el orden de filas solo si el ejercicio lo pide.
export function comparar(alumno: Resultado | null, esperado: Resultado, ej: Ejercicio): Veredicto {
  if (!alumno) {
    return { estado: 'incorrecto', mensaje: 'Tu consulta no devolvió ninguna tabla. Empieza con SELECT … FROM ventas;' };
  }
  const nc = alumno.columnas.length;
  const ne = esperado.columnas.length;
  const nf = alumno.filas.length;
  const nfe = esperado.filas.length;

  if (nc !== ne) {
    return {
      estado: 'incorrecto',
      mensaje: `Tu resultado tiene ${nc} columna${nc === 1 ? '' : 's'} y se esperaban ${ne}. Vuelve a leer qué datos pide el ejercicio${nc === 1 && ne > 1 ? ' y revisa las comas entre columnas' : ''}.`,
    };
  }
  if (nf !== nfe) {
    let porque = '';
    if (nf === 0) porque = ' Cero filas suele significar que el valor no está escrito igual que en la tabla (mayúsculas, acentos, comillas).';
    else if (nf > nfe) porque = ' Te sobran filas: ¿falta el WHERE o la condición deja pasar de más? Revisa > contra >=.';
    else porque = ' Te faltan filas: ¿la condición es demasiado estricta? Revisa > contra >= y el valor que comparas.';
    return { estado: 'incorrecto', mensaje: `Obtuviste ${nf} fila${nf === 1 ? '' : 's'} y se esperaban ${nfe}.${porque}` };
  }

  const ordenar = (filas: Valor[][]) => (ej.orden_importa ? filas.map(clave) : filas.map(clave).sort());
  const a = ordenar(alumno.filas);
  const b = ordenar(esperado.filas);
  if (a.every((f, i) => f === b[i])) {
    return { estado: 'correcto', mensaje: `¡Correcto! ${nfe} fila${nfe === 1 ? '' : 's'} y ${ne} columna${ne === 1 ? '' : 's'}, igual que la solución.` };
  }

  // ¿Las mismas filas, pero en otro orden? (pasa al olvidar DESC o al ordenar por otra columna)
  if (ej.orden_importa) {
    const fa = alumno.filas.map(clave).sort();
    const fb = esperado.filas.map(clave).sort();
    if (fa.every((f, i) => f === fb[i])) {
      return {
        estado: 'casi',
        mensaje: 'Casi: tienes las filas correctas, pero en otro orden. Revisa la columna de ORDER BY y si va de menor a mayor (ASC) o de mayor a menor (DESC).',
      };
    }
  }

  // ¿Mismas columnas pero en otro orden?
  const porColumna = (r: Resultado) => r.columnas.map((_, j) => JSON.stringify(r.filas.map((f) => f[j]).map(String).sort())).sort();
  const ca = porColumna(alumno);
  const cb = porColumna(esperado);
  if (ca.every((c, i) => c === cb[i])) {
    return {
      estado: 'casi',
      mensaje: 'Casi: tienes los datos correctos, pero las columnas van en otro orden. El orden en SELECT es el orden del resultado.',
    };
  }
  return {
    estado: 'incorrecto',
    mensaje: 'Tienes el número correcto de filas y columnas, pero los datos no coinciden. Revisa que elegiste las columnas que pide el ejercicio.',
  };
}
