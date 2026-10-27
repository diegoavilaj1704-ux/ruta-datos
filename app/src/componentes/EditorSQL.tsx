import { useEffect, useRef, useState } from 'react';
import type { Ejercicio } from '../lib/contenido';
import { comparar, ejecutar, type Ejecucion, type Veredicto } from '../lib/sql';
import { acciones, useProgreso } from '../lib/progreso';
import { TextoEnLinea } from './Markdown';

// Teclas que en el teclado del iPhone están escondidas
const SIMBOLOS = ['*', ',', "'", ';', '=', '<>', '>', '<', '>=', '<=', '(', ')'];
const PALABRAS = ['SELECT', 'FROM', 'WHERE'];

interface Props {
  dataset: string;
  ejercicios?: Ejercicio[];
  codigoInicial?: string;
}

export function EditorSQL({ dataset, ejercicios = [], codigoInicial = '' }: Props) {
  const progreso = useProgreso();
  const [indice, setIndice] = useState(0);
  const ejercicio = ejercicios[indice] as Ejercicio | undefined;

  const [codigo, setCodigo] = useState(() =>
    ejercicio ? progreso.ejercicios[ejercicio.id]?.codigo ?? '' : codigoInicial,
  );
  const [ejecucion, setEjecucion] = useState<Ejecucion | null>(null);
  const [veredicto, setVeredicto] = useState<Veredicto | null>(null);
  const [pistasVistas, setPistasVistas] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [verSolucion, setVerSolucion] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  // Al cambiar de ejercicio, recupera su borrador
  useEffect(() => {
    if (!ejercicio) return;
    setCodigo(progreso.ejercicios[ejercicio.id]?.codigo ?? '');
    setEjecucion(null);
    setVeredicto(null);
    setPistasVistas(0);
    setIntentos(0);
    setVerSolucion(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ejercicio?.id]);

  useEffect(() => {
    if (!ejercicio) setCodigo(codigoInicial);
  }, [codigoInicial, ejercicio]);

  function cambiar(texto: string) {
    setCodigo(texto);
    setVeredicto(null);
    if (ejercicio) acciones.guardarEjercicio(ejercicio.id, texto);
  }

  function insertar(texto: string) {
    const el = area.current;
    if (!el) return;
    const relleno = /^[A-Z]+$/.test(texto) ? `${texto} ` : texto;
    el.setRangeText(relleno, el.selectionStart, el.selectionEnd, 'end');
    cambiar(el.value);
  }

  async function correr() {
    if (!codigo.trim()) return;
    setOcupado(true);
    setEjecucion(await ejecutar(dataset, codigo));
    setVeredicto(null);
    setOcupado(false);
  }

  async function comprobar() {
    if (!ejercicio || !codigo.trim()) return;
    setOcupado(true);
    const [mia, solucion] = await Promise.all([ejecutar(dataset, codigo), ejecutar(dataset, ejercicio.solucion)]);
    setEjecucion(mia);
    if (mia.ok && solucion.ok && solucion.resultado) {
      const v = comparar(mia.resultado, solucion.resultado, ejercicio);
      setVeredicto(v);
      setIntentos((n) => n + 1);
      if (v.estado === 'correcto') acciones.guardarEjercicio(ejercicio.id, codigo, true);
    } else {
      setVeredicto(null);
      setIntentos((n) => n + 1);
    }
    setOcupado(false);
  }

  return (
    <div className="editor">
      {ejercicios.length > 0 && (
        <div className="chips" role="tablist">
          {ejercicios.map((ej, i) => (
            <button
              key={ej.id}
              role="tab"
              aria-selected={i === indice}
              className={`chip ${i === indice ? 'activo' : ''} ${progreso.ejercicios[ej.id]?.resuelto ? 'resuelto' : ''}`}
              onClick={() => setIndice(i)}
            >
              {progreso.ejercicios[ej.id]?.resuelto ? '✓ ' : ''}
              {ej.titulo}
            </button>
          ))}
        </div>
      )}

      {ejercicio && (
        <div className="enunciado">
          <p>{ejercicio.enunciado}</p>
          {ejercicio.pistas.slice(0, pistasVistas).map((p, i) => (
            <p key={i} className="pista">💡 <TextoEnLinea texto={p} /></p>
          ))}
          {pistasVistas < ejercicio.pistas.length && (
            <button className="enlace" onClick={() => setPistasVistas((n) => n + 1)}>
              Ver pista
            </button>
          )}
        </div>
      )}

      <textarea
        ref={area}
        className="area-sql"
        value={codigo}
        onChange={(e) => cambiar(e.target.value)}
        placeholder="SELECT producto, cantidad&#10;FROM ventas;"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        rows={4}
        aria-label="Editor SQL"
      />

      <div className="teclas" aria-label="Atajos de teclado">
        {PALABRAS.map((p) => (
          <button key={p} className="tecla palabra" onPointerDown={(e) => e.preventDefault()} onClick={() => insertar(p)}>
            {p}
          </button>
        ))}
        {SIMBOLOS.map((s) => (
          <button key={s} className="tecla" onPointerDown={(e) => e.preventDefault()} onClick={() => insertar(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="acciones-editor">
        <button className="boton secundario" onClick={correr} disabled={ocupado || !codigo.trim()}>
          ▶ Ejecutar
        </button>
        {ejercicio && (
          <button className="boton" onClick={comprobar} disabled={ocupado || !codigo.trim()}>
            Comprobar
          </button>
        )}
      </div>

      {veredicto && (
        <div className={`veredicto ${veredicto.estado}`} role="status">
          {veredicto.mensaje}
        </div>
      )}

      {ejecucion && !ejecucion.ok && (
        <div className="veredicto incorrecto" role="alert">
          {ejecucion.error}
          <small className="original">Mensaje original: {ejecucion.original}</small>
        </div>
      )}

      {ejecucion?.ok && <TablaResultado ejecucion={ejecucion} />}

      {ejercicio && intentos >= 2 && veredicto?.estado !== 'correcto' && (
        <div className="solucion">
          {verSolucion ? (
            <pre><code>{ejercicio.solucion}</code></pre>
          ) : (
            <button className="enlace" onClick={() => setVerSolucion(true)}>
              ¿Atorado? Ver una solución
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TablaResultado({ ejecucion }: { ejecucion: Extract<Ejecucion, { ok: true }> }) {
  const r = ejecucion.resultado;
  if (!r) return <p className="nota-resultado">La consulta corrió, pero no devolvió ninguna tabla.</p>;
  return (
    <div className="resultado">
      <p className="nota-resultado">
        {r.filas.length} fila{r.filas.length === 1 ? '' : 's'} · {r.columnas.length} columna
        {r.columnas.length === 1 ? '' : 's'}
      </p>
      <div className="tabla-scroll">
        <table>
          <thead>
            <tr>{r.columnas.map((c, i) => <th key={i}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {r.filas.map((fila, i) => (
              <tr key={i}>
                {fila.map((v, j) => (
                  <td key={j} className={typeof v === 'number' ? 'num' : ''}>
                    {v === null ? <em>NULL</em> : String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
