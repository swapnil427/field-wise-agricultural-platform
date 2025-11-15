import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { OnlineUsers } from "./OnlineUsers";
import { useSocket } from "@/hooks/useSocket";
import { MessageSquare, Users, X, Wifi, WifiOff, Menu } from "lucide-react";

interface ChatWindowProps {
  currentUser: {
    userId: string;
    username: string;
    userType: 'farmer' | 'expert';
    avatar: string;
  };
  onClose?: () => void;
}

export const ChatWindow = ({ currentUser, onClose }: ChatWindowProps) => {
  const {
    socket,
    isConnected,
    messages,
    onlineUsers,
    sendMessage,
    sendPrivateMessage,
    joinChat,
    leaveChat,
    typingUsers,
    setTyping
  } = useSocket();

  const [currentRoom, setCurrentRoom] = useState('general');
  const [privateChatWith, setPrivateChatWith] = useState<{ userId: string; username: string } | null>(null);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Join chat when component mounts
  useEffect(() => {
    if (socket && currentUser) {
      joinChat(currentUser);
    }

    return () => {
      leaveChat();
    };
  }, [socket, currentUser, joinChat, leaveChat]);

  // Filter messages based on current room
  useEffect(() => {
    if (privateChatWith) {
      setFilteredMessages(messages.filter(msg => 
        (msg.userId === currentUser.userId && msg.recipientId === privateChatWith.userId) ||
        (msg.userId === privateChatWith.userId && msg.recipientId === currentUser.userId)
      ));
    } else {
      setFilteredMessages(messages.filter(msg => msg.room === currentRoom));
    }
  }, [messages, currentRoom, privateChatWith, currentUser.userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSendMessage = (message: string) => {
    if (privateChatWith) {
      sendPrivateMessage(message, privateChatWith.userId);
    } else {
      sendMessage(message, currentRoom);
    }
  };

  const handleStartPrivateChat = (userId: string, username: string) => {
    setPrivateChatWith({ userId, username });
    setCurrentRoom('private');
  };

  const handleBackToGeneral = () => {
    setPrivateChatWith(null);
    setCurrentRoom('general');
  };

  const getTypingIndicator = () => {
    if (typingUsers.length === 0) return null;
    
    const typingText = typingUsers.length === 1 
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.length} people are typing...`;
    
    return (
      <div className="text-sm text-muted-foreground italic px-4 py-2">
        {typingText}
      </div>
    );
  };

  return (
    <div className="flex h-[600px] bg-background border rounded-lg shadow-lg">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">
                {privateChatWith ? `Private chat with ${privateChatWith.username}` : 'Community Chat'}
              </h3>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-3 h-3" />
                    <span className="text-xs">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <WifiOff className="w-3 h-3" />
                    <span className="text-xs">Disconnected</span>
                  </div>
                )}
                <Badge variant="outline" className="text-xs">
                  {onlineUsers.length} online
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {privateChatWith && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToGeneral}
                className="hidden sm:inline-flex"
              >
                Back to General
              </Button>
            )}
            
            {/* Mobile menu for online users */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <OnlineUsers
                  users={onlineUsers}
                  currentUserId={currentUser.userId}
                  onStartPrivateChat={handleStartPrivateChat}
                />
              </SheetContent>
            </Sheet>
            
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={currentUser.userId}
              />
            ))}
            {getTypingIndicator()}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={setTyping}
          placeholder={
            privateChatWith 
              ? `Message ${privateChatWith.username}...`
              : "Type your message..."
          }
          disabled={!isConnected}
        />
      </div>

      {/* Online Users Sidebar */}
      <div className="hidden lg:block w-80 border-l p-4 overflow-y-auto">
        <OnlineUsers
          users={onlineUsers}
          currentUserId={currentUser.userId}
          onStartPrivateChat={handleStartPrivateChat}
        />
      </div>
    </div>
  );
};
