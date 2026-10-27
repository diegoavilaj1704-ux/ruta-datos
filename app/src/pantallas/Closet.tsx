import { useState } from 'react';
import { Avatar, Cuerpo, equipoDe } from '../componentes/Avatar';
import { CATALOGO, CATEGORIAS, clavePrenda, ENCUADRE, type Categoria, type Prenda } from '../lib/armario';
import { PERFIL_INICIAL, type Peinado, type Perfil } from '../lib/personajes';
import { acciones, useProgreso } from '../lib/progreso';
import { reaccionar } from '../lib/reacciones';

// Clóset: los XP se gastan en peinados, ropa y accesorios.
// Lo que no tienes se prueba primero en el avatar y se compra con un botón aparte.
export function Closet({ volver }: { volver: () => void }) {
  const progreso = useProgreso();
  const perfil = progreso.perfil ?? PERFIL_INICIAL;
  const [cat, setCat] = useState<Categoria>('ropa');
  const [probando, setProbando] = useState<Prenda | null>(null);
  const [aviso, setAviso] = useState('');

  const tiene = (p: Prenda) => p.precio === 0 || progreso.comprados.includes(clavePrenda(p));
  const conPrenda = (base: Perfil, p: Prenda): Perfil =>
    p.cat === 'peinado'
      ? { ...base, peinado: p.id as Peinado }
      : { ...base, equipo: { ...equipoDe(base), [p.cat]: p.id } };
  const puesta = (p: Prenda) => (p.cat === 'peinado' ? perfil.peinado === p.id : equipoDe(perfil)[p.cat] === p.id);
  const vista = probando ? conPrenda(perfil, probando) : perfil;

  function tocar(p: Prenda) {
    setAviso('');
    if (tiene(p)) {
      acciones.guardarPerfil(conPrenda(perfil, p));
      setProbando(null);
    } else {
      setProbando(p);
    }
  }

  function comprar() {
    if (!probando) return;
    if (!acciones.comprar(clavePrenda(probando), probando.precio)) return;
    acciones.guardarPerfil(conPrenda(perfil, probando));
    reaccionar('acierto');
    setAviso(`¡Desbloqueaste ${probando.nombre}! −${probando.precio} XP`);
    setProbando(null);
  }

  const faltan = probando ? probando.precio - progreso.xp : 0;

  return (
    <main className="closet">
      <header className="perfil-barra">
        <button className="cerrar" onClick={volver} aria-label="Volver">✕</button>
        <h1>Tu clóset</h1>
        <span className="saldo">◆ {progreso.xp} XP</span>
      </header>

      <div className="closet-vista">
        <Cuerpo perfil={vista} ancho={124} alto={219} />
        <div className="closet-chat">
          <Avatar quien="yo" perfil={vista} tam={52} />
          <span>en el chat</span>
        </div>
      </div>
      {probando && <p className="probando">Probándote: <strong>{probando.nombre}</strong></p>}
      {aviso && <p className="aviso-compra">{aviso}</p>}

      <div className="closet-tabs" role="tablist">
        {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
          <button key={c} role="tab" aria-selected={c === cat} className={`chip-juego ${c === cat ? 'activo' : ''}`} onClick={() => setCat(c)}>
            {CATEGORIAS[c]}
          </button>
        ))}
      </div>

      <div className="closet-grid">
        {CATALOGO.filter((p) => p.cat === cat).map((p) => {
          const mia = tiene(p);
          const etiqueta = puesta(p) ? <small className="e-puesto">Puesto</small>
            : mia ? <small className="e-tuyo">{p.precio === 0 ? 'Gratis' : 'Tuyo'}</small>
            : <small className={progreso.xp >= p.precio ? 'e-precio' : 'e-bloq'}>{progreso.xp >= p.precio ? '' : '🔒 '}◆ {p.precio} XP</small>;
          return (
            <button
              key={p.id}
              className={`prenda ${puesta(p) ? 'puesta' : ''} ${probando?.id === p.id && probando.cat === p.cat ? 'probando' : ''} ${!mia && progreso.xp < p.precio ? 'bloqueada' : ''}`}
              onClick={() => tocar(p)}
            >
              <Cuerpo perfil={conPrenda(perfil, p)} encuadre={ENCUADRE[p.cat]} ancho={p.cat === 'ropa' ? 58 : 76} alto={p.cat === 'ropa' ? 102 : 76} />
              <b>{p.nombre}</b>
              {etiqueta}
            </button>
          );
        })}
      </div>

      <footer className="historia-pie">
        {probando ? (
          <button className="boton-juego" onClick={comprar} disabled={faltan > 0}>
            {faltan > 0 ? `TE FALTAN ${faltan} XP` : `COMPRAR POR ◆ ${probando.precio}`}
          </button>
        ) : (
          <button className="boton-juego" onClick={volver}>LISTO</button>
        )}
      </footer>
    </main>
  );
}
