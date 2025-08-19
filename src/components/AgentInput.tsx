import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentInputProps {
  onSubmitTask: (task: string) => void;
  isLoading?: boolean;
}

export const AgentInput = ({ onSubmitTask, isLoading = false }: AgentInputProps) => {
  const [task, setTask] = useState("");

  const handleSubmit = () => {
    if (task.trim() && !isLoading) {
      onSubmitTask(task.trim());
      setTask("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative bg-card border border-border rounded-2xl p-4 shadow-lg">
        <Textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you want to know?"
          className={cn(
            "min-h-[60px] resize-none border-0 bg-transparent",
            "text-lg placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                ⚡ Fast
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!task.trim() || isLoading}
              size="sm"
              className={cn(
                "h-8 w-8 p-0 bg-gradient-primary hover:opacity-90",
                "shadow-glow-primary transition-all duration-200",
                "disabled:opacity-50 disabled:shadow-none"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center mt-3">
        By messaging Agent, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
};