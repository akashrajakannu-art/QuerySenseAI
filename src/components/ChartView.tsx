import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartViewProps {
  data: any[];
  message?: string;
}

const ChartView = ({ data, message }: ChartViewProps) => {
  return (
    <div className="animate-slide-up space-y-4">
      {message && (
        <p className="text-lg text-center text-muted-foreground">{message}</p>
      )}

      <Card className="glass-card p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(245 20% 25%)" />
            <XAxis
              dataKey="department"
              stroke="hsl(245 10% 70%)"
              tick={{ fill: "hsl(245 10% 70%)" }}
            />
            <YAxis stroke="hsl(245 10% 70%)" tick={{ fill: "hsl(245 10% 70%)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(245 20% 12%)",
                border: "1px solid hsl(245 20% 25%)",
                borderRadius: "0.5rem",
                color: "hsl(0 0% 100%)",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "hsl(245 10% 70%)",
              }}
            />
            <Bar
              dataKey="avgMarks"
              fill="hsl(245 100% 70%)"
              name="Average Marks"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="avgAttendance"
              fill="hsl(194 100% 50%)"
              name="Average Attendance"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ChartView;
