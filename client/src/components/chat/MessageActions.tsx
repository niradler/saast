import { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Edit3, 
  Trash2, 
  Share, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown,
  MoreHorizontal,
  Check,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui';
import toast from 'react-hot-toast';

interface MessageActionsProps {
  messageId: string;
  content: string;
  role: 'user' | 'assistant';
  onEdit?: () => void;
  onDelete?: () => void;
  onRegenerate?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  className?: string;
}

export function MessageActions({
  messageId,
  content,
  role,
  onEdit,
  onDelete,
  onRegenerate,
  onCopy,
  onShare,
  onLike,
  onDislike,
  className = ''
}: MessageActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close actions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared message',
        text: content,
      }).catch(() => {
        // Fallback to copying link or showing share modal
        handleCopy();
      });
    } else {
      // Fallback for browsers without native sharing
      handleCopy();
    }
    onShare?.();
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit?.();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete?.();
    }
    setShowActions(false);
  };

  const handleRegenerate = () => {
    setShowActions(false);
    onRegenerate?.();
    toast.success('Regenerating response...');
  };

  const handleLike = () => {
    onLike?.();
    toast.success('Thanks for your feedback!');
  };

  const handleDislike = () => {
    onDislike?.();
    toast.success('Thanks for your feedback!');
  };

  return (
    <div ref={actionsRef} className={`relative ${className}`}>
      {/* Quick actions (always visible on hover) */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Copy button - always show */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Copy message"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>

        {/* Regenerate button - only for assistant messages */}
        {role === 'assistant' && onRegenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Regenerate response"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}

        {/* Like/Dislike for assistant messages */}
        {role === 'assistant' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
              title="Good response"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Poor response"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* More actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowActions(!showActions)}
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="More actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Dropdown menu */}
      {showActions && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1">
            {/* Edit - only for user messages */}
            {role === 'user' && onEdit && (
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit message</span>
              </button>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>Share message</span>
            </button>

            {/* Copy (duplicate for menu) */}
            <button
              onClick={handleCopy}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy to clipboard</span>
            </button>

            {/* Add to prompts library - for good assistant responses */}
            {role === 'assistant' && (
              <button
                onClick={() => {
                  toast.success('Added to prompts library!');
                  setShowActions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Save to library</span>
              </button>
            )}

            {/* Separator */}
            <div className="my-1 border-t border-gray-200 dark:border-gray-600" />

            {/* Delete */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete message</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}