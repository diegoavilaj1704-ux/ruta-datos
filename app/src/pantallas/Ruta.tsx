import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { tipsGenerales, unidades, type Concepto, type Sesion, type TipoParada, type Unidad } from '../lib/contenido';
import { acciones, calcularRacha, hoyLocal, useProgreso, type Progreso } from '../lib/progreso';
import { ejecutar, type Resultado } from '../lib/sql';
import { sonidos } from '../lib/sonidos';
import { Avatar } from '../componentes/Avatar';
import { HashyPaseo } from '../componentes/HashyPaseo';
import { TextoEnLinea } from '../componentes/Markdown';
import { Codigo, Salida, Terminal } from '../componentes/Tarjetas';

// Pantalla principal: el camino de la unidad, de arriba hacia abajo. Cada parada se abre al
// terminar la anterior; junto a cada parada alcanzada aparece una gráfica que se toca para repasar,
// Hashy se pasea dando tips y al final de la unidad espera una base de datos con XP.

const FILA = 136;            // distancia vertical entre paradas
const ARRIBA = 78;           // espacio para el globo de la primera parada
const VAIVEN = [0, -62, -78, -24, 56, 76, 22];   // desplazamiento horizontal de cada parada
const PREMIO_XP = 50;

type Estado = 'hecha' | 'actual' | 'bloqueada';
type Ficha =
  | { tipo: 'parada'; sesion: Sesion; unidad: Unidad }
  | { tipo: 'concepto'; concepto: Concepto; unidad: Unidad }
  | { tipo: 'unidad'; unidad: Unidad }
  | { tipo: 'fichas'; unidad: Unidad }
  | { tipo: 'premio'; unidad: Unidad }
  | { tipo: 'racha' };

const catalogo = unidades.flatMap((u) => u.sesiones);
const NOMBRE_TIPO: Record<TipoParada, string> = { leccion: 'Lección', proyecto: 'Mini-proyecto', repaso: 'Repaso y nota pública' };

function estadoDe(s: Sesion, p: Progreso): Estado {
  if (p.completadas[s.clave]) return 'hecha';
  return catalogo.find((x) => !p.completadas[x.clave]) === s ? 'actual' : 'bloqueada';
}

const abrir = (s: Sesion, modo: 's' | 't' = 's') => (location.hash = `#/${modo}/${encodeURIComponent(s.clave)}`);

export function Ruta() {
  const progreso = useProgreso();
  const racha = calcularRacha(progreso.diasActivos);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const conContenido = unidades.filter((u) => u.sesiones.length);
  const proximas = unidades.filter((u) => !u.sesiones.length);

  return (
    <main className="ruta">
      <header className="ruta-barra">
        <button className="ruta-yo" onClick={() => (location.hash = '#/perfil')} aria-label="Editar tu personaje">
          <Avatar quien="yo" tam={40} />
        </button>
        <span className="ruta-modulo">{unidades[0]?.modulo.nombre}</span>
        <button className="ruta-chip racha" onClick={() => setFicha({ tipo: 'racha' })} aria-label={`Racha de ${racha} días. Ver tu semana`}>▲ {racha}</button>
        <button className="ruta-chip xp" onClick={() => (location.hash = '#/closet')} aria-label={`${progreso.xp} XP. Abrir tu clóset`}>◆ {progreso.xp}</button>
        <button className="ruta-chip sonido" onClick={acciones.alternarSonido} aria-label={progreso.sonido ? 'Silenciar sonidos' : 'Activar sonidos'}>
          {progreso.sonido ? '🔊' : '🔇'}
        </button>
      </header>

      {conContenido.map((u) => <Camino key={u.id} unidad={u} progreso={progreso} abrirFicha={setFicha} />)}

      {proximas.length > 0 && (
        <section className="proximas">
          <p className="proximas-titulo">Lo que sigue en {proximas[0].modulo.nombre}</p>
          {proximas.map((u) => (
            <button key={u.id} className="isla-bloqueada" onClick={() => setFicha({ tipo: 'unidad', unidad: u })}>
              <span className="candado" aria-hidden="true">🔒</span>
              <span><small>Unidad {u.numero}</small><b>{u.titulo}</b></span>
            </button>
          ))}
        </section>
      )}

      {ficha && <HojaFicha ficha={ficha} progreso={progreso} cambiar={setFicha} cerrar={() => setFicha(null)} />}
    </main>
  );
}

// ---------- El camino de una unidad ----------

function Camino({ unidad, progreso, abrirFicha }: { unidad: Unidad; progreso: Progreso; abrirFicha: (f: Ficha) => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const actual = useRef<HTMLButtonElement>(null);
  const [ancho, setAncho] = useState(() => Math.min(innerWidth, 460));
  const paradas = unidad.sesiones;
  const hechas = paradas.filter((s) => progreso.completadas[s.clave]).length;
  const completa = hechas === paradas.length;
  const cobrado = progreso.premios.includes(unidad.id);

  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setAncho(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  // Al abrir, el camino se centra en la parada que toca
  useEffect(() => {
    actual.current?.scrollIntoView({ block: 'center' });
  }, []);

  const centro = ancho / 2;
  const punto = (i: number) => ({ x: centro + VAIVEN[i % VAIVEN.length], y: ARRIBA + i * FILA });
  const puntos = paradas.map((_, i) => punto(i));
  const premio = punto(paradas.length);
  const alto = premio.y + 90;
  const curva = (hasta: number) =>
    [...puntos, premio].slice(0, hasta + 1).reduce((d, p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const a = arr[i - 1];
      const m = (a.y + p.y) / 2;
      return `${d} C ${a.x} ${m}, ${p.x} ${m}, ${p.x} ${p.y}`;
    }, '');
  const iActual = paradas.findIndex((s) => estadoDe(s, progreso) === 'actual');

  // Lugares donde Hashy puede estar: del lado libre de cada parada (las gráficas van del otro)
  // y junto al premio. El primero es junto a la parada que toca, para que empiece ahí.
  const libre = (i: number, p: { x: number; y: number }) => {
    const izq = VAIVEN[i % VAIVEN.length] <= 0;
    return { x: Math.min(ancho - 52, Math.max(40, p.x + (izq ? -84 : 84))), y: p.y + 20 };
  };
  const lugares = [...puntos, premio].map((p, i) => libre(i, p));
  const inicio = iActual >= 0 ? iActual : paradas.length;
  const lugaresHashy = [lugares[inicio], ...lugares.filter((_, i) => i !== inicio)];

  // Tips: los de la unidad ya desbloqueados, los generales y un repaso de cada ficha que ya viste
  const terminada = (parada: string) => paradas.some((s) => s.parada.id === parada && progreso.completadas[s.clave]);
  const tips = [
    ...unidad.tipsHashy.filter((t) => !t.desde || terminada(t.desde)).map((t) => t.texto),
    ...tipsGenerales,
    ...unidad.conceptos.filter((c) => terminada(c.parada)).map((c) => `Repaso rápido de ${c.codigo}: ${c.significado}`),
  ];

  return (
    <section className="tramo">
      <div className="tarjeta-unidad">
        <button className="tu-info" onClick={() => abrirFicha({ tipo: 'unidad', unidad })}>
          <small>{unidad.modulo.nombre.split(' ')[0]} · Unidad {unidad.numero}</small>
          <b>{unidad.titulo}</b>
          <span className="tu-barra" aria-label={`${hechas} de ${paradas.length} paradas`}>
            <i style={{ width: `${(hechas / paradas.length) * 100}%` }} />
          </span>
        </button>
        <button className="tu-fichas" onClick={() => abrirFicha({ tipo: 'fichas', unidad })} aria-label="Fichas de los temas de la unidad">
          <span className="tu-llaves">{'{ }'}</span>
          <small>FICHAS</small>
        </button>
      </div>

      <div className="camino" ref={caja} style={{ height: alto }}>
        <svg className="camino-linea" width={ancho} height={alto} aria-hidden="true">
          <path d={curva(paradas.length)} className="linea-falta" />
          {hechas > 0 && <path d={curva(completa ? paradas.length : hechas)} className="linea-hecha" />}
        </svg>

        {paradas.map((s, i) => {
          const estado = estadoDe(s, progreso);
          const { x, y } = puntos[i];
          const enCurso = progreso.historias[s.clave];
          const total = s.historia?.pasos.length ?? 1;
          const avance = enCurso ? Math.max(0.08, enCurso.paso / total) : 0.04;
          const fichas = unidad.conceptos.filter((c) => c.parada === s.parada.id);
          const ladoIlus = VAIVEN[i % VAIVEN.length] <= 0 ? 1 : -1;
          return (
            <div key={s.clave}>
              {estado === 'actual' && (
                <>
                  <svg className="anillo" style={{ left: x - 50, top: y - 50 }} width="100" height="100" aria-hidden="true">
                    <circle cx="50" cy="50" r="45" className="anillo-fondo" />
                    <circle cx="50" cy="50" r="45" className="anillo-avance" strokeDasharray={`${avance * 283} 283`} transform="rotate(-90 50 50)" />
                  </svg>
                  <span className="globo-parada" style={{ left: x, top: y - 80 }}>{enCurso ? 'CONTINUAR' : 'EMPEZAR'}</span>
                </>
              )}
              <button
                ref={estado === 'actual' ? actual : undefined}
                className={`boton-parada ${estado}`}
                style={{ left: x, top: y }}
                onClick={() => abrirFicha({ tipo: 'parada', sesion: s, unidad })}
                aria-label={`${s.parada.corto}: ${estado === 'hecha' ? 'terminada' : estado === 'actual' ? 'te toca' : 'bloqueada'}`}
              >
                <IconoParada tipo={s.tipo} />
                {estado === 'hecha' && <span className="palomita" aria-hidden="true">✓</span>}
              </button>
              <span className={`nombre-parada ${estado}`} style={{ left: x, top: y + 37 }}>{s.parada.corto}</span>
              {/* Las gráficas aparecen conforme avanzas: tus datos crecen con el camino */}
              {fichas.length > 0 && estado !== 'bloqueada' && (
                <button
                  className={`ilustracion ${estado === 'hecha' ? '' : 'cerrada'}`}
                  style={{ left: x + ladoIlus * 104, top: y - 4 }}
                  onClick={() => abrirFicha(estado === 'hecha' ? { tipo: 'fichas', unidad } : { tipo: 'parada', sesion: s, unidad })}
                  aria-label={`Temas de ${s.parada.corto}`}
                >
                  <Grafica tipo={i} />
                  <span className="insignia">{estado === 'hecha' ? fichas.length : '🔒'}</span>
                </button>
              )}
            </div>
          );
        })}

        <button
          className={`premio ${cobrado ? 'cobrado' : completa ? 'listo' : 'cerrado'}`}
          style={{ left: premio.x, top: premio.y }}
          onClick={() => abrirFicha({ tipo: 'premio', unidad })}
          aria-label={`Premio de la unidad: ${PREMIO_XP} XP`}
        >
          <BaseDeDatos />
          <span>{cobrado ? '✓' : `+${PREMIO_XP}`}</span>
        </button>

        {unidad.tipsHashy.length > 0 && (
          <HashyPaseo lugares={lugaresHashy} tips={tips} />
        )}
      </div>
    </section>
  );
}

function IconoParada({ tipo }: { tipo: TipoParada }) {
  if (tipo === 'leccion') return <span className="icono-terminal">&gt;_</span>;
  if (tipo === 'proyecto') {
    return (
      <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden="true">
        <rect x="2" y="13" width="7" height="12" rx="2" /><rect x="11.5" y="6" width="7" height="19" rx="2" /><rect x="21" y="1" width="7" height="24" rx="2" />
      </svg>
    );
  }
  return <span className="icono-estrella">★</span>;
}

function BaseDeDatos() {
  return (
    <svg width="46" height="50" viewBox="0 0 46 50" aria-hidden="true">
      <path d="M3 9 V41 A20 7 0 0 0 43 41 V9" className="bd-lado" />
      <path d="M3 25 A20 7 0 0 0 43 25" className="bd-raya" />
      <ellipse cx="23" cy="9" rx="20" ry="7" className="bd-tapa" />
    </svg>
  );
}

// Gráficas pequeñas junto al camino: le dan al mapa su cara de datos
function Grafica({ tipo }: { tipo: number }) {
  const t = tipo % 4;
  return (
    <svg width="54" height="40" viewBox="0 0 54 40" aria-hidden="true">
      <line x1="4" y1="36" x2="50" y2="36" className="g-eje" />
      {t === 0 && (<><rect x="9" y="22" width="8" height="14" rx="2" className="g1" /><rect x="21" y="13" width="8" height="23" rx="2" className="g2" /><rect x="33" y="5" width="8" height="31" rx="2" className="g3" /></>)}
      {t === 1 && (<><line x1="4" y1="36" x2="4" y2="3" className="g-eje" /><circle cx="12" cy="29" r="3" className="g1" /><circle cx="20" cy="24" r="3" className="g2" /><circle cx="28" cy="26" r="3" className="g1" /><circle cx="36" cy="14" r="3" className="g3" /><circle cx="44" cy="8" r="3" className="g2" /><path d="M8 32 L48 6" className="g-tendencia" /></>)}
      {t === 2 && (<><path d="M27 20 L27 4 A16 16 0 0 1 42 25 Z" className="g3" /><path d="M27 20 L42 25 A16 16 0 1 1 27 4 Z" className="g2" /></>)}
      {t === 3 && (<><path d="M4 30 L14 24 L24 27 L34 14 L46 8" className="g-linea" /><circle cx="34" cy="14" r="3" className="g3" /></>)}
    </svg>
  );
}

// ---------- Hojas con información ----------

function HojaFicha({ ficha, progreso, cambiar, cerrar }: { ficha: Ficha; progreso: Progreso; cambiar: (f: Ficha) => void; cerrar: () => void }) {
  return (
    <div className="hoja-fondo" onClick={cerrar}>
      <div className="hoja" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <span className="hoja-asa" aria-hidden="true" />
        <button className="hoja-cerrar" onClick={cerrar} aria-label="Cerrar">✕</button>
        {ficha.tipo === 'parada' && <FichaParada {...ficha} progreso={progreso} cambiar={cambiar} />}
        {ficha.tipo === 'concepto' && <FichaConcepto {...ficha} progreso={progreso} cambiar={cambiar} />}
        {ficha.tipo === 'unidad' && <FichaUnidad unidad={ficha.unidad} progreso={progreso} cambiar={cambiar} />}
        {ficha.tipo === 'fichas' && <FichaFichas unidad={ficha.unidad} progreso={progreso} cambiar={cambiar} />}
        {ficha.tipo === 'premio' && <FichaPremio unidad={ficha.unidad} progreso={progreso} />}
        {ficha.tipo === 'racha' && <FichaRacha progreso={progreso} />}
      </div>
    </div>
  );
}

// Tu racha: las últimas dos semanas, con los días que contaron
function FichaRacha({ progreso }: { progreso: Progreso }) {
  const racha = calcularRacha(progreso.diasActivos);
  const hoy = hoyLocal();
  const estudiaste = progreso.diasActivos.includes(hoy);
  const lunes = new Date();
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7) - 7);
  const dias = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return { fecha: hoyLocal(d), letra: 'LMMJVSD'[i % 7], numero: d.getDate(), finde: i % 7 > 4 };
  });

  return (
    <div className="ficha">
      <span className="ficha-tipo actual">Tu racha</span>
      <h2>▲ {racha === 1 ? '1 día' : `${racha} días seguidos`}</h2>
      <div className="racha-semanas">
        {dias.map((d) => (
          <span key={d.fecha} className={`racha-dia ${progreso.diasActivos.includes(d.fecha) ? 'hecho' : ''} ${d.finde ? 'finde' : ''} ${d.fecha === hoy ? 'hoy' : ''} ${d.fecha > hoy ? 'futuro' : ''}`}>
            <small>{d.letra}</small>{d.numero}
          </span>
        ))}
      </div>
      <p className="ficha-texto">
        {estudiaste ? '¡Hoy ya cuenta! ' : 'Hoy todavía no cuenta: avanza al menos una tarjeta para sumar el día. '}
        La racha suma cada día de lunes a viernes en que avanzas una lección, un proyecto o un repaso. Sábado y domingo no la rompen.
      </p>
    </div>
  );
}

function FichaParada({ sesion, unidad, progreso, cambiar }: { sesion: Sesion; unidad: Unidad; progreso: Progreso; cambiar: (f: Ficha) => void }) {
  const estado = estadoDe(sesion, progreso);
  const fichas = unidad.conceptos.filter((c) => c.parada === sesion.parada.id);
  const resumen = sesion.historia?.pasos.find((p) => p.tipo === 'resumen');
  const anterior = unidad.sesiones[unidad.sesiones.indexOf(sesion) - 1];
  const enCurso = progreso.historias[sesion.clave];
  const total = sesion.historia?.pasos.length ?? 0;

  return (
    <div className="ficha">
      <span className={`ficha-tipo ${estado}`}>
        {NOMBRE_TIPO[sesion.tipo]} · {estado === 'hecha' ? '✓ Terminada' : estado === 'actual' ? 'Te toca' : '🔒 Bloqueada'}
      </span>
      <h2>{sesion.meta.titulo}</h2>
      <p className="ficha-texto">{sesion.meta.objetivo}</p>
      <p className="ficha-meta">⏱ {sesion.meta.duracion_min} min{total ? ` · ${total} tarjetas` : ''}</p>

      {estado === 'hecha' && resumen?.tipo === 'resumen' && (
        <div className="ficha-aprendiste">
          <span className="rotulo">Lo que aprendiste</span>
          <ul>{resumen.ideas.map((t, i) => <li key={i}><TextoEnLinea texto={t} /></li>)}</ul>
        </div>
      )}
      {fichas.length > 0 && (
        <div className="ficha-temas">
          <span className="rotulo">{estado === 'hecha' ? 'Toca un tema para repasarlo' : 'Lo que vas a aprender'}</span>
          <div>
            {fichas.map((c) => (
              <button key={c.id} className={`ficha-codigo ${estado === 'hecha' ? '' : 'cerrada'}`} onClick={() => cambiar({ tipo: 'concepto', concepto: c, unidad })}>
                {estado === 'hecha' ? c.codigo : c.titulo}
              </button>
            ))}
          </div>
        </div>
      )}

      {estado === 'bloqueada' ? (
        <p className="ficha-candado">🔒 Se abre cuando termines <b>{anterior?.parada.corto ?? 'la parada anterior'}</b>.</p>
      ) : (
        <>
          <button className="boton-juego" onClick={() => abrir(sesion)}>
            {estado === 'hecha' ? 'REPASAR' : enCurso ? `CONTINUAR · TARJETA ${enCurso.paso + 1} DE ${total}` : 'EMPEZAR'}
          </button>
          <button className="enlace-juego" onClick={() => abrir(sesion, 't')}>Leer la lección completa</button>
        </>
      )}
    </div>
  );
}

function FichaConcepto({ concepto, unidad, progreso, cambiar }: { concepto: Concepto; unidad: Unidad; progreso: Progreso; cambiar: (f: Ficha) => void }) {
  const sesion = unidad.sesiones.find((s) => s.parada.id === concepto.parada)!;
  const abierta = !!progreso.completadas[sesion.clave];
  const [salida, setSalida] = useState<{ resultado: Resultado | null; mensaje: string; ok: boolean } | null>(null);

  useEffect(() => setSalida(null), [concepto.id]);

  async function probar() {
    const r = await ejecutar(sesion.dataset, concepto.ejemplo!);
    setSalida(r.ok
      ? { resultado: r.resultado, ok: true, mensaje: `${r.resultado?.filas.length ?? 0} filas · ${r.resultado?.columnas.length ?? 0} columnas` }
      : { resultado: null, ok: false, mensaje: r.error });
  }

  if (!abierta) {
    return (
      <div className="ficha">
        <span className="ficha-tipo bloqueada">Tema · 🔒 Bloqueado</span>
        <h2>{concepto.titulo}</h2>
        <p className="ficha-candado">Lo vas a aprender en <b>{sesion.parada.corto}</b>. Termina esa parada y esta ficha se abre con su ejemplo.</p>
        <button className="enlace-juego" onClick={() => cambiar({ tipo: 'parada', sesion, unidad })}>Ver la parada {sesion.parada.corto}</button>
      </div>
    );
  }
  return (
    <div className="ficha">
      <span className="ficha-tipo hecha">Tema que ya viste</span>
      <div className="ficha-titulo-codigo">
        <code>{concepto.codigo}</code>
        <h2>{concepto.titulo}</h2>
      </div>
      <p className="ficha-texto"><TextoEnLinea texto={concepto.significado} /></p>
      {concepto.ejemplo && (
        <>
          <Terminal>
            <Codigo codigo={concepto.ejemplo} />
            {salida && <Salida resultado={salida.resultado} mensaje={salida.mensaje} tipo={salida.ok ? 'ok' : 'mal'} />}
          </Terminal>
          {!salida && <button className="boton-juego" onClick={probar}>PROBAR ▶</button>}
        </>
      )}
      <button className="enlace-juego" onClick={() => cambiar({ tipo: 'fichas', unidad })}>Ver todas las fichas</button>
    </div>
  );
}

// La chuleta de la unidad: todos los temas, abiertos los que ya viste
function FichaFichas({ unidad, progreso, cambiar }: { unidad: Unidad; progreso: Progreso; cambiar: (f: Ficha) => void }) {
  const abiertas = unidad.conceptos.filter((c) => unidad.sesiones.some((s) => s.parada.id === c.parada && progreso.completadas[s.clave]));
  return (
    <div className="ficha">
      <span className="ficha-tipo actual">Fichas · {abiertas.length} de {unidad.conceptos.length}</span>
      <h2>Lo que llevas de {unidad.titulo.toLowerCase()}</h2>
      <div className="lista-fichas">
        {unidad.conceptos.map((c) => {
          const abierta = abiertas.includes(c);
          return (
            <button key={c.id} className={`fila-ficha ${abierta ? '' : 'cerrada'}`} onClick={() => cambiar({ tipo: 'concepto', concepto: c, unidad })}>
              <code>{abierta ? c.codigo : '🔒'}</code>
              <span><b>{c.titulo}</b>{abierta && <small><TextoEnLinea texto={c.significado} /></small>}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FichaUnidad({ unidad, progreso, cambiar }: { unidad: Unidad; progreso: Progreso; cambiar: (f: Ficha) => void }) {
  const hechas = unidad.sesiones.filter((s) => progreso.completadas[s.clave]).length;
  return (
    <div className="ficha">
      <span className={`ficha-tipo ${unidad.sesiones.length ? 'actual' : 'bloqueada'}`}>
        {unidad.modulo.nombre} · Unidad {unidad.numero}{unidad.sesiones.length ? ` · ${hechas} de ${unidad.sesiones.length} paradas` : ' · próximamente'}
      </span>
      <h2>{unidad.titulo}</h2>
      <div className="ficha-aprendiste">
        <span className="rotulo">Temas</span>
        <ul>{unidad.temas.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
      {unidad.sesiones.length > 0 ? (
        <div className="ficha-lista">
          {unidad.sesiones.map((s) => {
            const e = estadoDe(s, progreso);
            return (
              <button key={s.clave} className={`ficha-fila ${e}`} onClick={() => cambiar({ tipo: 'parada', sesion: s, unidad })}>
                <span aria-hidden="true">{e === 'hecha' ? '✓' : e === 'actual' ? '▶' : '🔒'}</span>
                {s.meta.titulo}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="ficha-candado">🔒 Esta unidad se está escribiendo. Aparecerá en el camino en cuanto esté lista.</p>
      )}
    </div>
  );
}

function FichaPremio({ unidad, progreso }: { unidad: Unidad; progreso: Progreso }) {
  const faltan = unidad.sesiones.filter((s) => !progreso.completadas[s.clave]).length;
  const cobrado = progreso.premios.includes(unidad.id);
  const [recien, setRecien] = useState(false);

  function abrirPremio() {
    if (acciones.reclamarPremio(unidad.id, PREMIO_XP)) {
      sonidos.fin();
      setRecien(true);
    }
  }

  return (
    <div className="ficha ficha-premio">
      <Avatar quien="hashy" animo={cobrado || recien ? 'lentes' : 'feliz'} tam={88} />
      <span className={`ficha-tipo ${cobrado ? 'hecha' : faltan ? 'bloqueada' : 'actual'}`}>Premio de la unidad</span>
      {recien ? (
        <>
          <h2>¡+{PREMIO_XP} XP a tu base de datos!</h2>
          <p className="ficha-texto">Terminaste <b>{unidad.titulo}</b>. Gástalos en tu clóset.</p>
        </>
      ) : cobrado ? (
        <>
          <h2>Ya abriste esta base de datos</h2>
          <p className="ficha-texto">Guardaste {PREMIO_XP} XP al terminar <b>{unidad.titulo}</b>.</p>
        </>
      ) : faltan ? (
        <>
          <h2>Una base de datos con {PREMIO_XP} XP</h2>
          <p className="ficha-candado">🔒 Te {faltan === 1 ? 'falta 1 parada' : `faltan ${faltan} paradas`} para abrirla.</p>
        </>
      ) : (
        <>
          <h2>¡Terminaste la unidad!</h2>
          <p className="ficha-texto">Tu base de datos guarda {PREMIO_XP} XP de premio.</p>
          <button className="boton-juego" onClick={abrirPremio}>ABRIR · +{PREMIO_XP} XP</button>
        </>
      )}
    </div>
  );
}
