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
import { Upload } from "lucide-react";
import { Student } from "@/utils/queryParser";
import { toast } from "@/hooks/use-toast";

interface ImportDataDialogProps {
  onImportData: (students: Student[]) => void;
}

const ImportDataDialog = ({ onImportData }: ImportDataDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const validateStudent = (student: any): student is Student => {
    return (
      typeof student.name === "string" &&
      typeof student.department === "string" &&
      typeof student.cgpa === "number" &&
      typeof student.attendance === "number" &&
      typeof student.dateOfBirth === "string" &&
      typeof student.email === "string"
    );
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      let data: any;

      if (file.name.endsWith(".json")) {
        data = JSON.parse(text);
      } else if (file.name.endsWith(".csv")) {
        // Parse CSV
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim());
        
        data = lines.slice(1).map((line, index) => {
          const values = line.split(",").map((v) => v.trim());
          const student: any = { id: Date.now() + index };
          
          headers.forEach((header, i) => {
            const value = values[i];
            if (header === "cgpa" || header === "attendance") {
              student[header] = parseFloat(value);
            } else if (header === "id") {
              student[header] = parseInt(value) || Date.now() + index;
            } else {
              student[header] = value;
            }
          });
          
          return student;
        });
      } else {
        throw new Error("Unsupported file format. Please use JSON or CSV.");
      }

      // Validate data
      if (!Array.isArray(data)) {
        throw new Error("File must contain an array of students.");
      }

      const validStudents = data.filter((student, index) => {
        if (!validateStudent(student)) {
          console.warn(`Invalid student at index ${index}:`, student);
          return false;
        }
        return true;
      });

      if (validStudents.length === 0) {
        throw new Error("No valid student records found in the file.");
      }

      onImportData(validStudents);
      toast({
        title: "Success! 🎉",
        description: `Imported ${validStudents.length} student record(s)`,
      });

      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Import Error",
        description: error.message || "Failed to import file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-primary/30 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl glow-text">Import Student Data</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a JSON or CSV file with student records. File should include: name, department, cgpa, attendance, dateOfBirth, and email.
          </DialogDescription>
        </DialogHeader>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-primary/30 hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button type="button" asChild variant="outline">
              <span>Choose File</span>
            </Button>
          </label>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataDialog;
