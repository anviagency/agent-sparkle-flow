import { AgentHeader } from "@/components/AgentHeader";
import { AgentInput } from "@/components/AgentInput";
import { TaskList } from "@/components/TaskList";
import { useWebhookIntegration } from "@/hooks/useWebhookIntegration";

const Index = () => {
  const { tasks, isLoading, submitTask } = useWebhookIntegration();

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
            <AgentInput onSubmitTask={submitTask} isLoading={isLoading} />
          </div>

          {/* Tasks Section */}
          <div className="mt-12">
            <TaskList tasks={tasks} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
