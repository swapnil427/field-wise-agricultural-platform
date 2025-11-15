import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  message: {
    id: string;
    userId: string;
    username: string;
    userType: 'farmer' | 'expert';
    avatar: string;
    message: string;
    timestamp: string;
    room: string;
    recipientId?: string;
  };
  currentUserId?: string;
}

export const ChatMessage = ({ message, currentUserId }: ChatMessageProps) => {
  const isCurrentUser = message.userId === currentUserId;
  const isExpert = message.userType === 'expert';
  const isPrivate = message.room === 'private';

  return (
    <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback 
          className={`text-sm font-semibold ${
            isExpert 
              ? 'bg-accent text-white' 
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {message.avatar}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-baseline gap-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <span className="font-semibold text-sm">{message.username}</span>
          {isExpert && (
            <Badge variant="secondary" className="text-xs">
              Expert
            </Badge>
          )}
          {isPrivate && (
            <Badge variant="outline" className="text-xs">
              Private
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
        </div>
        
        <div 
          className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-foreground'
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
};
