import { useId, useMemo } from 'react';
import { dibujarCara, PERSONAJES, type Quien } from '../lib/personajes';

export function Avatar({ quien, tam = 40 }: { quien: Quien; tam?: number }) {
  const id = useId().replace(/:/g, '');
  const svg = useMemo(() => dibujarCara(PERSONAJES[quien], id), [quien, id]);
  return <span className="avatar" style={{ width: tam, height: tam }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
