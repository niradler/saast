import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { useChatStore } from '../../store/chatStore';
import { MessageSquare } from 'lucide-react';

export function ChatMessages() {
  const { getActiveConversation } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = getActiveConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to ChatSaaS
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start a new conversation by typing a message below. Our AI assistant is here to help you with anything you need.
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>✨ Supports Markdown formatting</p>
            <p>📊 Renders Mermaid diagrams</p>
            <p>💻 Syntax highlighting for code</p>
            <p>🎨 Multiple themes available</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeConversation.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            New Conversation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Send your first message to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
      <div className="max-w-4xl mx-auto">
        {activeConversation.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}