import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, Paperclip, Mic, Square, X, Maximize, Minimize } from 'lucide-react';
import { Button, Textarea } from '../ui';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { sendMessage } from '../../services/chatService';
import { config } from '../../config';
import toast from 'react-hot-toast';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  isFullscreen = false,
  onToggleFullscreen,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    activeConversationId,
    addMessage,
    createNewConversation,
    setActiveConversation,
    getActiveConversation,
  } = useChatStore();
  const { user } = useAuthStore();

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // ~5 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled || isLoading) return;

    const messageText = message.trim();
    setMessage('');

    // Check for demo command
    if (messageText.startsWith('/demo')) {
      handleDemoChat(messageText);
      return;
    }

    try {
      setIsLoading(true);

      // Create conversation if none exists
      let conversationId = activeConversationId;
      if (!conversationId && user) {
        conversationId = createNewConversation();
        setActiveConversation(conversationId);
      }

      if (!conversationId || !user) {
        toast.error('Please login to send messages');
        return;
      }

      // Add user message immediately
      addMessage(conversationId, {
        role: 'user',
        content: messageText,
        conversationId,
      });

      // Send to API and get response
      const response = await sendMessage({
        message: messageText,
        conversationId,
      });

      // Add assistant response
      addMessage(conversationId, {
        role: 'assistant',
        content: response.message.content,
        conversationId,
      });

      // Call custom handler if provided
      onSendMessage?.(messageText);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      // Restore message on error
      setMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoChat = (messageText: string) => {
    const type = messageText.split(' ')[1];
    if (!activeConversationId || !user) return;
    let demoResponse = '';
    switch (type) {
      // case 'chat':
      //   break;
      case 'markdown':
        demoResponse = `
# 🎉 Saast Chat Capabilities Demo

Welcome to the comprehensive demo of Saast's advanced chat rendering capabilities!

## 📝 **Markdown Support**

### Text Formatting
- **Bold text** and *italic text*
- ~~Strikethrough text~~
- \`Inline code\` formatting
- [Links to external sites](https://example.com)

### Lists and Structure
1. **Ordered lists** with numbers
2. **Nested content** support
   - Unordered sub-items
   - Multiple levels of nesting
3. **Complex formatting**

### Blockquotes
> "The best way to predict the future is to create it." - Peter Drucker
> 
> This is a multi-line blockquote that demonstrates how we handle longer quoted content with proper styling and formatting.

## 📋 **Tables and Data**

| Feature | Status | Performance | Mobile Support |
|---------|--------|-------------|----------------|
| Markdown | ✅ Complete | ⚡ Excellent | 📱 Optimized |
| Mermaid | ✅ Complete | ⚡ Fast | 📱 Responsive |
| Code Syntax | ✅ 100+ Languages | ⚡ Instant | 📱 Scrollable |
| Math (LaTeX) | 🔄 Coming Soon | - | - |
| Custom HTML | ✅ Sanitized | ⚡ Secure | 📱 Adaptive |

### Task Lists
- [x] Implement markdown rendering
- [x] Add mermaid diagram support  
- [x] Create syntax highlighting
- [ ] Add LaTeX math support
- [ ] Implement voice input
- [ ] Add file attachments
        `;
        break;
      // case 'form':
      //   break;
      case 'code':
        demoResponse = `
## 💻 **Code Highlighting**

### JavaScript/TypeScript
\`\`\`typescript
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const processMessage = async (message: ChatMessage): Promise<string> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  
  return response.json();
};
\`\`\`

### Python
\`\`\`python
import asyncio
from typing import List, Dict, Any

class ChatRenderer:
    def __init__(self, theme: str = "default"):
        self.theme = theme
        self.processors = {
            'markdown': self._process_markdown,
            'code': self._highlight_code,
            'mermaid': self._render_diagram
        }
    
    async def render(self, content: str) -> Dict[str, Any]:
        """Process and render chat content"""
        content_type = self._detect_type(content)
        processor = self.processors.get(content_type)
        
        if processor:
            return await processor(content)
        
        return {"type": "text", "content": content}
    
    def _detect_type(self, content: str) -> str:
        if content.startswith('\`\`\`'):
            return 'code'
        elif 'mermaid' in content:
            return 'mermaid'
        else:
            return 'markdown'
\`\`\`

### SQL
\`\`\`sql
-- Complex query with multiple joins and subqueries
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(c.id) as conversation_count,
    AVG(m.length) as avg_message_length,
    MAX(c.updated_at) as last_activity
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING conversation_count > 0
ORDER BY last_activity DESC
LIMIT 50;
\`\`\`
     
        `;
        break;
      // case 'table':
      //   break;
      case 'diagram':
        demoResponse = `
## 📊 **Mermaid Diagrams**

### Flowchart Example
\`\`\`mermaid
graph TD
    A[User Input] --> B{Input Type?}
    B -->|Text| C[Process Text]
    B -->|Code| D[Syntax Highlight]
    B -->|Diagram| E[Render Mermaid]
    C --> F[Generate Response]
    D --> F
    E --> F
    F --> G[Display Result]
    G --> H[User Sees Output]
\`\`\`

### Sequence Diagram
\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant S as Saast
    participant AI as AI Engine
    participant R as Renderer
    
    U->>S: Send Message
    S->>AI: Process Request
    AI->>S: Generate Response
    S->>R: Parse Content
    R->>S: Formatted Output
    S->>U: Display Result
\`\`\`        
        `;
        break;
      case 'html':
        demoResponse = `
  <h1 class="text-2xl font-bold">Welcome to our website</h1>
  <p class="text-gray-600">This is a simple HTML example with inline styles.</p>
  <input type="text" class="border border-gray-300 rounded-md p-2" placeholder="Enter your name" />
  <button class="bg-blue-500 text-white rounded-md p-2">Submit</button>
        `;
        break;
      default:
        demoResponse = `
### Demos available
- /demo markdown
- /demo code
- /demo diagram
- /demo html
`;
    }

    // Add user message
    addMessage(activeConversationId, {
      role: 'user',
      content: messageText,
      conversationId: activeConversationId,
    });

    // Add demo response
    setTimeout(() => {
      addMessage(activeConversationId, {
        role: 'assistant',
        content: demoResponse,
        conversationId: activeConversationId,
      });
    }, 500);

    toast.success('🎉 Chat capabilities demo loaded!');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSubmit(e as any);
      }
    }
  };

  const handleNewChat = () => {
    if (user) {
      const conversationId = createNewConversation();
      setActiveConversation(conversationId);
      toast.success('New conversation started');
    }
  };

  const handleFileUpload = () => {
    if (config.features.fileUpload) {
      fileInputRef.current?.click();
    } else {
      toast('File upload feature coming soon!', {
        icon: '📎',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload functionality
      toast('File upload feature coming soon!', {
        icon: '📎',
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast('Voice recording feature coming soon!', {
        icon: '🎙️',
      });
    } else {
      // Start recording
      setIsRecording(true);
      toast('Voice recording feature coming soon!', {
        icon: '🎙️',
      });
    }
  };

  const canSend = message.trim() && !disabled && !isLoading;

  return (
    <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center border-b border-gray-200 py-3 dark:border-gray-800">
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
        </div>
      )}

      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {/* Main input area */}
          <div className="flex items-end space-x-3">
            {/* New Chat Button - Only on larger screens */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="hidden h-10 flex-shrink-0 sm:flex"
              disabled={disabled}
              aria-label="Start new conversation"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Fullscreen Toggle - Only on mobile */}
            {onToggleFullscreen && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-10 flex-shrink-0 sm:hidden"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            )}

            {/* Message Input Container */}
            <div className="relative flex-1">
              <div className="flex items-end space-x-2 rounded-2xl border border-gray-300 bg-gray-50 p-3 transition-colors focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 dark:border-gray-600 dark:bg-gray-800">
                {/* Attachment Button - Only show if feature is enabled */}
                {config.features.fileUpload && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleFileUpload}
                    className="h-8 w-8 flex-shrink-0 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={disabled}
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                )}

                {/* Text Input */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={disabled || isLoading}
                  className="max-h-[120px] min-h-[24px] flex-1 resize-none border-none bg-transparent text-gray-900 placeholder-gray-500 outline-none dark:text-gray-100 dark:placeholder-gray-400"
                  rows={1}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                />

                {/* Voice Recording Button - Only show if feature is enabled */}
                {config.features.voiceRecording && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleRecording}
                    className={`h-8 w-8 flex-shrink-0 p-0 transition-colors ${
                      isRecording
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                    disabled={disabled}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                  >
                    {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}

                {/* Send Button */}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!canSend}
                  className={`h-8 w-8 flex-shrink-0 p-0 transition-all ${
                    canSend
                      ? 'scale-100 bg-primary-600 text-white hover:bg-primary-700'
                      : 'scale-95 bg-gray-300 text-gray-500 dark:bg-gray-600'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Character count for long messages */}
              {message.length > 500 && (
                <div className="absolute -top-6 right-0 text-xs text-gray-400">
                  {message.length}/2000
                </div>
              )}
            </div>
          </div>

          {/* Helper text */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {!isFullscreen && (
                <span className="hidden text-primary-600 dark:text-primary-400 sm:inline">
                  Try: "/demo" for capabilities showcase
                </span>
              )}
            </div>
            {user && (
              <span className="hidden sm:inline">{user.subscription?.plan || 'Free'} plan</span>
            )}
          </div>
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  );
}
