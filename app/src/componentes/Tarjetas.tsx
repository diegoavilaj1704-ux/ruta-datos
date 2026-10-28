// Una tarjeta por tipo de paso de la historia (lib/historia.ts).
// Las interactivas llaman onResuelto(xp) cuando quien estudia ya puede continuar.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Ejercicio, Sesion } from '../lib/contenido';
import { unirPiezas, type Mensaje, type Paso } from '../lib/historia';
import { nombreDe, type Quien } from '../lib/personajes';
import { reaccionar } from '../lib/reacciones';
import { sonidos } from '../lib/sonidos';
import { comparar, ejecutar, type Resultado } from '../lib/sql';
import { acciones, calcularRacha, progresoActual, useProgreso } from '../lib/progreso';
import { Avatar } from './Avatar';
import { TextoEnLinea } from './Markdown';

type Props<T extends Paso['tipo']> = {
  paso: Extract<Paso, { tipo: T }>;
  sesion: Sesion;
  onResuelto: (xp: number) => void;
};

// ---------- Piezas comunes ----------

export function Burbuja({ quien, texto, nueva }: Mensaje & { nueva?: boolean }) {
  const yo = quien === 'yo';
  return (
    <div className={`msj ${yo ? 'yo' : ''} ${nueva ? 'entra' : ''}`}>
      <Avatar quien={quien} tam={38} />
      <div className="burbuja">
        <span className="quien">{nombreDe(quien, progresoActual().perfil)}</span>
        <TextoEnLinea texto={texto} />
      </div>
    </div>
  );
}

function TipHashy({ texto, quien = 'hashy' }: { texto: string; quien?: Quien }) {
  return (
    <div className="tip-fer entra">
      <Avatar quien={quien} tam={40} />
      <p>
        <strong>{quien === 'yo' ? 'Pista' : `Tip de ${nombreDe(quien)}`}:</strong> <TextoEnLinea texto={texto} />
      </p>
    </div>
  );
}

// Colorea una línea de SQL como en la terminal
function resaltarSQL(linea: string): ReactNode[] {
  if (/^\s*--/.test(linea)) return [<span key={0} className="sx-com">{linea}</span>];
  return linea.split(/('[^']*'|\b(?:SELECT|FROM|WHERE|LIMIT|AND|OR)\b|[,;*()]|<>|>=|<=|[=<>])/i).map((t, i) => {
    if (!t) return null;
    if (/^(SELECT|FROM|WHERE|LIMIT|AND|OR)$/i.test(t)) return <span key={i} className="sx-kw">{t}</span>;
    if (t.startsWith("'")) return <span key={i} className="sx-str">{t}</span>;
    if (/^[,;*()=<>]+$/.test(t)) return <span key={i} className="sx-sim">{t}</span>;
    return <span key={i} className="sx-id">{t}</span>;
  });
}

export function Terminal({ children, archivo = 'ventas.db' }: { children: ReactNode; archivo?: string }) {
  return (
    <div className="terminal">
      <div className="terminal-barra">
        <i className="p1" /><i className="p2" /><i className="p3" />
        <span>{archivo}</span>
      </div>
      {children}
    </div>
  );
}

export function Codigo({ codigo, cursor }: { codigo: string; cursor?: boolean }) {
  const lineas = codigo.replace(/\n$/, '').split('\n');
  return (
    <div className="terminal-codigo">
      {lineas.map((l, i) => (
        <div key={i}>
          <span className="ln">{i + 1}</span>
          {resaltarSQL(l)}
          {cursor && i === lineas.length - 1 && <span className="cursor" />}
        </div>
      ))}
    </div>
  );
}

// Resultado "impreso" en la terminal
export function Salida({ resultado, mensaje, tipo }: { resultado?: Resultado | null; mensaje?: string; tipo?: 'ok' | 'mal' }) {
  const max = 4;
  return (
    <div className="terminal-salida entra">
      {mensaje && <div className={tipo === 'mal' ? 'sal-mal' : 'sal-ok'}>{tipo === 'mal' ? '✗ ' : '✓ '}{mensaje}</div>}
      {resultado && (
        <div className="sal-tabla">
          <table>
            <thead><tr>{resultado.columnas.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
            <tbody>
              {resultado.filas.slice(0, max).map((f, i) => (
                <tr key={i}>{f.map((v, j) => <td key={j}>{v === null ? 'NULL' : String(v)}</td>)}</tr>
              ))}
            </tbody>
          </table>
          {resultado.filas.length > max && <div className="sal-mas">… {resultado.filas.length - max} filas más</div>}
        </div>
      )}
    </div>
  );
}

const plural = (n: number, s: string) => `${n} ${s}${n === 1 ? '' : 's'}`;

function buscarEjercicio(sesion: Sesion, id: string): Ejercicio {
  const ej = sesion.ejercicios.find((e) => e.id === id);
  if (!ej) throw new Error(`No existe el ejercicio ${id} en ejercicios.json`);
  return ej;
}

// Corre la consulta del alumno y la compara con la solución del ejercicio
async function calificar(sesion: Sesion, ej: Ejercicio, sql: string) {
  const [mia, sol] = await Promise.all([ejecutar(sesion.dataset, sql), ejecutar(sesion.dataset, ej.solucion)]);
  if (!mia.ok) return { bien: false, mensaje: mia.error, resultado: null };
  if (!sol.ok || !sol.resultado) return { bien: false, mensaje: 'No se pudo correr la solución.', resultado: null };
  const v = comparar(mia.resultado, sol.resultado, ej);
  const r = mia.resultado;
  return {
    bien: v.estado === 'correcto',
    mensaje: v.estado === 'correcto' && r ? `${plural(r.filas.length, 'fila')} · ${plural(r.columnas.length, 'columna')}` : v.mensaje,
    resultado: v.estado === 'correcto' ? r : null,
  };
}

function Ganaste({ xp }: { xp: number }) {
  return xp > 0 ? <span className="xp-ganado">+{xp} XP</span> : null;
}

// ---------- Tarjetas ----------

export function Portada({ sesion }: { sesion: Sesion }) {
  const n = sesion.historia?.pasos.length ?? 0;
  return (
    <div className="t-portada">
      <div className="portada-caras">
        <Avatar quien="rafa" tam={84} />
        <Avatar quien="yo" tam={84} />
      </div>
      <p className="etiqueta-mod">{sesion.modulo.nombre} · Unidad {sesion.semana.numero}</p>
      <h1>{sesion.meta.titulo}</h1>
      <p className="objetivo">{sesion.meta.objetivo}</p>
      <div className="chips-info">
        <span>⏱ {sesion.meta.duracion_min} min</span>
        <span>{n} tarjetas</span>
      </div>
    </div>
  );
}

export function Chat({ paso, onResuelto }: Props<'chat'>) {
  const [vistos, setVistos] = useState(1);
  const total = paso.mensajes.length;
  useEffect(() => {
    if (vistos >= total) {
      onResuelto(0);
      return;
    }
    const t = setTimeout(() => setVistos((n) => n + 1), 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vistos, total]);
  return (
    <div className="t-chat" onClick={() => setVistos(total)}>
      {paso.mensajes.slice(0, vistos).map((m, i) => <Burbuja key={i} {...m} nueva />)}
      {vistos < total && <div className="escribiendo"><span /><span /><span /></div>}
    </div>
  );
}

export function TablaDatos({ paso, sesion }: Props<'tabla'>) {
  const [res, setRes] = useState<Resultado | null>(null);
  useEffect(() => {
    ejecutar(sesion.dataset, paso.consulta).then((e) => e.ok && setRes(e.resultado));
  }, [paso.consulta, sesion.dataset]);
  return (
    <div className="t-col">
      <Burbuja quien={paso.quien ?? 'yo'} texto={paso.texto} />
      {res && (
        <div className="tabla-datos entra">
          <div className="tabla-nombre">ventas</div>
          <div className="tabla-scroll">
            <table>
              <thead><tr>{res.columnas.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>{res.filas.map((f, i) => <tr key={i}>{f.map((v, j) => <td key={j}>{String(v)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
      {paso.nota && <p className="nota-suave">{paso.nota}</p>}
    </div>
  );
}

export function Idea({ paso }: Props<'idea'>) {
  return (
    <div className="t-col">
      {paso.quien && <Avatar quien={paso.quien} tam={56} />}
      <div className="t-idea entra">
        <span className="rotulo">La idea</span>
        <p><TextoEnLinea texto={paso.texto} /></p>
      </div>
      {paso.nota && <p className="nota-suave"><TextoEnLinea texto={paso.nota} /></p>}
    </div>
  );
}

export function Analogia({ paso }: Props<'analogia'>) {
  return (
    <div className="t-col">
      <div className="t-analogia entra">
        <div className="analogia-cabeza">
          <Avatar quien={paso.quien} tam={44} />
          <h2>{paso.titulo}</h2>
        </div>
        <p><TextoEnLinea texto={paso.texto} /></p>
      </div>
      {paso.limite && <div className="t-ojo entra"><strong>Dónde no aplica.</strong> <TextoEnLinea texto={paso.limite} /></div>}
    </div>
  );
}

export function Conceptos({ paso }: Props<'conceptos'>) {
  return (
    <div className="t-col">
      {paso.titulo && <h2 className="titulo-reto">{paso.titulo}</h2>}
      {paso.items.map((it, i) => (
        <div key={it.codigo} className="concepto entra" style={{ animationDelay: `${i * 150}ms` }}>
          <code className="tecla-grande">{it.codigo}</code>
          <span>{it.significado}</span>
        </div>
      ))}
      {paso.nota && <p className="nota-suave"><TextoEnLinea texto={paso.nota} /></p>}
    </div>
  );
}

export function TerminalDemo({ paso, sesion, onResuelto }: Props<'terminal'>) {
  const [salida, setSalida] = useState<{ r: Resultado | null; m: string } | null>(null);
  async function correr() {
    const e = await ejecutar(sesion.dataset, paso.codigo);
    if (e.ok && e.resultado) {
      setSalida({ r: e.resultado, m: `${plural(e.resultado.filas.length, 'fila')} · ${plural(e.resultado.columnas.length, 'columna')}` });
      reaccionar('acierto');
      onResuelto(5);
    }
  }
  return (
    <div className="t-col">
      <Burbuja quien={paso.quien ?? 'yo'} texto={paso.texto} />
      <Terminal>
        <Codigo codigo={paso.codigo} cursor={!salida} />
        {salida && <Salida resultado={salida.r} mensaje={salida.m} />}
      </Terminal>
      {!salida && <button className="boton-juego" onClick={correr}>EJECUTAR ▶</button>}
      {salida && paso.despues && <p className="nota-suave entra"><TextoEnLinea texto={paso.despues} /></p>}
    </div>
  );
}

export function Armar({ paso, sesion, onResuelto }: Props<'armar'>) {
  const ej = buscarEjercicio(sesion, paso.ejercicio);
  const [usadas, setUsadas] = useState<number[]>([]);
  const [salida, setSalida] = useState<{ bien: boolean; mensaje: string; resultado: Resultado | null } | null>(null);
  const [intentos, setIntentos] = useState(0);
  const resuelto = salida?.bien ?? false;
  const armado = unirPiezas(usadas.map((i) => paso.piezas[i]));
  const lineas = paso.antes.split('\n');

  function tocar(i: number) {
    if (resuelto) return;
    setUsadas((u) => [...u, i]);
    setSalida(null);
  }
  function borrar() {
    setUsadas((u) => u.slice(0, -1));
    setSalida(null);
  }
  async function comprobar() {
    if (!usadas.length) {
      setSalida({ bien: false, mensaje: 'Toca las piezas de abajo para escribir la consulta.', resultado: null });
      return;
    }
    const r = await calificar(sesion, ej, `${paso.antes} ${armado} ${paso.despues}`);
    setSalida(r);
    reaccionar(r.bien ? 'acierto' : 'error');
    if (r.bien) onResuelto(intentos === 0 ? 10 : 5);
    else setIntentos((n) => n + 1);
  }

  return (
    <div className="t-col">
      {paso.encargo && <Burbuja {...paso.encargo} />}
      <h2 className="titulo-reto"><TextoEnLinea texto={paso.titulo} /></h2>
      <Terminal>
        <div className="terminal-codigo">
          {lineas.slice(0, -1).map((l, n) => <div key={n}><span className="ln">{n + 1}</span>{resaltarSQL(l)}</div>)}
          <div><span className="ln">{lineas.length}</span>{resaltarSQL(`${lineas[lineas.length - 1]} ${armado}`)}{!resuelto && <span className="cursor" />}</div>
          <div><span className="ln">{lineas.length + 1}</span>{resaltarSQL(paso.despues)}</div>
        </div>
        {salida && <Salida resultado={salida.resultado} mensaje={salida.mensaje} tipo={salida.bien ? 'ok' : 'mal'} />}
        {!resuelto && (
          <div className="teclado">
            {paso.piezas.map((p, i) => (
              <button key={i} className={`tecla-t ${/^[,;*]$/.test(p) ? 'sim' : ''} ${usadas.includes(i) ? 'usada' : ''}`} onClick={() => tocar(i)}>
                {p}
              </button>
            ))}
            <button className="tecla-t sim" onClick={borrar} disabled={!usadas.length} aria-label="Borrar la última pieza">⌫</button>
          </div>
        )}
      </Terminal>
      {resuelto ? <Ganaste xp={intentos === 0 ? 10 : 5} /> : <button className="boton-juego" onClick={comprobar}>EJECUTAR ▶</button>}
    </div>
  );
}

export function CazaError({ paso, onResuelto }: Props<'error'>) {
  const [mal, setMal] = useState<number | null>(null);
  const [hallado, setHallado] = useState(false);
  const [intentos, setIntentos] = useState(0);
  function tocar(i: number) {
    if (hallado) return;
    if (i === paso.error) {
      setHallado(true);
      reaccionar('acierto');
      onResuelto(intentos === 0 ? 10 : 5);
    } else {
      setMal(i);
      reaccionar('error');
      setIntentos((n) => n + 1);
      setTimeout(() => setMal(null), 500);
    }
  }
  return (
    <div className="t-col">
      <h2 className="titulo-reto">{paso.titulo}</h2>
      <Terminal archivo="consulta.sql">
        <div className="terminal-codigo caza">
          {paso.piezas.map((p, i) => (
            <button key={i} className={`pieza-caza ${mal === i ? 'sacude' : ''} ${hallado && i === paso.error ? 'tachada' : ''}`} onClick={() => tocar(i)}>
              {resaltarSQL(p)}
            </button>
          ))}
        </div>
        {hallado && <Salida mensaje={paso.explicacion} />}
        {intentos > 0 && !hallado && <Salida tipo="mal" mensaje={`Esa pieza está bien. ${paso.pista ?? 'Busca otra.'}`} />}
      </Terminal>
      {hallado && <Ganaste xp={intentos === 0 ? 10 : 5} />}
      {hallado && paso.tip && <TipHashy texto={paso.tip} />}
    </div>
  );
}

export function Tip({ paso }: Props<'tip'>) {
  return <TipHashy texto={paso.texto} quien={paso.quien} />;
}

const TECLAS = ['SELECT', 'FROM', 'WHERE', '*', ',', "'", ';', '=', '<>', '>', '<'];

export function Escribir({ paso, sesion, onResuelto }: Props<'escribir'>) {
  const ej = buscarEjercicio(sesion, paso.ejercicio);
  const [codigo, setCodigo] = useState('');
  const [salida, setSalida] = useState<{ bien: boolean; mensaje: string; resultado: Resultado | null } | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [pistas, setPistas] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);
  const resuelto = salida?.bien ?? false;

  function insertar(t: string) {
    const el = area.current;
    if (!el) return;
    let texto = /^[A-Z]+$/.test(t) ? `${t} ` : /^[*=<>]+$/.test(t) ? ` ${t} ` : t;
    // Sin espacios dobles: si ya hay uno antes del cursor, no se agrega otro
    if (/\s$/.test(el.value.slice(0, el.selectionStart)) || el.selectionStart === 0) texto = texto.trimStart();
    el.setRangeText(texto, el.selectionStart, el.selectionEnd, 'end');
    setCodigo(el.value);
    setSalida(null);
  }
  async function comprobar() {
    if (!codigo.trim()) {
      setSalida({ bien: false, mensaje: 'Escribe tu consulta en la terminal.', resultado: null });
      return;
    }
    const r = await calificar(sesion, ej, codigo);
    setSalida(r);
    reaccionar(r.bien ? 'acierto' : 'error');
    if (r.bien) onResuelto(intentos === 0 ? 10 : 5);
    else setIntentos((n) => n + 1);
  }

  return (
    <div className="t-col">
      {paso.encargo && <Burbuja {...paso.encargo} />}
      <h2 className="titulo-reto"><TextoEnLinea texto={paso.titulo} /></h2>
      <Terminal>
        <div className="terminal-escribir">
          <span className="ln">1</span>
          <textarea
            ref={area}
            value={codigo}
            onChange={(e) => { setCodigo(e.target.value); setSalida(null); }}
            readOnly={resuelto}
            placeholder="Escribe aquí tu consulta…"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            rows={3}
            aria-label="Terminal SQL"
          />
        </div>
        {salida && <Salida resultado={salida.resultado} mensaje={salida.mensaje} tipo={salida.bien ? 'ok' : 'mal'} />}
        {!resuelto && (
          <div className="teclado">
            {TECLAS.map((t) => (
              <button key={t} className={`tecla-t ${/^[A-Z]+$/.test(t) ? 'kw' : 'sim'}`} onPointerDown={(e) => e.preventDefault()} onClick={() => insertar(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
      </Terminal>
      {resuelto ? (
        <Ganaste xp={intentos === 0 ? 10 : 5} />
      ) : (
        <>
          <button className="boton-juego" onClick={comprobar}>EJECUTAR ▶</button>
          {ej.pistas.slice(0, pistas).map((p, i) => <TipHashy key={i} quien="yo" texto={p} />)}
          {pistas < ej.pistas.length && <button className="enlace-juego" onClick={() => setPistas((n) => n + 1)}>Necesito una pista</button>}
          {intentos >= 2 && pistas >= ej.pistas.length && (
            <details className="ver-solucion"><summary>Ver una solución</summary><code>{ej.solucion}</code></details>
          )}
        </>
      )}
    </div>
  );
}

export function Quiz({ paso, onResuelto }: Props<'quiz'>) {
  const [elegida, setElegida] = useState<number | null>(null);
  const correcta = paso.opciones.findIndex((o) => o.correcta);
  function elegir(i: number) {
    if (elegida !== null) return;
    setElegida(i);
    reaccionar(i === correcta ? 'acierto' : 'error');
    onResuelto(i === correcta ? 10 : 0);
  }
  return (
    <div className="t-col">
      {paso.etiqueta && <span className="etiqueta-repaso">{paso.etiqueta}</span>}
      <h2 className="titulo-reto"><TextoEnLinea texto={paso.pregunta} /></h2>
      {paso.opciones.map((o, i) => {
        const estado = elegida === null ? '' : i === correcta ? 'bien' : i === elegida ? 'mal' : 'apagada';
        return (
          <button key={i} className={`opcion-juego ${estado}`} onClick={() => elegir(i)}>
            <TextoEnLinea texto={o.texto} />
          </button>
        );
      })}
      {elegida !== null && (
        elegida === correcta ? (
          <div className="retro-juego bien entra">¡Bien! <Ganaste xp={10} /></div>
        ) : (
          <div className="retro-juego mal entra">
            <TextoEnLinea texto={paso.opciones[elegida].porque ?? 'No es esa.'} />
          </div>
        )
      )}
    </div>
  );
}

export function Resumen({ paso, sesion }: Props<'resumen'>) {
  const progreso = useProgreso();
  const xp = progreso.historias[sesion.clave]?.xp ?? 0;
  const racha = Math.max(1, calcularRacha(progreso.diasActivos));
  useEffect(() => {
    sonidos.fin();
  }, []);
  return (
    <div className="t-col">
      <div className="trofeo entra">🏆</div>
      <h1 className="titulo-fin">{paso.titulo ?? '¡Lección completada!'}</h1>
      <div className="metricas">
        <div><span>XP ganados</span><b>{xp}</b></div>
        <div><span>Racha</span><b>{plural(racha, 'día')}</b></div>
      </div>
      <div className="t-idea">
        <span className="rotulo">Para llevar</span>
        <ul className="ideas">{paso.ideas.map((t, i) => <li key={i}><TextoEnLinea texto={t} /></li>)}</ul>
      </div>
      {paso.cierre && <Burbuja {...paso.cierre} />}
    </div>
  );
}

// Nota pública del repaso: plantilla fija, borrador guardado en el teléfono y botón para compartir
export function Nota({ paso, sesion, onResuelto }: Props<'nota'>) {
  const progreso = useProgreso();
  const texto = progreso.notas[sesion.clave] ?? '';
  const [aviso, setAviso] = useState('');
  const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const lista = palabras >= 20;

  useEffect(() => {
    if (lista) onResuelto(10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lista]);

  async function compartir() {
    try {
      if (navigator.share) {
        await navigator.share({ text: texto });
        return;
      }
      await navigator.clipboard.writeText(texto);
      setAviso('Copiada. Pégala en LinkedIn, tu blog o GitHub.');
    } catch {
      setAviso('No se pudo compartir. Copia el texto a mano.');
    }
  }

  return (
    <div className="t-col">
      <h2 className="titulo-reto">{paso.titulo}</h2>
      <ol className="nota-plantilla">{paso.plantilla.map((t, i) => <li key={i}><TextoEnLinea texto={t} /></li>)}</ol>
      {paso.temas && (
        <details className="nota-desplegable">
          <summary>¿Sin idea? Temas sugeridos</summary>
          <ul>{paso.temas.map((t, i) => <li key={i}><TextoEnLinea texto={t} /></li>)}</ul>
        </details>
      )}
      <textarea
        className="nota-texto"
        value={texto}
        onChange={(e) => { acciones.guardarNota(sesion.clave, e.target.value); setAviso(''); }}
        placeholder="Esta semana aprendí…"
        rows={8}
        aria-label="Tu nota pública"
      />
      <p className="nota-cuenta">{palabras} palabras{palabras > 200 ? ' · intenta quedarte en 200' : lista ? '' : ' · escribe al menos 20 para continuar'}</p>
      {paso.ejemplo && (
        <details className="nota-desplegable">
          <summary>Ver una nota de ejemplo</summary>
          <p className="nota-ejemplo">{paso.ejemplo}</p>
          <small>Úsala como guía de tono: tu ejemplo y tu error deben ser tuyos.</small>
        </details>
      )}
      {lista && <button className="boton-juego secundario" onClick={compartir}>COMPARTIR MI NOTA</button>}
      {aviso && <p className="nota-cuenta">{aviso}</p>}
    </div>
  );
}
