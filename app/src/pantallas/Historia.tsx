import { useEffect, useState } from 'react';
import type { Sesion } from '../lib/contenido';
import { INTERACTIVOS, type Paso } from '../lib/historia';
import { acciones, useProgreso } from '../lib/progreso';
import * as T from '../componentes/Tarjetas';

interface Props {
  sesion: Sesion;
  volver: () => void;
  verTexto: () => void;
}

// Lección contada como historia: una tarjeta a la vez, con XP y barra de avance.
export function Historia({ sesion, volver, verTexto }: Props) {
  const pasos = sesion.historia!.pasos;
  const progreso = useProgreso();
  const guardado = progreso.historias[sesion.clave];
  const [i, setI] = useState(() => Math.min(guardado?.paso ?? 0, pasos.length - 1));
  const [listo, setListo] = useState(false);
  const [xpPaso, setXpPaso] = useState(0);
  const paso = pasos[i];
  const ultimo = paso.tipo === 'resumen';

  useEffect(() => {
    // Las tarjetas de lectura se pueden pasar de inmediato; el chat espera a sus mensajes
    setListo(!INTERACTIVOS.includes(paso.tipo) && paso.tipo !== 'chat');
    setXpPaso(0);
    window.scrollTo(0, 0);
  }, [i, paso.tipo]);

  function resolver(xp: number) {
    setListo(true);
    setXpPaso(xp);
  }

  function continuar() {
    if (ultimo) {
      acciones.terminarHistoria(sesion.clave);
      volver();
      return;
    }
    acciones.avanzarHistoria(sesion.clave, i + 1, xpPaso);
    setI(i + 1);
  }

  const xpVisible = (guardado?.xp ?? 0) + xpPaso;

  return (
    <main className="historia">
      <header className="historia-barra">
        <button className="cerrar" onClick={volver} aria-label="Salir de la lección">✕</button>
        <div className="avance" aria-label={`Tarjeta ${i + 1} de ${pasos.length}`}>
          <div style={{ width: `${((i + 1) / pasos.length) * 100}%` }} />
        </div>
        <span className="xp-contador">◆ {xpVisible}</span>
      </header>

      <section className="tarjeta-historia" key={i}>
        <Tarjeta paso={paso} sesion={sesion} onResuelto={resolver} />
        {i === 0 && (
          <button className="enlace-juego" onClick={verTexto}>Prefiero leer la lección completa</button>
        )}
      </section>

      <footer className="historia-pie">
        <button className="boton-juego" onClick={continuar} disabled={!listo}>
          {ultimo ? 'TERMINAR' : i === 0 ? 'EMPEZAR' : 'CONTINUAR'}
        </button>
      </footer>
    </main>
  );
}

function Tarjeta({ paso, sesion, onResuelto }: { paso: Paso; sesion: Sesion; onResuelto: (xp: number) => void }) {
  const p = { sesion, onResuelto } as const;
  switch (paso.tipo) {
    case 'portada': return <T.Portada sesion={sesion} />;
    case 'chat': return <T.Chat paso={paso} {...p} />;
    case 'tabla': return <T.TablaDatos paso={paso} {...p} />;
    case 'idea': return <T.Idea paso={paso} {...p} />;
    case 'analogia': return <T.Analogia paso={paso} {...p} />;
    case 'conceptos': return <T.Conceptos paso={paso} {...p} />;
    case 'terminal': return <T.TerminalDemo paso={paso} {...p} />;
    case 'armar': return <T.Armar paso={paso} {...p} />;
    case 'error': return <T.CazaError paso={paso} {...p} />;
    case 'tip': return <T.Tip paso={paso} {...p} />;
    case 'escribir': return <T.Escribir paso={paso} {...p} />;
    case 'quiz': return <T.Quiz paso={paso} {...p} />;
    case 'resumen': return <T.Resumen paso={paso} {...p} />;
  }
}
