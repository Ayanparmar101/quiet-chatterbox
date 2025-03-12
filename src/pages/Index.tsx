
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import AnimatedTransition from '@/components/AnimatedTransition';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Message, getMessages, addMessage } from '@/lib/messages';
import { MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages and set up real-time subscription
  useEffect(() => {
    loadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          // When a new message is inserted, reload all messages to get the latest state
          await loadMessages();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    try {
      const messages = await getMessages();
      setMessages(messages);
      // Scroll to bottom whenever new messages are loaded
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: "Error loading messages",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      await addMessage(text);
      // The subscription will automatically trigger loadMessages
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <AnimatedTransition 
        className="px-6 py-4 bg-whatsapp-darkest text-white flex items-center gap-3 shadow-sm"
        delay={100}
      >
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-xl font-semibold">WhatsApp Web Clone</h1>
      </AnimatedTransition>

      {/* Chat area with messages */}
      <AnimatedTransition 
        className="flex-1 overflow-y-auto p-6 chat-background"
        delay={300}
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm text-center">
                <MessageSquare className="h-12 w-12 mb-3 mx-auto text-whatsapp-dark opacity-80" />
                <h2 className="text-xl font-medium mb-2">Welcome to WhatsApp Web Clone</h2>
                <p className="text-gray-600 max-w-md">
                  Start chatting anonymously. Your messages will be saved and visible to anyone with the link.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                className="animate-in"
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </AnimatedTransition>

      {/* Input area */}
      <AnimatedTransition 
        className="p-4 bg-gray-50 border-t border-gray-200"
        delay={500}
      >
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default Index;
