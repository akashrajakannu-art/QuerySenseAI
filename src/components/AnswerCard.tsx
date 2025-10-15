import { CheckCircle2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Student } from "@/utils/queryParser";

interface AnswerCardProps {
  message: string;
  student?: Student;
}

const AnswerCard = ({ message, student }: AnswerCardProps) => {
  return (
    <div className="animate-slide-up">
      <Card className="glass-card p-6 border-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/20">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-lg text-foreground mb-4">{message}</p>
            {student && (
              <div className="glass-card p-4 space-y-2 border-secondary/30">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-semibold text-foreground">
                    {student.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-secondary">
                    {student.department}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CGPA:</span>
                  <span className="font-semibold text-accent flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {student.cgpa}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className="font-semibold text-foreground">
                    {student.attendance}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold text-foreground text-sm">
                    {student.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">DOB:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnswerCard;
