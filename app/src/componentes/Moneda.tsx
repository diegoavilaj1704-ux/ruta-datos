// Moneda dorada: el ícono de los XP en toda la app (barra del mapa, lecciones y clóset)
export function Moneda({ tam = 16 }: { tam?: number }) {
  return (
    <svg className="moneda" width={tam} height={tam} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="11" r="8.5" fill="#C98A00" />
      <circle cx="10" cy="9.5" r="8.5" fill="#FFC531" stroke="#A86F00" strokeWidth="1.2" />
      <circle cx="10" cy="9.5" r="5.2" fill="none" stroke="#E0A000" strokeWidth="1.4" />
      <path d="M6.5 6.5 Q8 4.5 10.5 4.6" fill="none" stroke="#FFF3C4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
