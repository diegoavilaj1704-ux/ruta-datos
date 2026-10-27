import { useEffect, useState } from 'react';
import { buscarSesion, type Sesion } from './lib/contenido';
import { Hoy } from './pantallas/Hoy';
import { Leccion } from './pantallas/Leccion';
import { Historia } from './pantallas/Historia';
import { Perfil } from './pantallas/Perfil';
import { Closet } from './pantallas/Closet';
import { useProgreso } from './lib/progreso';

// Navegación por hash para que funcione igual como PWA y dentro de Capacitor:
//   #/s/<clave>  sesión (en historia si existe)   #/t/<clave>  lección en texto   #/perfil  tu personaje   #/closet  gastar XP
function leerRuta(): { sesion?: Sesion; texto: boolean } {
  const m = location.hash.match(/^#\/([st])\/(.+)$/);
  return { sesion: m ? buscarSesion(decodeURIComponent(m[2])) : undefined, texto: m?.[1] === 't' };
}

const ir = (modo: 's' | 't', s: Sesion) => (location.hash = `#/${modo}/${encodeURIComponent(s.clave)}`);

export default function App() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    const alCambiar = () => setRuta(leerRuta());
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  const progreso = useProgreso();
  const volver = () => (location.hash = '#/');
  const { sesion, texto } = ruta;

  // Primera vez: se arma el personaje antes de cualquier lección
  if (!progreso.perfil) return <Perfil bienvenida listo={() => undefined} />;
  if (location.hash === '#/perfil') return <Perfil listo={volver} />;
  if (location.hash === '#/closet') return <Closet volver={volver} />;

  if (sesion?.historia && !texto) {
    return <Historia sesion={sesion} volver={volver} verTexto={() => ir('t', sesion)} />;
  }
  if (sesion) {
    return <Leccion sesion={sesion} volver={volver} />;
  }
  return <Hoy abrir={(s) => ir('s', s)} />;
}
