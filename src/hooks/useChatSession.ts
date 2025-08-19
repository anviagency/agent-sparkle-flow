import { useState, useCallback } from "react";
import { ChatMessage } from "@/components/ChatSession";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://uanvi.app.n8n.cloud/webhook/chat";

export const useChatSession = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const { toast } = useToast();

  const addUserMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      content,
      type: "user",
      status: "completed",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addAssistantMessage = useCallback((content: string = "") => {
    const newMessage: ChatMessage = {
      id: `assistant-${crypto.randomUUID()}`,
      content,
      type: "assistant",
      status: "processing",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: ChatMessage["status"], content?: string) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, status, ...(content !== undefined && { content }) }
        : message
    ));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      addUserMessage(content);
      
      // Add placeholder assistant message
      const assistantMessage = addAssistantMessage("Processing your request...");

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          sessionId: sessionId,
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
      
      // Update assistant message with response
      updateMessageStatus(
        assistantMessage.id, 
        "completed", 
        result.response || result.message || "I received your message but couldn't generate a response."
      );
      
      toast({
        title: "Message Sent",
        description: "AI has responded to your message.",
      });

    } catch (error) {
      console.error("Chat error:", error);
      
      // Find the last assistant message and update it with error
      setMessages(prev => {
        let lastAssistantIndex = -1;
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].type === "assistant") {
            lastAssistantIndex = i;
            break;
          }
        }
        
        if (lastAssistantIndex !== -1) {
          const updated = [...prev];
          updated[lastAssistantIndex] = {
            ...updated[lastAssistantIndex],
            status: "completed",
            content: "Sorry, I encountered an error processing your message. Please try again."
          };
          return updated;
        }
        return prev;
      });
      
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Workflow could not be started")) {
          errorMessage = "N8N Workflow error: Please check your webhook configuration.";
        } else if (error.message.includes("Webhook node not correctly configured")) {
          errorMessage = "N8N Configuration error: Check webhook response settings.";
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
  }, [sessionId, addUserMessage, addAssistantMessage, updateMessageStatus, toast]);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
  };
};