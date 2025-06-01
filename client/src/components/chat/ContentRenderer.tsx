import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// import remarkMdx from 'remark-mdx';
import { CodeRenderer } from './CodeRenderer';
import { MermaidRenderer } from './MermaidRenderer';
import type { RenderableContent } from '../../types';

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  // Detect content type and render accordingly
  const renderableContent = detectContentType(content);

  switch (renderableContent.type) {
    case 'mermaid':
      return <MermaidRenderer content={renderableContent.content} className={className} />;

    case 'code':
      return (
        <CodeRenderer
          code={renderableContent.content}
          language={renderableContent.language}
          className={className}
        />
      );

    case 'markdown':
    default:
      return (
        <div className={`prose-chat ${className}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                if (!inline && language) {
                  const code = String(children).replace(/\n$/, '');

                  // Check if it's a mermaid diagram
                  if (language === 'mermaid') {
                    return <MermaidRenderer content={code} />;
                  }

                  return (
                    <CodeRenderer
                      code={code}
                      language={language}
                      showLineNumbers={code.split('\n').length > 5}
                    />
                  );
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },

              // Custom link rendering
              a({ href, children, ...props }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },

              // Custom table rendering
              table({ children, ...props }) {
                return (
                  <div className="my-4 overflow-x-auto">
                    <table
                      className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                      {...props}
                    >
                      {children}
                    </table>
                  </div>
                );
              },

              // Custom blockquote rendering
              blockquote({ children, ...props }) {
                return (
                  <blockquote
                    className="my-4 rounded-r-lg border-l-4 border-primary-500 bg-gray-50 py-2 pl-4 dark:bg-gray-800/50"
                    {...props}
                  >
                    {children}
                  </blockquote>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
  }
}

function detectContentType(content: string): RenderableContent {
  const trimmedContent = content.trim();

  // Check for mermaid diagrams
  if (trimmedContent.startsWith('```mermaid') && trimmedContent.endsWith('```')) {
    const mermaidContent = trimmedContent.slice(10, -3).trim();
    return {
      type: 'mermaid',
      content: mermaidContent,
    };
  }

  // Check for code blocks
  const codeBlockMatch = trimmedContent.match(/^```(\w+)?\n([\s\S]*?)\n```$/);
  if (codeBlockMatch) {
    return {
      type: 'code',
      content: codeBlockMatch[2],
      language: codeBlockMatch[1] || 'text',
    };
  }

  // Check for HTML content
  if (trimmedContent.startsWith('<') && trimmedContent.endsWith('>')) {
    const htmlTagMatch = trimmedContent.match(/^<(\w+)[\s\S]*<\/\1>$/);
    if (htmlTagMatch) {
      return {
        type: 'html',
        content: trimmedContent,
      };
    }
  }

  // Default to markdown
  return {
    type: 'markdown',
    content: trimmedContent,
  };
}
