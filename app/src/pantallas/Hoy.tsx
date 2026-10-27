import { catalogo, NOMBRE_DIA, type Sesion } from '../lib/contenido';
import { calcularRacha, useProgreso } from '../lib/progreso';

interface Props {
  abrir: (s: Sesion) => void;
}

const ETIQUETA_TIPO: Record<Sesion['tipo'], string> = {
  leccion: 'Lección',
  proyecto: 'Mini-proyecto',
  nota: 'Repaso y nota pública',
};

export function Hoy({ abrir }: Props) {
  const progreso = useProgreso();
  const racha = calcularRacha(progreso.diasActivos);
  // La ruta avanza por temas, no por fechas: hoy toca la primera sesión sin terminar
  const siguiente = catalogo.find((s) => !progreso.completadas[s.clave]);
  const semana = siguiente ?? catalogo[catalogo.length - 1];
  const delaSemana = catalogo.filter((s) => s.semana.id === semana?.semana.id && s.modulo.id === semana?.modulo.id);
  const hechas = delaSemana.filter((s) => progreso.completadas[s.clave]).length;

  const larga = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const fecha = larga.charAt(0).toUpperCase() + larga.slice(1);

  return (
    <main className="pantalla hoy">
      <header className="encabezado-hoy">
        <div>
          <p className="fecha">{fecha}</p>
          <h1>Hoy</h1>
        </div>
        <div className="marcadores">
          <div className="racha" aria-label={`Racha de ${racha} días`}>
            <span className="racha-num">▲ {racha}</span>
            <span className="racha-txt">racha</span>
          </div>
          <div className="racha" aria-label={`${progreso.xp} puntos de experiencia`}>
            <span className="racha-num xp">◆ {progreso.xp}</span>
            <span className="racha-txt">XP</span>
          </div>
        </div>
      </header>

      {siguiente ? (
        <button className="tarjeta-hoy" onClick={() => abrir(siguiente)}>
          <span className="tipo">
            {ETIQUETA_TIPO[siguiente.tipo]} · {NOMBRE_DIA[siguiente.dia]}
          </span>
          <span className="titulo">{siguiente.meta.titulo}</span>
          <span className="objetivo">{siguiente.meta.objetivo}</span>
          <span className="pie">
            <span>⏱ {siguiente.meta.duracion_min} min</span>
            <span className="empezar">Empezar →</span>
          </span>
        </button>
      ) : (
        <div className="tarjeta-hoy terminado">
          <span className="titulo">¡Terminaste todo lo publicado!</span>
          <span className="objetivo">La siguiente semana aparecerá aquí en cuanto esté lista.</span>
        </div>
      )}

      {semana && (
        <section className="semana">
          <div className="semana-cabecera">
            <div>
              <p className="modulo">{semana.modulo.nombre}</p>
              <h2>Semana {semana.semana.numero} · {semana.semana.titulo}</h2>
            </div>
            <span className="contador">{hechas}/{delaSemana.length}</span>
          </div>
          <div className="barra" aria-hidden="true">
            <div style={{ width: `${(hechas / delaSemana.length) * 100}%` }} />
          </div>
          <ol className="lista-dias">
            {delaSemana.map((s) => {
              const hecha = !!progreso.completadas[s.clave];
              const actual = s === siguiente;
              return (
                <li key={s.clave}>
                  <button className={`dia ${hecha ? 'hecha' : ''} ${actual ? 'actual' : ''}`} onClick={() => abrir(s)}>
                    <span className="marca" aria-hidden="true">{hecha ? '✓' : ''}</span>
                    <span className="dia-texto">
                      <span className="dia-nombre">{NOMBRE_DIA[s.dia]}</span>
                      <span className="dia-titulo">{s.meta.titulo}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </main>
  );
}
