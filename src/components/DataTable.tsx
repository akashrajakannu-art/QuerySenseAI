import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/utils/queryParser";
import { Trophy, Award, Medal } from "lucide-react";

interface DataTableProps {
  students: Student[];
  message?: string;
}

const DataTable = ({ students, message }: DataTableProps) => {
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Award className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-orange-500" />;
    return null;
  };

  return (
    <div className="animate-slide-up space-y-4">
      {message && (
        <p className="text-lg text-center text-muted-foreground">{message}</p>
      )}

      <Card className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20 hover:bg-primary/5">
              <TableHead className="text-primary font-semibold">Rank</TableHead>
              <TableHead className="text-primary font-semibold">Name</TableHead>
              <TableHead className="text-primary font-semibold">
                Department
              </TableHead>
              <TableHead className="text-primary font-semibold">
                CGPA
              </TableHead>
              <TableHead className="text-primary font-semibold">
                Attendance
              </TableHead>
              <TableHead className="text-primary font-semibold">
                Email
              </TableHead>
              <TableHead className="text-primary font-semibold">
                Date of Birth
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow
                key={student.id}
                className="border-border/50 hover:bg-primary/10 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                    <span className="font-medium">#{index + 1}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                    {student.department}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-accent">
                    {student.cgpa}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${
                      student.attendance >= 90
                        ? "text-green-400"
                        : student.attendance >= 75
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {student.attendance}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {student.email}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default DataTable;
