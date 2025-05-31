import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  content: string;
  className?: string;
}

export function MermaidRenderer({ content, className = '' }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });

    if (ref.current) {
      // Clear previous content
      ref.current.innerHTML = '';
      
      mermaid.render(id.current, content)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch((error) => {
          console.error('Mermaid rendering error:', error);
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded">
              <p class="font-semibold">Mermaid Diagram Error</p>
              <pre class="text-sm mt-2">${error.message}</pre>
            </div>`;
          }
        });
    }
  }, [content]);

  return (
    <div 
      ref={ref} 
      className={`mermaid-container flex justify-center my-4 ${className}`}
    />
  );
}