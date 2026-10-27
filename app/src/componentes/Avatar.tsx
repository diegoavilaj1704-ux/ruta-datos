import { useId, useMemo } from 'react';
import { ENCUADRE, EQUIPO_INICIAL, svgCuerpo, type Equipo } from '../lib/armario';
import { dibujarCara, dibujarHashy, ELENCO, PERFIL_INICIAL, rasgosDePerfil, type Animo, type Perfil, type Quien } from '../lib/personajes';
import { useProgreso } from '../lib/progreso';

interface Props {
  quien: Quien;
  tam?: number;
  animo?: Animo;
  perfil?: Perfil;   // para vistas previas (creador, clóset)
}

// Cara en círculo. Para `yo` es el recorte de su cuerpo completo, con gorro y lentes.
export function Avatar({ quien, tam = 40, animo = 'feliz', perfil }: Props) {
  const id = useId().replace(/:/g, '');
  const progreso = useProgreso();
  const p = perfil ?? progreso.perfil ?? PERFIL_INICIAL;
  const svg = useMemo(() => {
    if (quien === 'hashy') return dibujarHashy(animo, id);
    if (quien === 'yo') return svgCuerpo(rasgosDePerfil(p), equipoDe(p), id, ENCUADRE.cara, true);
    return dibujarCara(ELENCO[quien], id);
  }, [quien, animo, id, p]);
  return <span className="avatar" style={{ width: tam, height: tam }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Cuerpo completo (o un encuadre de él) del avatar del alumno
export function Cuerpo({ perfil, equipo, encuadre = ENCUADRE.completo, ancho, alto }: {
  perfil: Perfil; equipo?: Equipo; encuadre?: string; ancho: number; alto: number;
}) {
  const id = useId().replace(/:/g, '');
  const svg = useMemo(
    () => svgCuerpo(rasgosDePerfil(perfil), equipo ?? equipoDe(perfil), id, encuadre),
    [perfil, equipo, id, encuadre],
  );
  return <span className="cuerpo" style={{ width: ancho, height: alto }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Perfiles guardados antes del clóset traen `lentes` sueltos: se pasan al equipo
export function equipoDe(p: Perfil): Equipo {
  return { ...EQUIPO_INICIAL, ...(p.lentes ? { lentes: 'redondos' } : {}), ...p.equipo };
}
