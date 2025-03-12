
import React from 'react';
import { cn } from "@/lib/utils";
import { Message, formatMessageTime } from '@/lib/messages';
import UserAvatar from './UserAvatar';
import { Check } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  className?: string;
  style?: React.CSSProperties;
}

const ChatMessage = ({ message, className, style }: ChatMessageProps) => {
  const { id, text, isCurrentUser, userId, timestamp } = message;
  
  return (
    <div 
      className={cn(
        "flex items-end gap-2 max-w-[80%] animate-in",
        isCurrentUser ? "self-end" : "self-start",
        className
      )}
      style={style}
    >
      {!isCurrentUser && (
        <UserAvatar userId={userId} size="sm" className="mb-1" />
      )}
      
      <div 
        className={cn(
          "px-3 py-2 rounded-3xl backdrop-blur-sm",
          isCurrentUser 
            ? "message-sent bg-whatsapp-chat text-gray-800" 
            : "message-received bg-white text-gray-800",
          "shadow-sm"
        )}
      >
        <p className="break-words">{text}</p>
        <div className={cn(
          "flex items-center justify-end gap-1 text-xs mt-1",
          isCurrentUser ? "text-gray-600" : "text-gray-500"
        )}>
          <span>{formatMessageTime(timestamp)}</span>
          {isCurrentUser && <Check className="w-3 h-3" />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
