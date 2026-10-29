import { useId, useMemo } from 'react';
import { EQUIPO_INICIAL, type Equipo } from '../lib/armario';
import { ENCUADRE, svgFigura } from '../lib/figura';
import { svgIcono } from '../lib/icono';
import { dibujarHashy, ELENCO, figuraDePerfil, PERFIL_INICIAL, type Animo, type Perfil, type Quien } from '../lib/personajes';
import { useProgreso } from '../lib/progreso';

interface Props {
  quien: Quien;
  tam?: number;
  animo?: Animo;
  perfil?: Perfil;   // para vistas previas (creador, clóset)
}

// Ícono en círculo: plano y sin contorno (lib/icono.ts), con su pelo, lentes y gorro.
export function Avatar({ quien, tam = 40, animo = 'feliz', perfil }: Props) {
  const id = useId().replace(/:/g, '');
  const progreso = useProgreso();
  const p = perfil ?? progreso.perfil ?? PERFIL_INICIAL;
  const svg = useMemo(() => {
    if (quien === 'hashy') return dibujarHashy(animo, id);
    if (quien === 'yo') return svgIcono(figuraDePerfil(p), equipoDe(p), id);
    const { figura, equipo } = ELENCO[quien];
    return svgIcono(figura, equipo, id);
  }, [quien, animo, id, p]);
  return <span className="avatar" style={{ width: tam, height: tam }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Cuerpo completo (o un encuadre de él) del avatar del alumno
export function Cuerpo({ perfil, equipo, encuadre = ENCUADRE.completo, ancho, alto }: {
  perfil: Perfil; equipo?: Equipo; encuadre?: string; ancho: number; alto: number;
}) {
  const id = useId().replace(/:/g, '');
  const svg = useMemo(
    () => svgFigura(figuraDePerfil(perfil), equipo ?? equipoDe(perfil), id, encuadre),
    [perfil, equipo, id, encuadre],
  );
  return <span className="cuerpo" style={{ width: ancho, height: alto }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Perfiles guardados antes del clóset traen `lentes` sueltos: se pasan al equipo
export function equipoDe(p: Perfil): Equipo {
  return { ...EQUIPO_INICIAL, ...(p.lentes ? { lentes: 'redondos' } : {}), ...p.equipo };
}
