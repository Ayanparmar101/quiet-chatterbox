
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  className?: string;
  isLoading?: boolean;
}

const ChatInput = ({ onSendMessage, className, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto adjust height of textarea
  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "flex items-end gap-2 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-gray-100",
        "shadow-sm transition-all duration-300 ease-in-out",
        "focus-within:border-whatsapp focus-within:shadow-md",
        className
      )}
    >
      <textarea
        ref={inputRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        disabled={isLoading}
        className={cn(
          "flex-1 resize-none max-h-32 px-3 py-2.5 rounded-lg",
          "bg-transparent border-0 focus:outline-none focus:ring-0",
          "text-gray-800 placeholder:text-gray-400",
          isLoading && "opacity-70"
        )}
        rows={1}
      />
      
      <Button 
        type="submit" 
        size="icon"
        disabled={!message.trim() || isLoading}
        className={cn(
          "h-10 w-10 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white",
          "transition-all duration-400 ease-in-out transform",
          (!message.trim() || isLoading) && "opacity-70"
        )}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
