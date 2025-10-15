import { Student } from "./queryParser";
import studentsData from "@/data/students.json";

const STORAGE_KEY = "querysense_students";

export const getStoredStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data if nothing stored
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsData));
    return studentsData as Student[];
  } catch (error) {
    console.error("Error reading students from storage:", error);
    return studentsData as Student[];
  }
};

export const saveStudents = (students: Student[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error("Error saving students to storage:", error);
  }
};

export const addStudent = (student: Student): Student[] => {
  const students = getStoredStudents();
  const updatedStudents = [...students, student];
  saveStudents(updatedStudents);
  return updatedStudents;
};

export const deleteStudent = (id: number): Student[] => {
  const students = getStoredStudents();
  const updatedStudents = students.filter((s) => s.id !== id);
  saveStudents(updatedStudents);
  return updatedStudents;
};

export const resetStudents = (): Student[] => {
  const defaultStudents = studentsData as Student[];
  saveStudents(defaultStudents);
  return defaultStudents;
};
