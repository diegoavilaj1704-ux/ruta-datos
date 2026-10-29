import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Moneda } from '../componentes/Moneda';
import { tipsGenerales, unidades, type Concepto, type Sesion, type TipoParada, type Unidad } from '../lib/contenido';
import { acciones, calcularRacha, hoyLocal, useProgreso, type Progreso } from '../lib/progreso';
import { ejecutar, type Resultado } from '../lib/sql';
import { sonidos } from '../lib/sonidos';
import { Avatar } from '../componentes/Avatar';
import { colorUnidad, type ColorModulo } from '../lib/colores';
import { elegirRegalo, regalosDeUnidad, type Regalo } from '../lib/regalos';
import { HashyPaseo } from '../componentes/HashyPaseo';
import { TextoEnLinea } from '../componentes/Markdown';
import { Codigo, Salida, Terminal } from '../componentes/Tarjetas';

// Pantalla principal: el camino de la unidad, de arriba hacia abajo, sobre un degradado del color
// de su módulo. Cada parada se abre al terminar la anterior; cada 3 paradas hay un regalo de
// monedas, Hashy se pasea dando tips y al final espera el banco con el premio de la unidad.

const FILA = 136;            // distancia vertical entre paradas
const ARRIBA = 96;           // espacio para el globo de la primera parada
const VAIVEN = [0, -62, -78, -24, 56, 76, 22];   // desplazamiento horizontal de cada parada
const PREMIO_XP = 50;

type Estado = 'hecha' | 'actual' | 'bloqueada';
type Ficha =
  | { tipo: 'parada'; sesion: Sesion; unidad: Unidad }
  | { tipo: 'concepto'; concepto: Concepto; unidad: Unidad }
  | { tipo: 'unidad'; unidad: Unidad }
  | { tipo: 'fichas'; unidad: Unidad }
  | { tipo: 'premio'; unidad: Unidad }
  | { tipo: 'racha' }
  | { tipo: 'regalo'; unidad: Unidad; clave: string; faltan: number };

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
  // Cada unidad con su degradado, en la familia de color de su módulo: una va de claro a profundo y
  // la siguiente de profundo a claro, así se unen por tonos parecidos; arriba se mezcla con el
  // color en que terminó la anterior
  const colorDe = (u: Unidad) => {
    const delModulo = unidades.filter((x) => x.modulo.id === u.modulo.id);
    return colorUnidad(u.modulo.id, delModulo.indexOf(u), delModulo.length);
  };
  const tramoDe = (u: Unidad): Tramo => {
    const i = unidades.indexOf(u);
    const color = colorDe(u);
    const anterior = i > 0 ? colorDe(unidades[i - 1]) : undefined;
    return { color, invertido: i % 2 === 1, previo: anterior && (i % 2 === 1 ? anterior.profundo : anterior.principal) };
  };

  return (
    <main className="ruta">
      <header className="ruta-barra">
        <button className="ruta-yo" onClick={() => (location.hash = '#/perfil')} aria-label="Editar tu personaje">
          <Avatar quien="yo" tam={40} />
        </button>
        <span className="ruta-modulo">{unidades[0]?.modulo.nombre}</span>
        <button className="ruta-chip racha" onClick={() => setFicha({ tipo: 'racha' })} aria-label={`Racha de ${racha} días. Ver tu semana`}>▲ {racha}</button>
        <button className="ruta-chip xp" onClick={() => (location.hash = '#/closet')} aria-label={`${progreso.xp} XP. Abrir tu clóset`}><Moneda tam={17} /> {progreso.xp}</button>
        <button className="ruta-chip sonido" onClick={acciones.alternarSonido} aria-label={progreso.sonido ? 'Silenciar sonidos' : 'Activar sonidos'}>
          {progreso.sonido ? '🔊' : '🔇'}
        </button>
      </header>

      {unidades.map((u) => u.sesiones.length
        ? <Camino key={u.id} unidad={u} progreso={progreso} abrirFicha={setFicha} tramo={tramoDe(u)} />
        : <CaminoProximo key={u.id} unidad={u} abrirFicha={setFicha} tramo={tramoDe(u)} />)}

      {ficha && <HojaFicha ficha={ficha} progreso={progreso} cambiar={setFicha} cerrar={() => setFicha(null)} />}
    </main>
  );
}

// ---------- El camino de una unidad ----------

interface Tramo { color: ColorModulo; invertido: boolean; previo?: string }

// Variables de color del tramo de una unidad (ruta.css las usa para el fondo, la tarjeta y los botones)
function estiloTramo(tramo: Tramo) {
  const { principal, profundo } = tramo.color;
  const [arriba, abajo] = tramo.invertido ? [profundo, principal] : [principal, profundo];
  return { '--mod': principal, '--mod-hondo': profundo, '--arriba': arriba, '--abajo': abajo, '--previo': tramo.previo ?? arriba } as React.CSSProperties;
}

function Camino({ unidad, progreso, abrirFicha, tramo }: { unidad: Unidad; progreso: Progreso; abrirFicha: (f: Ficha) => void; tramo: Tramo }) {
  const caja = useRef<HTMLDivElement>(null);
  const actual = useRef<HTMLButtonElement>(null);
  const alBanco = useRef<HTMLButtonElement>(null);
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
  // Al abrir, el camino se centra en la parada que toca (o en el banco si ya terminaste)
  useEffect(() => {
    (actual.current ?? alBanco.current)?.scrollIntoView({ block: 'center' });
  }, []);

  const centro = ancho / 2;
  const punto = (i: number) => ({ x: centro + VAIVEN[i % VAIVEN.length], y: ARRIBA + i * FILA });
  const puntos = paradas.map((_, i) => punto(i));
  const banco = punto(paradas.length);
  const alto = banco.y + 110;
  const curva = (hasta: number) =>
    [...puntos, banco].slice(0, hasta + 1).reduce((d, p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const a = arr[i - 1];
      const m = (a.y + p.y) / 2;
      return `${d} C ${a.x} ${m}, ${p.x} ${m}, ${p.x} ${p.y}`;
    }, '');
  const iActual = paradas.findIndex((s) => estadoDe(s, progreso) === 'actual');
  // Un lado del camino queda para los regalos; el otro, para Hashy
  const ladoRegalo = (i: number) => (VAIVEN[i % VAIVEN.length] <= 0 ? 1 : -1);

  // Regalos de monedas: junto a la 3.ª parada, la 6.ª…
  const regalos = regalosDeUnidad(paradas.length).map((n) => {
    const p = puntos[n - 1];
    return { n, clave: `${unidad.id}#${n}`, x: p.x + ladoRegalo(n - 1) * 100, y: p.y - 6 };
  });
  const estadoRegalo = (r: { n: number; clave: string }) => (progreso.regalos[r.clave] ? 'abierto' : hechas >= r.n ? 'listo' : 'cerrado');
  const estadoBanco = cobrado ? 'cobrado' : completa ? 'listo' : 'cerrado';

  // Lugares donde Hashy puede estar: del lado contrario a los regalos y junto al banco.
  // El primero es junto a la parada que toca, para que empiece ahí.
  const lugares = [...puntos, banco].map((p, i) => ({
    x: Math.min(ancho - 52, Math.max(40, p.x - ladoRegalo(i) * 84)), y: p.y + 20,
  }));
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
    <section className="tramo" style={estiloTramo(tramo)}>
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
            </div>
          );
        })}

        {regalos.map((r) => {
          const e = estadoRegalo(r);
          const faltan = r.n - hechas;
          return (
            <button key={r.clave} className={`regalo-monedas ${e}`} style={{ left: r.x, top: r.y }}
              onClick={() => abrirFicha({ tipo: 'regalo', unidad, clave: r.clave, faltan })}
              aria-label={e === 'listo' ? 'Regalo de monedas: ábrelo' : e === 'abierto' ? 'Regalo de monedas abierto' : `Regalo de monedas: faltan ${faltan} paradas`}>
              <MontonMonedas abierto={e === 'abierto'} />
              <span>{e === 'abierto' ? 'ABIERTO' : e === 'listo' ? '¡ÁBRELO!' : `${faltan} PARADA${faltan === 1 ? '' : 'S'}`}</span>
            </button>
          );
        })}

        <button ref={alBanco} className={`banco-monedas ${estadoBanco}`} style={{ left: banco.x, top: banco.y }}
          onClick={() => abrirFicha({ tipo: 'premio', unidad })} aria-label={`Banco de monedas: premio de la unidad, ${PREMIO_XP} XP`}>
          <Banco />
          <span>{cobrado ? '✓ COBRADO' : <><Moneda tam={13} /> +{PREMIO_XP} XP</>}</span>
        </button>

        {unidad.tipsHashy.length > 0 && (
          <HashyPaseo lugares={lugaresHashy} tips={tips} />
        )}
      </div>
    </section>
  );
}

// Unidad que aún no se escribe: su camino se ve completo pero bloqueado, con las paradas de
// siempre (2 lecciones, 2 proyectos y repaso), su regalo de monedas y su banco
const PARADAS_TIPO: { tipo: TipoParada; corto: (u: Unidad) => string }[] = [
  { tipo: 'leccion', corto: (u) => temaCorto(u.temas[0]) ?? 'Lección 1' },
  { tipo: 'leccion', corto: (u) => temaCorto(u.temas[1]) ?? 'Lección 2' },
  { tipo: 'proyecto', corto: () => 'Proyecto 1' },
  { tipo: 'proyecto', corto: () => 'Proyecto 2' },
  { tipo: 'repaso', corto: () => 'Repaso' },
];
// "ORDER BY y LIMIT" → "ORDER BY"; si queda largo, mejor no ponerlo
function temaCorto(tema?: string): string | undefined {
  const t = tema?.split(' y ')[0].split(',')[0].trim();
  return t && t.length <= 12 ? t : undefined;
}

function CaminoProximo({ unidad, abrirFicha, tramo }: { unidad: Unidad; abrirFicha: (f: Ficha) => void; tramo: Tramo }) {
  const caja = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(() => Math.min(innerWidth, 460));
  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setAncho(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const centro = ancho / 2;
  const punto = (i: number) => ({ x: centro + VAIVEN[i % VAIVEN.length], y: ARRIBA + i * FILA });
  const puntos = PARADAS_TIPO.map((_, i) => punto(i));
  const banco = punto(PARADAS_TIPO.length);
  const alto = banco.y + 110;
  const curva = [...puntos, banco].reduce((d, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const a = arr[i - 1];
    const m = (a.y + p.y) / 2;
    return `${d} C ${a.x} ${m}, ${p.x} ${m}, ${p.x} ${p.y}`;
  }, '');
  const verUnidad = () => abrirFicha({ tipo: 'unidad', unidad });
  const regalo = puntos[2];
  const ladoRegalo = VAIVEN[2] <= 0 ? 1 : -1;

  return (
    <section className="tramo proximo" style={estiloTramo(tramo)}>
      <div className="tarjeta-unidad">
        <button className="tu-info" onClick={verUnidad}>
          <small>{unidad.modulo.nombre.split(' ')[0]} · Unidad {unidad.numero} · 🔒 Próximamente</small>
          <b>{unidad.titulo}</b>
          <span className="tu-barra" aria-label="Aún no empieza"><i style={{ width: 0 }} /></span>
        </button>
      </div>
      <div className="camino" ref={caja} style={{ height: alto }}>
        <svg className="camino-linea" width={ancho} height={alto} aria-hidden="true">
          <path d={curva} className="linea-falta" />
        </svg>
        {PARADAS_TIPO.map((t, i) => (
          <div key={i}>
            <button className="boton-parada bloqueada" style={{ left: puntos[i].x, top: puntos[i].y }} onClick={verUnidad}
              aria-label={`${t.corto(unidad)}: próximamente`}>
              <IconoParada tipo={t.tipo} />
            </button>
            <span className="nombre-parada bloqueada" style={{ left: puntos[i].x, top: puntos[i].y + 37 }}>{t.corto(unidad)}</span>
          </div>
        ))}
        <button className="regalo-monedas cerrado" style={{ left: regalo.x + ladoRegalo * 100, top: regalo.y - 6 }} onClick={verUnidad}
          aria-label="Regalo de monedas de esta unidad">
          <MontonMonedas abierto={false} />
          <span>3 PARADAS</span>
        </button>
        <button className="banco-monedas cerrado" style={{ left: banco.x, top: banco.y }} onClick={verUnidad} aria-label={`Banco de monedas: ${PREMIO_XP} XP`}>
          <Banco />
          <span><Moneda tam={13} /> +{PREMIO_XP} XP</span>
        </button>
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

// Montón de monedas: el regalo del camino
function MontonMonedas({ abierto }: { abierto: boolean }) {
  if (abierto) return <Moneda tam={30} />;
  return (
    <svg width="56" height="56" viewBox="0 0 60 60" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${-i * 8})`}>
          <ellipse cx="30" cy="48" rx="18" ry="6" fill="#C98A00" />
          <rect x="12" y="42" width="36" height="6" fill="#E8A417" />
          <ellipse cx="30" cy="42" rx="18" ry="6" fill="#FFD23F" stroke="#A86F00" strokeWidth="1.2" />
        </g>
      ))}
      <ellipse cx="30" cy="26" rx="11" ry="3.6" fill="none" stroke="#D99A00" strokeWidth="1.3" />
      <g transform="translate(44 18) rotate(18)">
        <ellipse cx="0" cy="0" rx="8" ry="11" fill="#FFC531" stroke="#A86F00" strokeWidth="1.3" />
        <ellipse cx="0" cy="0" rx="4.5" ry="7" fill="none" stroke="#D99A00" strokeWidth="1.2" />
      </g>
      <path d="M10 14 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 Z" fill="#fff" />
    </svg>
  );
}

// Banco de monedas: el premio al final de la unidad
function Banco() {
  return (
    <svg width="76" height="74" viewBox="0 0 76 74" aria-hidden="true">
      <ellipse cx="38" cy="66" rx="30" ry="6" fill="rgba(0,0,0,.2)" />
      <path d="M10 26 L38 10 L66 26 Z" fill="#FFC531" stroke="#A86F00" strokeWidth="1.6" />
      <rect x="12" y="26" width="52" height="6" fill="#FFD23F" stroke="#A86F00" strokeWidth="1.4" />
      {[16, 28, 40, 52].map((x) => <rect key={x} x={x} y="33" width="8" height="24" fill="#FFF3C4" stroke="#A86F00" strokeWidth="1.2" />)}
      <rect x="8" y="57" width="60" height="7" rx="2" fill="#FFD23F" stroke="#A86F00" strokeWidth="1.4" />
      <circle cx="38" cy="20" r="4" fill="#fff" stroke="#A86F00" strokeWidth="1.2" />
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
        {ficha.tipo === 'regalo' && <FichaRegalo {...ficha} progreso={progreso} />}
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
      sonidos.moneda();
      sonidos.fin();
      setRecien(true);
    }
  }

  return (
    <div className="ficha ficha-premio">
      <Avatar quien="hashy" animo={cobrado || recien ? 'lentes' : 'feliz'} tam={88} />
      <span className={`ficha-tipo ${cobrado ? 'hecha' : faltan ? 'bloqueada' : 'actual'}`}>Banco de monedas · premio de la unidad</span>
      {recien ? (
        <>
          <h2>¡El banco te pagó +{PREMIO_XP} XP!</h2>
          <p className="ficha-texto">Terminaste <b>{unidad.titulo}</b>. Gástalos en tu clóset.</p>
        </>
      ) : cobrado ? (
        <>
          <h2>Ya cobraste este premio</h2>
          <p className="ficha-texto">El banco te pagó {PREMIO_XP} XP por terminar <b>{unidad.titulo}</b>.</p>
        </>
      ) : faltan ? (
        <>
          <h2>El banco guarda {PREMIO_XP} XP para ti</h2>
          <p className="ficha-candado">🔒 Te {faltan === 1 ? 'falta 1 parada' : `faltan ${faltan} paradas`} para cobrarlos.</p>
        </>
      ) : (
        <>
          <h2>¡Terminaste la unidad!</h2>
          <p className="ficha-texto">Terminaste todas las paradas: el banco te paga {PREMIO_XP} XP.</p>
          <button className="boton-juego" onClick={abrirPremio}>COBRAR · +{PREMIO_XP} XP</button>
        </>
      )}
    </div>
  );
}

// Regalo de monedas del camino: sale al azar más XP, una prenda o doble XP
function FichaRegalo({ clave, faltan, progreso }: { clave: string; faltan: number; progreso: Progreso }) {
  const [salio, setSalio] = useState<Regalo | null>(null);
  const yaAbierto = progreso.regalos[clave];

  function abrirRegalo() {
    const regalo = elegirRegalo(progreso.comprados);
    if (acciones.abrirRegalo(clave, regalo)) {
      sonidos.moneda();
      sonidos.fin();
      setSalio(regalo);
    }
  }

  return (
    <div className="ficha ficha-premio">
      <span className="ficha-regalo" aria-hidden="true"><Moneda tam={64} /></span>
      <span className={`ficha-tipo ${yaAbierto ? 'hecha' : faltan > 0 ? 'bloqueada' : 'actual'}`}>Regalo de monedas</span>
      {salio ? (
        <>
          <h2>¡Te salió {salio.titulo}!</h2>
          <p className="ficha-texto">{salio.texto}</p>
        </>
      ) : yaAbierto ? (
        <>
          <h2>Ya abriste este regalo</h2>
          <p className="ficha-texto">Te salió <b>{yaAbierto}</b>. El siguiente aparece 3 paradas más adelante.</p>
        </>
      ) : faltan > 0 ? (
        <>
          <h2>Un montón de monedas sorpresa</h2>
          <p className="ficha-candado">🔒 Te {faltan === 1 ? 'falta 1 parada' : `faltan ${faltan} paradas`} para abrirlo. Puede traer XP, una prenda del clóset o doble XP.</p>
        </>
      ) : (
        <>
          <h2>¡Llegaste a un regalo!</h2>
          <p className="ficha-texto">Ábrelo para ver qué te toca: XP, una prenda del clóset o doble XP.</p>
          <button className="boton-juego" onClick={abrirRegalo}>ABRIR REGALO</button>
        </>
      )}
    </div>
  );
}
