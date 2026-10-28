import { useEffect, useState } from 'react';
import { dividirEnSecciones, nombreSeccion, type Sesion } from '../lib/contenido';
import { acciones, useProgreso } from '../lib/progreso';
import { Markdown } from '../componentes/Markdown';
import { EditorSQL } from '../componentes/EditorSQL';
import { Quiz } from '../componentes/Quiz';

interface Props {
  sesion: Sesion;
  volver: () => void;
}

export function Leccion({ sesion, volver }: Props) {
  const progreso = useProgreso();
  const [hoja, setHoja] = useState<string | null>(null); // código del editor libre
  const secciones = dividirEnSecciones(sesion.cuerpo);
  const completada = !!progreso.completadas[sesion.clave];
  const conEditor = !!sesion.dataset;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sesion.clave]);

  const probar = conEditor ? (codigo: string) => setHoja(codigo) : undefined;

  return (
    <main className="pantalla leccion">
      <header className="barra-superior">
        <button className="atras" onClick={volver} aria-label="Volver a la ruta">‹ Ruta</button>
        <span className="barra-titulo">{sesion.parada.corto}</span>
        <span className="version">v{sesion.meta.version}</span>
      </header>

      <div className="portada">
        <p className="modulo">{sesion.modulo.nombre} · Unidad {sesion.semana.numero}</p>
        <h1>{sesion.meta.titulo}</h1>
        <p className="meta">⏱ {sesion.meta.duracion_min} min</p>
      </div>

      {secciones.map((sec, i) => {
        const nombre = nombreSeccion(sec.titulo);
        const ejercicios = sesion.ejercicios.filter((e) => nombreSeccion(e.seccion) === nombre);
        return (
          <section key={i} className="bloque">
            {sec.titulo && <h2>{sec.titulo}</h2>}
            <ContenidoSeccion
              nombre={nombre}
              markdown={sec.markdown}
              sesion={sesion}
              ejercicios={ejercicios}
              probar={probar}
            />
          </section>
        );
      })}

      <div className="cierre">
        {completada ? (
          <>
            <p className="hecho">✓ Completado</p>
            <button className="enlace" onClick={() => acciones.desmarcar(sesion.clave)}>Desmarcar</button>
          </>
        ) : (
          <button
            className="boton grande"
            onClick={() => {
              acciones.completar(sesion.clave);
              volver();
            }}
          >
            Marcar como completado
          </button>
        )}
      </div>

      {conEditor && hoja === null && (
        <button className="flotante" onClick={() => setHoja('')} aria-label="Abrir editor SQL">
          SQL
        </button>
      )}

      {hoja !== null && (
        <div className="hoja-fondo" onClick={() => setHoja(null)}>
          <div className="hoja" role="dialog" aria-label="Editor SQL" onClick={(e) => e.stopPropagation()}>
            <div className="hoja-cabecera">
              <strong>Editor · tabla ventas</strong>
              <button className="enlace" onClick={() => setHoja(null)}>Cerrar</button>
            </div>
            <EditorSQL dataset={sesion.dataset} codigoInicial={hoja} />
          </div>
        </div>
      )}
    </main>
  );
}

interface ContenidoProps {
  nombre: string;
  markdown: string;
  sesion: Sesion;
  ejercicios: Sesion['ejercicios'];
  probar?: (codigo: string) => void;
}

function ContenidoSeccion({ nombre, markdown, sesion, ejercicios, probar }: ContenidoProps) {
  if (nombre === 'Revisa tu comprensión') {
    return <Quiz markdown={markdown} claveSesion={sesion.clave} />;
  }

  if (ejercicios.length > 0) {
    // Las soluciones quedan plegadas: primero se intenta en el editor
    const [enunciados, soluciones] = markdown.split('**Soluciones comentadas**');
    return (
      <>
        <Markdown texto={enunciados} />
        <EditorSQL dataset={sesion.dataset} ejercicios={ejercicios} />
        {soluciones && (
          <details className="soluciones">
            <summary>Soluciones comentadas</summary>
            <Markdown texto={soluciones} onProbar={probar} />
          </details>
        )}
      </>
    );
  }

  if (sesion.tipo === 'repaso' && nombre.startsWith('Plantilla')) {
    return (
      <>
        <Markdown texto={markdown} />
        <EditorNota clave={sesion.clave} />
      </>
    );
  }

  if (sesion.tipo === 'proyecto' && nombre === 'Entregable') {
    return (
      <>
        <Markdown texto={markdown} onProbar={probar} />
        <CopiarReporte sesion={sesion} />
      </>
    );
  }

  return <Markdown texto={markdown} onProbar={probar} />;
}

async function compartirTexto(texto: string): Promise<string> {
  try {
    if (navigator.share) {
      await navigator.share({ text: texto });
      return 'Listo';
    }
    await navigator.clipboard.writeText(texto);
    return 'Copiado';
  } catch {
    return 'No se pudo compartir';
  }
}

function EditorNota({ clave }: { clave: string }) {
  const progreso = useProgreso();
  const texto = progreso.notas[clave] ?? '';
  const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const [aviso, setAviso] = useState('');
  return (
    <div className="nota">
      <textarea
        value={texto}
        onChange={(e) => acciones.guardarNota(clave, e.target.value)}
        placeholder={'Qué aprendí…\n\nMi ejemplo…\n\nUn error que cometí…\n\nPregunta para ti…'}
        rows={8}
        aria-label="Tu nota del viernes"
      />
      <div className="nota-pie">
        <span className={palabras > 200 ? 'excedido' : ''}>{palabras}/200 palabras</span>
        <button className="boton secundario" disabled={!palabras} onClick={async () => setAviso(await compartirTexto(texto))}>
          Compartir
        </button>
      </div>
      {aviso && <p className="nota-resultado">{aviso}</p>}
    </div>
  );
}

function CopiarReporte({ sesion }: { sesion: Sesion }) {
  const progreso = useProgreso();
  const [aviso, setAviso] = useState('');
  const reporte = sesion.ejercicios
    .map((e) => `-- ${e.titulo}: ${e.enunciado}\n${progreso.ejercicios[e.id]?.codigo?.trim() || '-- (sin responder)'}`)
    .join('\n\n');
  return (
    <div className="nota">
      <p>Arma tu <code>reporte_semana1.sql</code> con las consultas que escribiste arriba, y agrega tu mensaje para Don Rafa.</p>
      <button className="boton secundario" onClick={async () => setAviso(await compartirTexto(reporte))}>
        Copiar mis consultas
      </button>
      {aviso && <p className="nota-resultado">{aviso}</p>}
    </div>
  );
}
