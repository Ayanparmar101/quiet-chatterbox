
import React from 'react';
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar = ({ userId, size = 'md', className }: UserAvatarProps) => {
  // Generate a predictable color based on userId
  const getColor = (id: string): string => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 45%)`;
  };

  // Get initials from userId
  const getInitials = (id: string): string => {
    // Extract letters from user id (removing 'user_' prefix if exists)
    const cleaned = id.replace('user_', '');
    return cleaned.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center text-white font-medium",
        sizeClasses[size],
        "transition-transform duration-300 hover:scale-105",
        className
      )}
      style={{ backgroundColor: getColor(userId) }}
    >
      {getInitials(userId)}
    </div>
  );
};

export default UserAvatar;
