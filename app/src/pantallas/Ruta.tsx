import { useEffect, useRef, useState } from 'react';
import { unidades, type Concepto, type Sesion, type TipoParada, type Unidad } from '../lib/contenido';
import { calcularRacha, useProgreso, type Progreso } from '../lib/progreso';
import { ejecutar, type Resultado } from '../lib/sql';
import { Avatar } from '../componentes/Avatar';
import { TextoEnLinea } from '../componentes/Markdown';
import { Codigo, Salida, Terminal } from '../componentes/Tarjetas';

// Pantalla principal: el mapa de la unidad. Cada parada se abre al terminar la anterior;
// junto a cada una están las fichas de los temas que enseña, y todo se puede tocar.

const ALTO_FILA = 128;
const COLUMNAS = [64, 30, 70, 30, 66, 34];   // posición horizontal (%) de cada parada, de abajo hacia arriba

const ICONO: Record<TipoParada, string> = { leccion: '▶', proyecto: '⚑', repaso: '★' };
const NOMBRE_TIPO: Record<TipoParada, string> = { leccion: 'Lección', proyecto: 'Mini-proyecto', repaso: 'Repaso y nota pública' };

type Estado = 'hecha' | 'actual' | 'bloqueada';
type Ficha =
  | { tipo: 'parada'; sesion: Sesion; unidad: Unidad }
  | { tipo: 'concepto'; concepto: Concepto; unidad: Unidad }
  | { tipo: 'unidad'; unidad: Unidad };

const catalogo = unidades.flatMap((u) => u.sesiones);

function estadoDe(s: Sesion, p: Progreso): Estado {
  if (p.completadas[s.clave]) return 'hecha';
  return catalogo.find((x) => !p.completadas[x.clave]) === s ? 'actual' : 'bloqueada';
}

const abrir = (s: Sesion, modo: 's' | 't' = 's') => (location.hash = `#/${modo}/${encodeURIComponent(s.clave)}`);

export function Ruta() {
  const progreso = useProgreso();
  const racha = calcularRacha(progreso.diasActivos);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const actual = useRef<HTMLButtonElement>(null);
  const siguiente = catalogo.find((s) => !progreso.completadas[s.clave]);
  const unidadActual = unidades.find((u) => u.sesiones.includes(siguiente!)) ?? unidades.find((u) => u.sesiones.length) ?? unidades[0];
  const hechas = unidadActual.sesiones.filter((s) => progreso.completadas[s.clave]).length;

  // Al abrir, el mapa se centra en la parada que toca
  useEffect(() => {
    actual.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <main className="ruta">
      <header className="ruta-barra">
        <button className="ruta-yo" onClick={() => (location.hash = '#/perfil')} aria-label="Editar tu personaje">
          <Avatar quien="yo" tam={40} />
        </button>
        <button className="ruta-unidad" onClick={() => setFicha({ tipo: 'unidad', unidad: unidadActual })}>
          <small>{unidadActual.modulo.nombre} · Unidad {unidadActual.numero}</small>
          <b>{unidadActual.titulo}</b>
          <span className="ruta-progreso" aria-label={`${hechas} de ${unidadActual.sesiones.length} paradas`}>
            <i style={{ width: `${(hechas / Math.max(1, unidadActual.sesiones.length)) * 100}%` }} />
          </span>
        </button>
        <div className="ruta-chips">
          <span className="ruta-chip racha" aria-label={`Racha de ${racha} días`}>▲ {racha}</span>
          <button className="ruta-chip xp" onClick={() => (location.hash = '#/closet')} aria-label={`${progreso.xp} XP. Abrir tu clóset`}>◆ {progreso.xp}</button>
        </div>
      </header>

      <div className="mapa">
        {[...unidades].reverse().map((u) =>
          u.sesiones.length ? (
            <TramoUnidad key={u.id} unidad={u} progreso={progreso} abrirFicha={setFicha} refActual={actual} />
          ) : (
            <button key={u.id} className="isla-bloqueada" onClick={() => setFicha({ tipo: 'unidad', unidad: u })}>
              <span className="candado" aria-hidden="true">🔒</span>
              <span><small>Unidad {u.numero} · próximamente</small><b>{u.titulo}</b></span>
            </button>
          ),
        )}
        <p className="mapa-inicio">Aquí empieza tu ruta, {progreso.perfil?.nombre}</p>
      </div>

      {ficha && <HojaFicha ficha={ficha} progreso={progreso} cambiar={setFicha} cerrar={() => setFicha(null)} />}
    </main>
  );
}

function TramoUnidad({ unidad, progreso, abrirFicha, refActual }: {
  unidad: Unidad;
  progreso: Progreso;
  abrirFicha: (f: Ficha) => void;
  refActual: React.RefObject<HTMLButtonElement>;
}) {
  const [tip, setTip] = useState<string | null>(null);
  const [nTip, setNTip] = useState(0);
  const paradas = unidad.sesiones;
  const alto = paradas.length * ALTO_FILA + 40;
  // Centro de cada parada: la primera queda abajo
  const puntos = paradas.map((_, i) => ({ x: COLUMNAS[i % COLUMNAS.length], y: alto - 40 - i * ALTO_FILA - ALTO_FILA / 2 + 20 }));
  const camino = (hasta: number) =>
    puntos.slice(0, hasta + 1).reduce((d, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const a = puntos[i - 1];
      const m = (a.y + p.y) / 2;
      return `${d} C ${a.x} ${m}, ${p.x} ${m}, ${p.x} ${p.y}`;
    }, '');
  const ultimaHecha = paradas.reduce((n, s, i) => (progreso.completadas[s.clave] ? i : n), -1);
  const iActual = paradas.findIndex((s) => estadoDe(s, progreso) === 'actual');

  function hablarHashy() {
    if (!unidad.tipsHashy.length) return;
    setTip(unidad.tipsHashy[nTip % unidad.tipsHashy.length]);
    setNTip((n) => n + 1);
  }

  return (
    <section className="tramo" style={{ height: alto }}>
      <svg className="tramo-camino" viewBox={`0 0 100 ${alto}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={camino(paradas.length - 1)} className="camino-falta" vectorEffect="non-scaling-stroke" />
        {ultimaHecha >= 0 && <path d={camino(Math.min(ultimaHecha + 1, paradas.length - 1))} className="camino-hecho" vectorEffect="non-scaling-stroke" />}
      </svg>

      {paradas.map((s, i) => {
        const estado = estadoDe(s, progreso);
        const { x, y } = puntos[i];
        const fichas = unidad.conceptos.filter((c) => c.parada === s.parada.id);
        const enCurso = progreso.historias[s.clave];
        const izquierda = x >= 50;
        return (
          <div key={s.clave}>
            {estado === 'actual' && (
              <span className="parada-globo" style={{ left: `${x}%`, top: y - 78 }}>
                {enCurso ? 'CONTINUAR' : 'EMPEZAR'}
              </span>
            )}
            <button
              ref={estado === 'actual' ? refActual : undefined}
              className={`parada ${estado}`}
              style={{ left: `${x}%`, top: y }}
              onClick={() => abrirFicha({ tipo: 'parada', sesion: s, unidad })}
              aria-label={`${s.parada.corto}: ${estado === 'hecha' ? 'terminada' : estado === 'actual' ? 'te toca' : 'bloqueada'}`}
            >
              <span className="parada-icono" aria-hidden="true">{estado === 'hecha' ? '✓' : estado === 'bloqueada' ? '🔒' : ICONO[s.tipo]}</span>
              <span className="parada-nombre">{s.parada.corto}</span>
            </button>
            {fichas.length > 0 && (
              <div className={`fichas ${izquierda ? 'a-la-izquierda' : 'a-la-derecha'}`} style={{ top: y - 30 }}>
                {fichas.map((c) => {
                  const abierta = estado === 'hecha';
                  return (
                    <button
                      key={c.id}
                      className={`ficha-codigo ${abierta ? '' : 'cerrada'}`}
                      onClick={() => abrirFicha({ tipo: 'concepto', concepto: c, unidad })}
                      aria-label={`${c.titulo}${abierta ? '' : ' (bloqueada)'}`}
                    >
                      {abierta ? c.codigo : `🔒 ${c.codigo}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Hashy se asoma junto a la parada que toca (o la última, si ya terminaste) */}
      {unidad.tipsHashy.length > 0 && (iActual >= 0 || ultimaHecha === paradas.length - 1) && (
        <div
          className={`hashy-mapa ${puntos[iActual >= 0 ? iActual : paradas.length - 1].x < 50 ? 'izq' : 'der'}`}
          style={{ top: puntos[iActual >= 0 ? iActual : paradas.length - 1].y - 29 }}
        >
          {tip && <p className="hashy-globo" onClick={() => setTip(null)}>{tip}</p>}
          <button onClick={hablarHashy} aria-label="Pedirle un tip a Hashy">
            <Avatar quien="hashy" tam={58} />
          </button>
        </div>
      )}
    </section>
  );
}

function HojaFicha({ ficha, progreso, cambiar, cerrar }: {
  ficha: Ficha;
  progreso: Progreso;
  cambiar: (f: Ficha) => void;
  cerrar: () => void;
}) {
  return (
    <div className="hoja-fondo" onClick={cerrar}>
      <div className="hoja" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <span className="hoja-asa" aria-hidden="true" />
        <button className="hoja-cerrar" onClick={cerrar} aria-label="Cerrar">✕</button>
        {ficha.tipo === 'parada' && <FichaParada {...ficha} progreso={progreso} cambiar={cambiar} />}
        {ficha.tipo === 'concepto' && <FichaConcepto {...ficha} progreso={progreso} cambiar={cambiar} />}
        {ficha.tipo === 'unidad' && <FichaUnidad unidad={ficha.unidad} progreso={progreso} cambiar={cambiar} />}
      </div>
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
      <button className="enlace-juego" onClick={() => cambiar({ tipo: 'parada', sesion, unidad })}>Lo viste en: {sesion.meta.titulo}</button>
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
                <span aria-hidden="true">{e === 'hecha' ? '✓' : e === 'actual' ? ICONO[s.tipo] : '🔒'}</span>
                {s.meta.titulo}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="ficha-candado">🔒 Esta unidad se está escribiendo. Aparecerá en el mapa en cuanto esté lista.</p>
      )}
    </div>
  );
}
