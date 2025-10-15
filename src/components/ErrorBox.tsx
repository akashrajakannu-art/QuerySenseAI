import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ErrorBoxProps {
  message: string;
}

const ErrorBox = ({ message }: ErrorBoxProps) => {
  return (
    <div className="animate-slide-up">
      <Card className="glass-card p-6 border-destructive/50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-destructive/20">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-destructive mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-4">
              💡 Try asking questions like:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>"Who has the highest marks?"</li>
                <li>"Average attendance in CSE"</li>
                <li>"Show students above 85 marks"</li>
                <li>"List all students in IT"</li>
              </ul>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorBox;
