import { Student } from "./queryParser";
import studentsData from "@/data/students.json";
import { supabase } from "@/integrations/supabase/client";

export const getStoredStudents = async (): Promise<Student[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error);
      return [];
    }

    return (data || []).map(student => ({
      id: Number(student.id),
      name: student.name,
      department: student.department,
      cgpa: Number(student.cgpa),
      attendance: Number(student.attendance),
      dateOfBirth: student.date_of_birth,
      email: student.email
    }));
  } catch (error) {
    console.error("Error reading students from database:", error);
    return [];
  }
};

export const saveStudents = async (students: Student[]): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    await supabase
      .from("students")
      .delete()
      .eq("user_id", user.id);

    if (students.length === 0) return;

    const studentsToInsert = students.map(student => ({
      id: student.id,
      user_id: user.id,
      name: student.name,
      department: student.department,
      cgpa: student.cgpa,
      attendance: student.attendance,
      date_of_birth: student.dateOfBirth,
      email: student.email
    }));

    const { error } = await supabase
      .from("students")
      .insert(studentsToInsert);

    if (error) {
      console.error("Error saving students:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error saving students to database:", error);
    throw error;
  }
};

export const addStudent = async (student: Student): Promise<Student[]> => {
  const students = await getStoredStudents();
  const updatedStudents = [...students, student];
  await saveStudents(updatedStudents);
  return updatedStudents;
};

export const deleteStudent = async (id: number): Promise<Student[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting student:", error);
      throw error;
    }

    return await getStoredStudents();
  } catch (error) {
    console.error("Error deleting student from database:", error);
    throw error;
  }
};

export const resetStudents = async (): Promise<Student[]> => {
  const defaultStudents = studentsData as Student[];
  await saveStudents(defaultStudents);
  return defaultStudents;
};
