import type { Message as MessageType } from '../../types';
import { ContentRenderer } from './ContentRenderer';
import { formatDate, copyToClipboard } from '../../utils';
import { Button } from '../ui';
import { Copy, Check, Trash2, User, Bot, MoreHorizontal, Share, Edit } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import toast from 'react-hot-toast';

interface MessageProps {
  message: MessageType;
  showActions?: boolean;
  isLast?: boolean;
}

export function Message({ message, showActions = true, isLast = false }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteMessage, updateMessage } = useChatStore();

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Message copied to clipboard');
      setShowMenu(false);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(message.conversationId, message.id);
      toast.success('Message deleted');
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content) {
      updateMessage(message.conversationId, message.id, { content: editContent.trim() });
      toast.success('Message updated');
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: message.content,
          title: 'Shared from ChatSaaS',
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      await handleCopy();
    }
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6 px-2 sm:px-0`}>
      <div className={`flex max-w-[90%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 sm:space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mt-1 ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : isAssistant 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
        }`}>
          {isUser ? (
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : isAssistant ? (
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <span className="text-xs font-bold">S</span>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
          {/* Message Bubble */}
          <div className={`relative rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm max-w-full ${
            isUser 
              ? 'message-user rounded-br-md' 
              : isAssistant
              ? 'message-assistant rounded-bl-md border border-gray-200 dark:border-gray-700'
              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-bl-md border border-yellow-200 dark:border-yellow-800'
          }`}>
            {isEditing && isUser ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[80px] p-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {isUser ? (
                  <p className="text-white text-sm sm:text-base whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                ) : (
                  <div className="text-sm sm:text-base">
                    <ContentRenderer content={message.content} />
                  </div>
                )}
                
                {/* Actions Menu Button */}
                {showActions && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative" ref={menuRef}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMenu(!showMenu)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                      
                      {/* Actions Menu */}
                      {showMenu && (
                        <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={handleCopy}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3 h-3 mr-2" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-2" />
                                  Copy
                                </>
                              )}
                            </button>
                            
                            {navigator.share && (
                              <button
                                onClick={handleShare}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Share className="w-3 h-3 mr-2" />
                                Share
                              </button>
                            )}
                            
                            {isUser && (
                              <button
                                onClick={handleEdit}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="w-3 h-3 mr-2" />
                                Edit
                              </button>
                            )}
                            
                            <button
                              onClick={handleDelete}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Message Info */}
          <div className={`flex items-center mt-1 sm:mt-2 space-x-2 text-xs text-gray-500 dark:text-gray-400 ${
            isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
          }`}>
            <time dateTime={message.timestamp} className="whitespace-nowrap">
              {formatDate(message.timestamp)}
            </time>
            
            {/* Token info for assistant messages */}
            {message.metadata?.tokens && (
              <span className="hidden sm:inline text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                {message.metadata.tokens} tokens
              </span>
            )}
            
            {/* Model info */}
            {isAssistant && message.metadata?.model && (
              <span className="hidden sm:inline text-xs opacity-50">
                {message.metadata.model}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}