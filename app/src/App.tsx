import { useEffect, useState } from 'react';
import { buscarSesion, type Sesion } from './lib/contenido';
import { Hoy } from './pantallas/Hoy';
import { Leccion } from './pantallas/Leccion';

// Navegación por hash (#/s/<clave>) para que funcione igual como PWA y dentro de Capacitor
function leerRuta(): Sesion | undefined {
  const m = location.hash.match(/^#\/s\/(.+)$/);
  return m ? buscarSesion(decodeURIComponent(m[1])) : undefined;
}

export default function App() {
  const [sesion, setSesion] = useState(leerRuta);

  useEffect(() => {
    const alCambiar = () => setSesion(leerRuta());
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  if (sesion) {
    return <Leccion sesion={sesion} volver={() => (location.hash = '#/')} />;
  }
  return <Hoy abrir={(s) => (location.hash = `#/s/${encodeURIComponent(s.clave)}`)} />;
}
