import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Database, Edit, Save, X, Trash2, Plus } from "lucide-react";
import { Student } from "@/utils/queryParser";
import { saveStudents, getStoredStudents } from "@/utils/studentStorage";
import { toast } from "@/hooks/use-toast";

interface ViewDatasetDialogProps {
  onDataChange?: () => void;
}

const ViewDatasetDialog = ({ onDataChange }: ViewDatasetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadStudents();
    }
  }, [open]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getStoredStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedStudents(JSON.parse(JSON.stringify(students)));
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditingId(null);
    setEditedStudents([]);
  };

  const handleSave = async () => {
    try {
      await saveStudents(editedStudents);
      setStudents(editedStudents);
      setEditMode(false);
      setEditingId(null);
      onDataChange?.();
      toast({
        title: "Changes saved",
        description: `Successfully updated ${editedStudents.length} student records.`,
      });
    } catch (error) {
      console.error("Error saving students:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = (id: number, field: keyof Student, value: string | number) => {
    setEditedStudents(prev =>
      prev.map(student =>
        student.id === id
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  const handleDelete = (id: number) => {
    setEditedStudents(prev => prev.filter(student => student.id !== id));
  };

  const handleAddNew = () => {
    const newId = Math.max(...editedStudents.map(s => s.id), 0) + 1;
    const newStudent: Student = {
      id: newId,
      name: "New Student",
      department: "CSE",
      cgpa: 0,
      attendance: 0,
      email: "student@example.com",
      dateOfBirth: new Date().toISOString().split('T')[0],
    };
    setEditedStudents(prev => [...prev, newStudent]);
    setEditingId(newId);
  };

  const displayData = editMode ? editedStudents : students;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Database className="w-4 h-4" />
          View Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/30 max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl glow-text">
                Power Query Editor
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editMode ? "Editing" : "Viewing"} {displayData.length} student records
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <Button onClick={handleEdit} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Data
                </Button>
              ) : (
                <>
                  <Button onClick={handleAddNew} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Row
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[65vh] w-full rounded-md border border-primary/20">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-primary/5">
                {editMode && <TableHead className="text-primary font-semibold w-12">Actions</TableHead>}
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
              {displayData.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-border/50 hover:bg-primary/10 transition-colors"
                >
                  {editMode && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                  <TableCell className="font-mono text-sm">
                    {student.id}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        value={student.name}
                        onChange={(e) => handleFieldChange(student.id, "name", e.target.value)}
                        className="h-8 min-w-[150px]"
                      />
                    ) : (
                      <span className="font-medium">{student.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        value={student.department}
                        onChange={(e) => handleFieldChange(student.id, "department", e.target.value)}
                        className="h-8 min-w-[100px]"
                      />
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                        {student.department}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={student.cgpa}
                        onChange={(e) => handleFieldChange(student.id, "cgpa", parseFloat(e.target.value))}
                        className="h-8 w-20"
                      />
                    ) : (
                      <span className="font-semibold text-accent">
                        {student.cgpa}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.attendance}
                        onChange={(e) => handleFieldChange(student.id, "attendance", parseInt(e.target.value))}
                        className="h-8 w-20"
                      />
                    ) : (
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
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        type="email"
                        value={student.email}
                        onChange={(e) => handleFieldChange(student.id, "email", e.target.value)}
                        className="h-8 min-w-[180px]"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {student.email}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        type="date"
                        value={student.dateOfBirth}
                        onChange={(e) => handleFieldChange(student.id, "dateOfBirth", e.target.value)}
                        className="h-8 min-w-[140px]"
                      />
                    ) : (
                      new Date(student.dateOfBirth).toLocaleDateString()
                    )}
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
