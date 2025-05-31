import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Button } from '../ui';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit3,
  Calendar
} from 'lucide-react';
import { formatDate, truncateText } from '../../utils';
import toast from 'react-hot-toast';

export function ChatSidebar() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    createNewConversation,
    deleteConversation,
    updateConversation
  } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleNewChat = () => {
    const conversationId = createNewConversation();
    setActiveConversation(conversationId);
    toast.success('New conversation created');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
      toast.success('Conversation deleted');
    }
  };

  const handleEditStart = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleEditSave = (id: string) => {
    if (editTitle.trim()) {
      updateConversation(id, { title: editTitle.trim() });
      toast.success('Title updated');
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const date = new Date(conv.updatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let group: string;
    if (date.toDateString() === today.toDateString()) {
      group = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = 'Yesterday';
    } else if (date > weekAgo) {
      group = 'This Week';
    } else {
      group = 'Older';
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(conv);
    return groups;
  }, {} as Record<string, typeof conversations>);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(groupedConversations).map(([group, convs]) => (
              <div key={group} className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 mb-2">
                  {group}
                </h3>
                <div className="space-y-1">
                  {convs.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`group relative rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        activeConversationId === conversation.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                          : ''
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      {editingId === conversation.id ? (
                        <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave(conversation.id);
                              if (e.key === 'Escape') handleEditCancel();
                            }}
                            onBlur={() => handleEditSave(conversation.id)}
                            className="flex-1 text-sm bg-transparent border-b border-primary-500 focus:outline-none"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {conversation.title}
                              </h4>
                              {conversation.messages.length > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                  {truncateText(
                                    conversation.messages[conversation.messages.length - 1]?.content || '',
                                    60
                                  )}
                                </p>
                              )}
                              <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(conversation.updatedAt)}
                                <span className="ml-2">
                                  {conversation.messages.length} messages
                                </span>
                              </div>
                            </div>
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEditStart(conversation.id, conversation.title, e)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteConversation(conversation.id, e)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}