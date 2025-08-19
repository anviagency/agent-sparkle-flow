import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Clock, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  type: "user" | "assistant";
  status: "pending" | "processing" | "completed";
  timestamp: Date;
}

interface ChatSessionProps {
  messages: ChatMessage[];
}

export const ChatSession = ({ messages }: ChatSessionProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Start a conversation with your AI agent!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-4",
            message.type === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.type === "assistant" && (
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
          
          <Card 
            className={cn(
              "border-border backdrop-blur-sm max-w-[80%]",
              message.type === "user" 
                ? "bg-gradient-primary text-primary-foreground" 
                : "bg-card/50"
            )}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {message.type === "assistant" && (
                    <div className="flex items-center gap-1">
                      {message.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : message.status === "processing" ? (
                        <Circle className="h-4 w-4 text-primary animate-pulse" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          message.status === "processing" && "bg-primary/10 text-primary",
                          message.status === "pending" && "bg-yellow-500/10 text-yellow-500"
                        )}
                      >
                        {message.status}
                      </Badge>
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs",
                  message.type === "user" 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </Card>

          {message.type === "user" && (
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};