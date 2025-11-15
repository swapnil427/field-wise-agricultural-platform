import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput = ({ 
  onSendMessage, 
  onTyping, 
  placeholder = "Type your message...",
  disabled = false 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      onTyping(false);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (value.trim()) {
      onTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    } else {
      onTyping(false);
    }
  };

  const handleVoiceToggle = () => {
    // Placeholder for voice recording functionality
    setIsRecording(!isRecording);
    // In a real implementation, you would integrate with Web Speech API
  };

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex gap-2 p-4 border-t bg-background">
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleVoiceToggle}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          disabled={disabled}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4 text-red-500" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      <Button 
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled}
        size="sm"
        className="px-4"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};
