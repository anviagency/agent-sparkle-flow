import { AgentHeader } from "@/components/AgentHeader";
import { AgentInput } from "@/components/AgentInput";
import { ChatSession } from "@/components/ChatSession";
import { useChatSession } from "@/hooks/useChatSession";

const Index = () => {
  const { messages, isLoading, sendMessage, sessionId } = useChatSession();

  return (
    <div className="min-h-screen bg-gradient-background">
      <AgentHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <h1 className="text-4xl md:text-6xl font-bold">
              Everything{" "}
              <span className="italic bg-gradient-primary bg-clip-text text-transparent">
                is
              </span>
              <br />
              possible with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed to the last pixel and engineered with unforgiving
              precision. Your AI agent combines UI elegance with world-class
              AI performance.
            </p>
          </div>

          {/* Input Section */}
          <div className="flex justify-center">
            <AgentInput onSubmitTask={sendMessage} isLoading={isLoading} />
          </div>

          {/* Chat Session */}
          <div className="mt-12">
            <ChatSession messages={messages} />
          </div>

          {/* Session Info */}
          {messages.length > 0 && (
            <div className="text-center text-xs text-muted-foreground mt-8">
              Session ID: {sessionId}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
