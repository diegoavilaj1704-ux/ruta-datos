import { extraerPreguntas } from '../lib/quiz';
import { acciones, useProgreso } from '../lib/progreso';
import { TextoEnLinea } from './Markdown';

interface Props {
  markdown: string;
  claveSesion: string;
}

export function Quiz({ markdown, claveSesion }: Props) {
  const progreso = useProgreso();
  const preguntas = extraerPreguntas(markdown);
  const aciertos = preguntas.filter((p, i) => {
    const elegida = progreso.quiz[`${claveSesion}#${i}`];
    return elegida !== undefined && p.opciones[elegida]?.correcta;
  }).length;
  const respondidas = preguntas.filter((_, i) => progreso.quiz[`${claveSesion}#${i}`] !== undefined).length;

  return (
    <div className="quiz">
      {preguntas.map((p, i) => {
        const llave = `${claveSesion}#${i}`;
        const elegida = progreso.quiz[llave];
        const respondida = elegida !== undefined;
        const correcta = p.opciones.find((o) => o.correcta);
        return (
          <fieldset key={i} className="pregunta">
            <legend>
              Pregunta {i + 1}
              {p.etiqueta && <span className="etiqueta">{p.etiqueta}</span>}
            </legend>
            <p><TextoEnLinea texto={p.enunciado} /></p>
            {p.opciones.map((o, j) => {
              const estado = !respondida ? '' : o.correcta ? 'correcta' : j === elegida ? 'incorrecta' : 'apagada';
              return (
                <button
                  key={o.letra}
                  className={`opcion ${estado}`}
                  disabled={respondida}
                  onClick={() => acciones.responderQuiz(llave, j)}
                >
                  <span className="letra">{o.letra})</span> <TextoEnLinea texto={o.texto} />
                </button>
              );
            })}
            {respondida && (
              <div className={`retro ${p.opciones[elegida].correcta ? 'bien' : 'mal'}`}>
                {p.opciones[elegida].correcta ? (
                  <p><strong>¡Bien!</strong></p>
                ) : (
                  <>
                    <p>
                      <strong>No es esa.</strong>{' '}
                      <TextoEnLinea texto={p.opciones[elegida].explicacion || 'Compárala con la opción correcta.'} />
                    </p>
                    {correcta && <p>La correcta es la {correcta.letra}).</p>}
                  </>
                )}
                {/* Las explicaciones de las demás opciones también enseñan */}
                {p.opciones
                  .filter((o, j) => j !== elegida && !o.correcta && o.explicacion)
                  .map((o) => (
                    <p key={o.letra} className="otra">
                      {o.letra}) <TextoEnLinea texto={o.explicacion} />
                    </p>
                  ))}
              </div>
            )}
          </fieldset>
        );
      })}
      {respondidas === preguntas.length && preguntas.length > 0 && (
        <div className="marcador">
          <p>
            {aciertos} de {preguntas.length} correctas.
            {aciertos < preguntas.length && ' Lee otra vez las explicaciones de las que fallaste: ahí está el aprendizaje.'}
          </p>
          <button className="enlace" onClick={() => acciones.reiniciarQuiz(claveSesion)}>
            Reintentar quiz
          </button>
        </div>
      )}
    </div>
  );
}
