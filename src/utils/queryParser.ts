import { getStoredStudents } from "./studentStorage";

export interface Student {
  id: number;
  name: string;
  department: string;
  cgpa: number;
  attendance: number;
  dateOfBirth: string;
  email: string;
}

export interface QueryResult {
  type: "single" | "multiple" | "error";
  message?: string;
  data?: Student | Student[];
  chartData?: any;
  error?: string;
}

export const processQuery = (query: string): QueryResult => {
  const students = getStoredStudents();
  const lowerQuery = query.toLowerCase().trim();

  // Error handling for empty queries
  if (!lowerQuery) {
    return {
      type: "error",
      error: "Please enter a query to continue.",
    };
  }

  try {
    // Extract department if mentioned
    const deptMatch = lowerQuery.match(/\b(cse|ece|mech|it)\b/i);
    const department = deptMatch ? deptMatch[1].toUpperCase() : null;

    // Filter by department if specified
    const filteredStudents = department
      ? students.filter((s) => s.department === department)
      : students;

    if (filteredStudents.length === 0) {
      return {
        type: "error",
        error: `No students found in ${department} department.`,
      };
    }

    // HIGHEST CGPA
    if (lowerQuery.includes("highest") && (lowerQuery.includes("cgpa") || lowerQuery.includes("mark"))) {
      const topStudent = filteredStudents.reduce((a, b) =>
        a.cgpa > b.cgpa ? a : b
      );
      return {
        type: "single",
        message: `🏆 Top student${department ? ` in ${department}` : ""}: ${topStudent.name} with ${topStudent.cgpa} CGPA`,
        data: topStudent,
      };
    }

    // LOWEST CGPA
    if (lowerQuery.includes("lowest") && (lowerQuery.includes("cgpa") || lowerQuery.includes("mark"))) {
      const bottomStudent = filteredStudents.reduce((a, b) =>
        a.cgpa < b.cgpa ? a : b
      );
      return {
        type: "single",
        message: `📉 Lowest scoring student${department ? ` in ${department}` : ""}: ${bottomStudent.name} with ${bottomStudent.cgpa} CGPA`,
        data: bottomStudent,
      };
    }

    // AVERAGE CGPA
    if (lowerQuery.includes("average") && (lowerQuery.includes("cgpa") || lowerQuery.includes("mark"))) {
      const avgCgpa = (
        filteredStudents.reduce((sum, s) => sum + s.cgpa, 0) /
        filteredStudents.length
      ).toFixed(2);
      return {
        type: "single",
        message: `📊 Average CGPA${department ? ` in ${department}` : ""}: ${avgCgpa}`,
      };
    }

    // HIGHEST ATTENDANCE
    if (lowerQuery.includes("highest") && lowerQuery.includes("attendance")) {
      const topStudent = filteredStudents.reduce((a, b) =>
        a.attendance > b.attendance ? a : b
      );
      return {
        type: "single",
        message: `✅ Best attendance${department ? ` in ${department}` : ""}: ${topStudent.name} with ${topStudent.attendance}%`,
        data: topStudent,
      };
    }

    // LOWEST ATTENDANCE
    if (lowerQuery.includes("lowest") && lowerQuery.includes("attendance")) {
      const bottomStudent = filteredStudents.reduce((a, b) =>
        a.attendance < b.attendance ? a : b
      );
      return {
        type: "single",
        message: `⚠️ Lowest attendance${department ? ` in ${department}` : ""}: ${bottomStudent.name} with ${bottomStudent.attendance}%`,
        data: bottomStudent,
      };
    }

    // AVERAGE ATTENDANCE
    if (
      lowerQuery.includes("average") &&
      lowerQuery.includes("attendance")
    ) {
      const avgAttendance = (
        filteredStudents.reduce((sum, s) => sum + s.attendance, 0) /
        filteredStudents.length
      ).toFixed(2);
      return {
        type: "single",
        message: `📊 Average attendance${department ? ` in ${department}` : ""}: ${avgAttendance}%`,
      };
    }

    // BELOW threshold (cgpa or attendance)
    const belowMatch = lowerQuery.match(/below\s+(\d+\.?\d*)/);
    if (belowMatch) {
      const threshold = parseFloat(belowMatch[1]);
      const field = lowerQuery.includes("attendance") ? "attendance" : "cgpa";
      const belowStudents = filteredStudents.filter(
        (s) => s[field] < threshold
      );

      if (belowStudents.length === 0) {
        return {
          type: "error",
          error: `No students found with ${field} below ${threshold}.`,
        };
      }

      return {
        type: "multiple",
        message: `Found ${belowStudents.length} student(s) with ${field} below ${threshold}`,
        data: belowStudents,
      };
    }

    // ABOVE threshold
    const aboveMatch = lowerQuery.match(/above\s+(\d+\.?\d*)/);
    if (aboveMatch) {
      const threshold = parseFloat(aboveMatch[1]);
      const field = lowerQuery.includes("attendance") ? "attendance" : "cgpa";
      const aboveStudents = filteredStudents.filter(
        (s) => s[field] > threshold
      );

      if (aboveStudents.length === 0) {
        return {
          type: "error",
          error: `No students found with ${field} above ${threshold}.`,
        };
      }

      return {
        type: "multiple",
        message: `Found ${aboveStudents.length} student(s) with ${field} above ${threshold}`,
        data: aboveStudents,
      };
    }

    // LIST students (by department or all)
    if (lowerQuery.includes("list") || lowerQuery.includes("show all")) {
      return {
        type: "multiple",
        message: `${department ? `Students in ${department}` : "All students"} (${filteredStudents.length} total)`,
        data: filteredStudents,
      };
    }

    // DEPARTMENT COMPARISON (chart data)
    if (
      lowerQuery.includes("compare") ||
      lowerQuery.includes("department")
    ) {
      const allStudents = getStoredStudents();
      const deptStats = allStudents.reduce((acc: any, student) => {
        if (!acc[student.department]) {
          acc[student.department] = {
            department: student.department,
            totalCgpa: 0,
            totalAttendance: 0,
            count: 0,
          };
        }
        acc[student.department].totalCgpa += student.cgpa;
        acc[student.department].totalAttendance += student.attendance;
        acc[student.department].count += 1;
        return acc;
      }, {});

      const chartData = Object.values(deptStats).map((dept: any) => ({
        department: dept.department,
        avgCgpa: (dept.totalCgpa / dept.count).toFixed(2),
        avgAttendance: Math.round(dept.totalAttendance / dept.count),
      }));

      return {
        type: "multiple",
        message: "Department-wise comparison",
        chartData,
      };
    }

    // Default: return all students
    return {
      type: "multiple",
      message: "Here are all the students in the database:",
      data: getStoredStudents(),
    };
  } catch (error) {
    return {
      type: "error",
      error: "Something went wrong processing your query. Please try again.",
    };
  }
};

export const getRecentQueries = (): string[] => {
  const stored = localStorage.getItem("recentQueries");
  return stored ? JSON.parse(stored) : [];
};

export const saveQuery = (query: string) => {
  const recent = getRecentQueries();
  const updated = [query, ...recent.filter((q) => q !== query)].slice(0, 5);
  localStorage.setItem("recentQueries", JSON.stringify(updated));
};
