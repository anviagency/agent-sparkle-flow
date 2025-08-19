import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Circle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  content: string;
  status: "pending" | "processing" | "completed";
  timestamp: Date;
  response?: string;
}

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No tasks yet. Send your first message above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      {tasks.map((task) => (
        <Card key={task.id} className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {task.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : task.status === "processing" ? (
                  <Circle className="h-5 w-5 text-primary animate-pulse" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={task.status === "completed" ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      task.status === "processing" && "bg-primary/10 text-primary",
                      task.status === "pending" && "bg-yellow-500/10 text-yellow-500"
                    )}
                  >
                    {task.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {task.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">{task.content}</p>
                  {task.response && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">{task.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};