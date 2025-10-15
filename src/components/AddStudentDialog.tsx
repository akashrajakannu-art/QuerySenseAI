import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { Student } from "@/utils/queryParser";
import { toast } from "@/hooks/use-toast";

interface AddStudentDialogProps {
  onAddStudent: (student: Student) => void;
}

const AddStudentDialog = ({ onAddStudent }: AddStudentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    attendance: "",
    marks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter student name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.department) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }

    const attendance = parseInt(formData.attendance);
    const marks = parseInt(formData.marks);

    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      toast({
        title: "Error",
        description: "Attendance must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(marks) || marks < 0 || marks > 100) {
      toast({
        title: "Error",
        description: "Marks must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    // Generate new student ID
    const newStudent: Student = {
      id: Date.now(),
      name: formData.name.trim(),
      department: formData.department,
      attendance,
      marks,
    };

    onAddStudent(newStudent);

    toast({
      title: "Success! 🎉",
      description: `${newStudent.name} has been added successfully`,
    });

    // Reset form
    setFormData({
      name: "",
      department: "",
      attendance: "",
      marks: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-opacity"
          style={{
            boxShadow: "var(--shadow-glow-secondary)",
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/30 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl glow-text">Add New Student</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the student details below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="glass-card border-primary/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger className="glass-card border-primary/30">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="glass-card border-primary/30">
                  <SelectItem value="CSE">Computer Science (CSE)</SelectItem>
                  <SelectItem value="ECE">
                    Electronics & Communication (ECE)
                  </SelectItem>
                  <SelectItem value="MECH">Mechanical (MECH)</SelectItem>
                  <SelectItem value="IT">Information Technology (IT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="marks">Marks (0-100)</Label>
              <Input
                id="marks"
                type="number"
                placeholder="Enter marks"
                min="0"
                max="100"
                value={formData.marks}
                onChange={(e) =>
                  setFormData({ ...formData, marks: e.target.value })
                }
                className="glass-card border-primary/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attendance">Attendance % (0-100)</Label>
              <Input
                id="attendance"
                type="number"
                placeholder="Enter attendance percentage"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={(e) =>
                  setFormData({ ...formData, attendance: e.target.value })
                }
                className="glass-card border-primary/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="glass-card border-primary/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Add Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
