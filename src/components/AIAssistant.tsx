import { Sparkles } from "lucide-react";

interface AIAssistantProps {
  isThinking?: boolean;
}

const AIAssistant = ({ isThinking = false }: AIAssistantProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ${
            isThinking ? "animate-pulse-glow" : ""
          }`}
          style={{
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        {isThinking && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="flex gap-1 items-center">
              <span className="text-sm text-muted-foreground">Analyzing</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
