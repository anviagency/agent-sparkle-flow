import { useState, useCallback } from "react";
import { Task } from "@/components/TaskList";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://uanvi.app.n8n.cloud/webhook/chat";

export const useWebhookIntegration = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTask = useCallback((content: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      content,
      status: "pending",
      timestamp: new Date(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: Task["status"], response?: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, response }
        : task
    ));
  }, []);

  const sendToWebhook = useCallback(async (task: Task) => {
    try {
      setIsLoading(true);
      updateTaskStatus(task.id, "processing");

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: task.content,
          sessionId: `session-${Date.now()}`, // נדרש עבור chat trigger
          taskId: task.id,
          timestamp: task.timestamp.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        console.error("Webhook error response:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      updateTaskStatus(task.id, "completed", result.response || result.message || "Task completed successfully");
      
      toast({
        title: "Task Completed",
        description: "Your AI agent has processed the task successfully.",
      });

    } catch (error) {
      console.error("Webhook error:", error);
      updateTaskStatus(task.id, "pending");
      
      let errorMessage = "Failed to process task. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Workflow could not be started")) {
          errorMessage = "N8N Workflow error: Please check your webhook configuration in N8N.";
        } else if (error.message.includes("Webhook node not correctly configured")) {
          errorMessage = "N8N Configuration error: Set webhook to 'Respond to Webhook Node' mode.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateTaskStatus, toast]);

  const submitTask = useCallback(async (content: string) => {
    const task = addTask(content);
    await sendToWebhook(task);
  }, [addTask, sendToWebhook]);

  return {
    tasks,
    isLoading,
    submitTask,
  };
};