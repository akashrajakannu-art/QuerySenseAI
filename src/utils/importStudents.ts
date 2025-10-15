import { Student } from "./queryParser";
import { saveStudents, getStoredStudents } from "./studentStorage";

export const importStudentsFromFile = (students: Student[]): void => {
  const existingStudents = getStoredStudents();
  
  // Merge imported students with existing ones, avoiding duplicates by ID
  const existingIds = new Set(existingStudents.map(s => s.id));
  const newStudents = students.filter(s => !existingIds.has(s.id));
  
  const updatedStudents = [...existingStudents, ...newStudents];
  saveStudents(updatedStudents);
};

export const replaceAllStudents = (students: Student[]): void => {
  saveStudents(students);
};
