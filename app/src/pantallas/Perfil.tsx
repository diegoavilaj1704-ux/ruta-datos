import { useState } from 'react';
import { Moneda } from '../componentes/Moneda';
import { Avatar, Cuerpo, equipoDe } from '../componentes/Avatar';
import { CATALOGO, clavePrenda, precioDe } from '../lib/armario';
import {
  COLORES_PELO, COMPLEXIONES, complexionDe, PANTALONES, PEINADOS, peinadoDe, PERFIL_INICIAL, PIELES, PLAYERAS, TENIS, VELLO, velloDe,
  type Complexion, type Peinado, type Perfil as PerfilT, type Vello,
} from '../lib/personajes';
import { acciones, useProgreso } from '../lib/progreso';

interface Props {
  bienvenida?: boolean;   // primera vez: aún no hay perfil
  listo: () => void;
}

// Creador de avatar: el protagonista de las historias es el propio alumno.
// La ropa, los gorros y los peinados especiales están en el clóset.
export function Perfil({ bienvenida, listo }: Props) {
  const progreso = useProgreso();
  const [p, setP] = useState<PerfilT>(progreso.perfil ?? PERFIL_INICIAL);
  const [error, setError] = useState('');
  const cambiar = (c: Partial<PerfilT>) => setP((v) => ({ ...v, ...c }));
  const tiene = (cat: 'peinado' | 'lentes', id: string) =>
    precioDe(cat, id) === 0 || progreso.comprados.includes(clavePrenda({ cat, id }));
  const peinados = (Object.keys(PEINADOS) as Peinado[]).filter((k) => tiene('peinado', k));
  const lentes = CATALOGO.filter((x) => x.cat === 'lentes' && tiene('lentes', x.id));
  const equipo = equipoDe(p);

  function guardar(despues: () => void) {
    if (!p.nombre.trim()) {
      setError('Escribe cómo quieres que te llamen.');
      return;
    }
    acciones.guardarPerfil(p);
    despues();
  }

  return (
    <main className="perfil">
      {bienvenida ? (
        <div className="perfil-bienvenida">
          <Avatar quien="hashy" tam={56} />
          <p><strong>¡Guau! Soy Hashy.</strong> Antes de empezar, arma tu personaje. Tú eres quien le ayuda a Don Rafa.</p>
        </div>
      ) : (
        <header className="perfil-barra">
          <button className="cerrar" onClick={listo} aria-label="Volver">✕</button>
          <h1>Tu personaje</h1>
        </header>
      )}

      <div className="perfil-vista">
        <Cuerpo perfil={p} ancho={120} alto={318} />
        <Avatar quien="yo" perfil={p} tam={64} />
      </div>

      <label className="perfil-campo">
        <span>¿Cómo te llamamos?</span>
        <input
          value={p.nombre}
          maxLength={20}
          placeholder="Tu nombre"
          autoComplete="given-name"
          onChange={(e) => { cambiar({ nombre: e.target.value }); setError(''); }}
        />
        {error && <small className="perfil-error">{error}</small>}
      </label>

      <Grupo titulo="Piel">
        {PIELES.map((c, i) => <Muestra key={c} color={c} activa={p.piel === i} onClick={() => cambiar({ piel: i })} etiqueta={`Tono ${i + 1}`} />)}
      </Grupo>

      <Grupo titulo="Complexión">
        {(Object.keys(COMPLEXIONES) as Complexion[]).map((k) => (
          <Chip key={k} activo={complexionDe(p) === k} onClick={() => cambiar({ complexion: k })}>{COMPLEXIONES[k]}</Chip>
        ))}
      </Grupo>

      <Grupo titulo="Cabello">
        {peinados.map((k) => (
          <button key={k} className={`peinado ${peinadoDe(p) === k ? 'activo' : ''}`} onClick={() => cambiar({ peinado: k })} aria-label={PEINADOS[k]}>
            <Avatar quien="yo" perfil={{ ...p, peinado: k }} tam={52} />
            <span>{PEINADOS[k]}</span>
          </button>
        ))}
      </Grupo>
      {!bienvenida && (
        <button className="enlace-juego" onClick={() => guardar(() => (location.hash = '#/closet'))}>
          Más peinados y ropa en tu clóset <Moneda tam={15} />
        </button>
      )}

      <Grupo titulo="Color de pelo">
        {COLORES_PELO.map((c, i) => <Muestra key={c} color={c} activa={p.pelo === i} onClick={() => cambiar({ pelo: i })} etiqueta={`Pelo ${i + 1}`} />)}
      </Grupo>

      <Grupo titulo="Lentes">
        {lentes.map((x) => (
          <Chip key={x.id} activo={equipo.lentes === x.id} onClick={() => cambiar({ lentes: false, equipo: { ...equipo, lentes: x.id } })}>{x.nombre}</Chip>
        ))}
      </Grupo>

      <Grupo titulo="Barba y bigote">
        {(Object.keys(VELLO) as Vello[]).map((k) => (
          <Chip key={k} activo={velloDe(p) === k} onClick={() => cambiar({ vello: k })}>{VELLO[k]}</Chip>
        ))}
        <Chip activo={p.aretes} onClick={() => cambiar({ aretes: !p.aretes })}>Aretes</Chip>
      </Grupo>

      <Grupo titulo="Playera">
        {PLAYERAS.map((c, i) => <Muestra key={c} color={c} activa={p.ropa === i} onClick={() => cambiar({ ropa: i })} etiqueta={`Playera ${i + 1}`} />)}
      </Grupo>

      <Grupo titulo="Jeans">
        {PANTALONES.map((c, i) => <Muestra key={c} color={c} activa={(p.pantalon ?? 0) === i} onClick={() => cambiar({ pantalon: i })} etiqueta={`Jeans ${i + 1}`} />)}
      </Grupo>

      <Grupo titulo="Tenis">
        {TENIS.map((c, i) => <Muestra key={c} color={c} activa={(p.tenis ?? 0) === i} onClick={() => cambiar({ tenis: i })} etiqueta={`Tenis ${i + 1}`} />)}
      </Grupo>

      <footer className="historia-pie">
        <button className="boton-juego" onClick={() => guardar(listo)}>{bienvenida ? '¡LISTO, A EMPEZAR!' : 'GUARDAR'}</button>
      </footer>
    </main>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="perfil-grupo">
      <h2>{titulo}</h2>
      <div className="perfil-opciones">{children}</div>
    </section>
  );
}

function Muestra({ color, activa, onClick, etiqueta }: { color: string; activa: boolean; onClick: () => void; etiqueta: string }) {
  return <button className={`muestra ${activa ? 'activa' : ''}`} style={{ background: color }} onClick={onClick} aria-label={etiqueta} aria-pressed={activa} />;
}

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={`chip-juego ${activo ? 'activo' : ''}`} onClick={onClick} aria-pressed={activo}>{children}</button>;
}
