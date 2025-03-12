
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
  isCurrentUser: boolean;
}

// Get all stored messages
export const getMessages = async (): Promise<Message[]> => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  const currentUserId = getUserId();
  return messages.map(msg => ({
    id: msg.id,
    text: msg.text,
    userId: msg.user_id,
    timestamp: msg.timestamp,
    isCurrentUser: msg.user_id === currentUserId
  }));
};

// Add a new message
export const addMessage = async (text: string): Promise<Message[]> => {
  const userId = getUserId();
  const timestamp = Date.now();

  const { error } = await supabase
    .from('messages')
    .insert([
      {
        text,
        user_id: userId,
        timestamp
      }
    ]);

  if (error) {
    console.error('Error adding message:', error);
    return [];
  }

  return getMessages();
};

// Get or create a unique user ID
export const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Format timestamp to a readable format
export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
