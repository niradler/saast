import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { ChatSidebar } from '../../components/chat/ChatSidebar';
import { ChatMessages } from '../../components/chat/ChatMessages';
import { ChatInput } from '../../components/chat/ChatInput';
import { Button } from '../../components/ui';
import { Minimize, MessageSquare } from 'lucide-react';

export function ChatPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    // Fullscreen chat mode
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              Saast Chat
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            aria-label="Exit fullscreen"
          >
            <Minimize className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>

        {/* Fullscreen Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMessages />
          <ChatInput 
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
    );
  }

  // Regular chat mode with layout
  return (
    <Layout 
      showSidebar={true} 
      sidebar={<ChatSidebar />}
    >
      <div className="flex flex-col h-full">
        <ChatMessages />
        <ChatInput 
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </Layout>
  );
}