import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartViewProps {
  data: any[];
  message?: string;
}

const COLORS = ['hsl(245 100% 70%)', 'hsl(194 100% 50%)', 'hsl(280 100% 70%)', 'hsl(168 100% 50%)'];

const ChartView = ({ data, message }: ChartViewProps) => {
  const hasMultipleMetrics = data.length > 0 && (data[0].avgCgpa !== undefined && data[0].avgAttendance !== undefined);

  return (
    <div className="animate-slide-up space-y-4">
      {message && (
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <p className="text-base sm:text-lg text-center text-muted-foreground">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card className="glass-card p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-base sm:text-lg">Bar Chart Comparison</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(245 20% 25%)" />
              <XAxis
                dataKey="department"
                stroke="hsl(245 10% 70%)"
                tick={{ fill: "hsl(245 10% 70%)", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="hsl(245 10% 70%)" 
                tick={{ fill: "hsl(245 10% 70%)", fontSize: 12 }} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(245 20% 12%)",
                  border: "1px solid hsl(245 20% 25%)",
                  borderRadius: "0.5rem",
                  color: "hsl(0 0% 100%)",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "hsl(245 10% 70%)",
                  fontSize: "12px",
                }}
              />
              {hasMultipleMetrics && (
                <>
                  <Bar
                    dataKey="avgCgpa"
                    fill="hsl(245 100% 70%)"
                    name="Average CGPA"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="avgAttendance"
                    fill="hsl(194 100% 50%)"
                    name="Average Attendance"
                    radius={[8, 8, 0, 0]}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart */}
        <Card className="glass-card p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-base sm:text-lg">Trend Analysis</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(245 20% 25%)" />
              <XAxis
                dataKey="department"
                stroke="hsl(245 10% 70%)"
                tick={{ fill: "hsl(245 10% 70%)", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="hsl(245 10% 70%)" 
                tick={{ fill: "hsl(245 10% 70%)", fontSize: 12 }} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(245 20% 12%)",
                  border: "1px solid hsl(245 20% 25%)",
                  borderRadius: "0.5rem",
                  color: "hsl(0 0% 100%)",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "hsl(245 10% 70%)",
                  fontSize: "12px",
                }}
              />
              {hasMultipleMetrics && (
                <>
                  <Line
                    type="monotone"
                    dataKey="avgCgpa"
                    stroke="hsl(245 100% 70%)"
                    strokeWidth={2}
                    name="Average CGPA"
                    dot={{ fill: "hsl(245 100% 70%)", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgAttendance"
                    stroke="hsl(194 100% 50%)"
                    strokeWidth={2}
                    name="Average Attendance"
                    dot={{ fill: "hsl(194 100% 50%)", r: 4 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ChartView;
