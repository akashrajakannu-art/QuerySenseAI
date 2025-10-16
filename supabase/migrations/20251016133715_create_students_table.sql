/*
  # Create Students Table

  1. New Tables
    - `students`
      - `id` (bigint, primary key) - Unique student identifier
      - `user_id` (uuid, foreign key to auth.users) - Owner of the student record
      - `name` (text) - Student full name
      - `department` (text) - Department (e.g., CSE, IT, ECE)
      - `cgpa` (numeric) - CGPA score (0-10)
      - `attendance` (numeric) - Attendance percentage (0-100)
      - `date_of_birth` (text) - Date of birth
      - `email` (text) - Student email address
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
  
  2. Security
    - Enable RLS on `students` table
    - Add policy for users to read their own student records
    - Add policy for users to insert their own student records
    - Add policy for users to update their own student records
    - Add policy for users to delete their own student records

  3. Notes
    - Each user can only access their own student records
    - Student ID is part of the imported data and must be preserved
*/

CREATE TABLE IF NOT EXISTS students (
  id bigint PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  department text NOT NULL,
  cgpa numeric NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  attendance numeric NOT NULL CHECK (attendance >= 0 AND attendance <= 100),
  date_of_birth text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own students"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own students"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own students"
  ON students FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(user_id, department);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON students(user_id, cgpa);
CREATE INDEX IF NOT EXISTS idx_students_attendance ON students(user_id, attendance);
