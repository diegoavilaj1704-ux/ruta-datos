import { useState } from 'react';
import { Avatar } from '../componentes/Avatar';
import { COLORES_PELO, PEINADOS, PERFIL_INICIAL, PIELES, ROPAS, type Peinado, type Perfil as PerfilT } from '../lib/personajes';
import { acciones, useProgreso } from '../lib/progreso';

interface Props {
  bienvenida?: boolean;   // primera vez: aún no hay perfil
  listo: () => void;
}

// Creador de avatar: el protagonista de las historias es el propio alumno
export function Perfil({ bienvenida, listo }: Props) {
  const progreso = useProgreso();
  const [p, setP] = useState<PerfilT>(progreso.perfil ?? PERFIL_INICIAL);
  const [error, setError] = useState('');
  const cambiar = (c: Partial<PerfilT>) => setP((v) => ({ ...v, ...c }));

  function guardar() {
    if (!p.nombre.trim()) {
      setError('Escribe cómo quieres que te llamen.');
      return;
    }
    acciones.guardarPerfil(p);
    listo();
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
        <Avatar quien="yo" perfil={p} tam={132} />
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

      <Grupo titulo="Cara">
        <Chip activo={!p.llenito} onClick={() => cambiar({ llenito: false })}>Delgada</Chip>
        <Chip activo={p.llenito} onClick={() => cambiar({ llenito: true })}>Llenita</Chip>
      </Grupo>

      <Grupo titulo="Peinado">
        {(Object.keys(PEINADOS) as Peinado[]).map((k) => (
          <button key={k} className={`peinado ${p.peinado === k ? 'activo' : ''}`} onClick={() => cambiar({ peinado: k })} aria-label={PEINADOS[k]}>
            <Avatar quien="yo" perfil={{ ...p, peinado: k }} tam={52} />
            <span>{PEINADOS[k]}</span>
          </button>
        ))}
      </Grupo>

      <Grupo titulo="Color de pelo">
        {COLORES_PELO.map((c, i) => <Muestra key={c} color={c} activa={p.pelo === i} onClick={() => cambiar({ pelo: i })} etiqueta={`Pelo ${i + 1}`} />)}
      </Grupo>

      <Grupo titulo="Detalles">
        <Chip activo={p.barba} onClick={() => cambiar({ barba: !p.barba })}>Barba</Chip>
        <Chip activo={p.bigote} onClick={() => cambiar({ bigote: !p.bigote })}>Bigote</Chip>
        <Chip activo={p.lentes} onClick={() => cambiar({ lentes: !p.lentes })}>Lentes</Chip>
        <Chip activo={p.aretes} onClick={() => cambiar({ aretes: !p.aretes })}>Aretes</Chip>
      </Grupo>

      <Grupo titulo="Ropa">
        {ROPAS.map(([c], i) => <Muestra key={c} color={c} activa={p.ropa === i} onClick={() => cambiar({ ropa: i })} etiqueta={`Ropa ${i + 1}`} />)}
      </Grupo>

      <footer className="historia-pie">
        <button className="boton-juego" onClick={guardar}>{bienvenida ? '¡LISTO, A EMPEZAR!' : 'GUARDAR'}</button>
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
