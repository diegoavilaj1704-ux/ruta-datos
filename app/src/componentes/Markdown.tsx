import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  texto: string;
  // Si se pasa, los bloques SQL que usan la tabla del dataset muestran "Probar"
  onProbar?: (codigo: string) => void;
}

export function Markdown({ texto, onProbar }: Props) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="tabla-scroll">
              <table>{children}</table>
            </div>
          ),
          pre: ({ children, node }) => {
            const codigoNodo = node?.children[0];
            const clase = codigoNodo && 'properties' in codigoNodo ? String(codigoNodo.properties.className ?? '') : '';
            const codigo = codigoNodo && 'children' in codigoNodo
              ? codigoNodo.children.map((c) => ('value' in c ? c.value : '')).join('').trimEnd()
              : '';
            const ejecutable = onProbar && clase.includes('language-sql') && /\bventas\b/i.test(codigo);
            return (
              <div className="bloque-codigo">
                <pre>{children}</pre>
                {ejecutable && (
                  <button className="boton-probar" onClick={() => onProbar(codigo)}>
                    ▶ Probar
                  </button>
                )}
              </div>
            );
          },
        }}
      >
        {texto}
      </ReactMarkdown>
    </div>
  );
}

// Texto corto con `código`, **negritas** y *cursivas* en línea (opciones del quiz, enunciados)
export function TextoEnLinea({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/).map((parte, i) => {
        if (parte.startsWith('`')) return <code key={i}>{parte.slice(1, -1)}</code>;
        if (parte.startsWith('**')) return <strong key={i}>{parte.slice(2, -2)}</strong>;
        if (parte.startsWith('*') && parte.length > 2) return <em key={i}>{parte.slice(1, -1)}</em>;
        return <span key={i}>{parte}</span>;
      })}
    </>
  );
}
