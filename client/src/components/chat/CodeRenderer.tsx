import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '../../utils';

interface CodeRendererProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeRenderer({ 
  code, 
  language = 'text', 
  showLineNumbers = false,
  className = '' 
}: CodeRendererProps) {
  const { theme } = useSettingsStore();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={theme.mode === 'dark' ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          border: 'none',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
            fontSize: '14px',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}