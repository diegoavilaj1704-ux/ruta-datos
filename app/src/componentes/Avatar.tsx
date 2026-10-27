import { useId, useMemo } from 'react';
import { dibujarCara, dibujarHashy, ELENCO, PERFIL_INICIAL, rasgosDePerfil, type Animo, type Perfil, type Quien } from '../lib/personajes';
import { useProgreso } from '../lib/progreso';

interface Props {
  quien: Quien;
  tam?: number;
  animo?: Animo;
  perfil?: Perfil;   // para la vista previa del creador de avatar
}

export function Avatar({ quien, tam = 40, animo = 'feliz', perfil }: Props) {
  const id = useId().replace(/:/g, '');
  const progreso = useProgreso();
  const miPerfil = perfil ?? progreso.perfil;
  const svg = useMemo(() => {
    if (quien === 'hashy') return dibujarHashy(animo, id);
    if (quien === 'yo') return dibujarCara(rasgosDePerfil(miPerfil ?? PERFIL_INICIAL), id);
    return dibujarCara(ELENCO[quien], id);
  }, [quien, animo, id, miPerfil]);
  return <span className="avatar" style={{ width: tam, height: tam }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

