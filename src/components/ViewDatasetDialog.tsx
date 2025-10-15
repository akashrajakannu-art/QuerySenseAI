import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "lucide-react";
import { Student } from "@/utils/queryParser";

interface ViewDatasetDialogProps {
  students: Student[];
}

const ViewDatasetDialog = ({ students }: ViewDatasetDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Database className="w-4 h-4" />
          View Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/30 max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl glow-text">
            Complete Student Dataset
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Viewing all {students.length} student records in the database
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border border-primary/20">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-primary/5">
                <TableHead className="text-primary font-semibold">ID</TableHead>
                <TableHead className="text-primary font-semibold">Name</TableHead>
                <TableHead className="text-primary font-semibold">Department</TableHead>
                <TableHead className="text-primary font-semibold">CGPA</TableHead>
                <TableHead className="text-primary font-semibold">Attendance</TableHead>
                <TableHead className="text-primary font-semibold">Email</TableHead>
                <TableHead className="text-primary font-semibold">Date of Birth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-border/50 hover:bg-primary/10 transition-colors"
                >
                  <TableCell className="font-mono text-sm">
                    {student.id}
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
                  <TableCell className="text-sm text-muted-foreground">
                    {student.email}
                  </TableCell>
                  <TableCell>
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDatasetDialog;
