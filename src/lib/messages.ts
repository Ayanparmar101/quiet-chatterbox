
import { storeData, retrieveData, STORAGE_KEYS, getUserId } from './storage';

export interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
  isCurrentUser: boolean;
}

// Get all stored messages
export const getMessages = (): Message[] => {
  const currentUserId = getUserId();
  const messages = retrieveData<Message[]>(STORAGE_KEYS.MESSAGES, []);
  
  // Update isCurrentUser flag based on current user ID
  return messages.map(message => ({
    ...message,
    isCurrentUser: message.userId === currentUserId
  }));
};

// Add a new message
export const addMessage = (text: string): Message[] => {
  const messages = getMessages();
  const currentUserId = getUserId();
  
  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    userId: currentUserId,
    timestamp: Date.now(),
    isCurrentUser: true
  };
  
  const updatedMessages = [...messages, newMessage];
  storeData(STORAGE_KEYS.MESSAGES, updatedMessages);
  
  return updatedMessages;
};

// Format timestamp to a readable format
export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
