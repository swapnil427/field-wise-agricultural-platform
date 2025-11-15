import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";

interface User {
  userId: string;
  username: string;
  userType: 'farmer' | 'expert';
  avatar: string;
}

interface OnlineUsersProps {
  users: User[];
  currentUserId?: string;
  onStartPrivateChat?: (userId: string, username: string) => void;
}

export const OnlineUsers = ({ users, currentUserId, onStartPrivateChat }: OnlineUsersProps) => {
  const farmers = users.filter(user => user.userType === 'farmer' && user.userId !== currentUserId);
  const experts = users.filter(user => user.userType === 'expert' && user.userId !== currentUserId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            Online Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Experts */}
          {experts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Experts ({experts.length})
              </h4>
              <div className="space-y-2">
                {experts.map((user) => (
                  <div key={user.userId} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-accent text-white">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1 truncate">{user.username}</span>
                    <Badge variant="secondary" className="text-xs">
                      Expert
                    </Badge>
                    {onStartPrivateChat && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => onStartPrivateChat(user.userId, user.username)}
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Farmers */}
          {farmers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Farmers ({farmers.length})
              </h4>
              <div className="space-y-2">
                {farmers.map((user) => (
                  <div key={user.userId} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1 truncate">{user.username}</span>
                    {onStartPrivateChat && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => onStartPrivateChat(user.userId, user.username)}
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {users.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No users online
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
