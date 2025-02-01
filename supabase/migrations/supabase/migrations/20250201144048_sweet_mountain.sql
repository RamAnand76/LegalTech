/*
  # Create corruption reports table

  1. New Tables
    - `corruption_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `severity` (enum: High, Medium, Low)
      - `status` (enum: Pending Review, Under Investigation, Resolved)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `corruption_reports` table
    - Add policies for authenticated users to:
      - Create their own reports
      - Read their own reports
      - Update their own reports
*/

-- Create enum types
CREATE TYPE report_severity AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE report_status AS ENUM ('Pending Review', 'Under Investigation', 'Resolved');

-- Create corruption_reports table
CREATE TABLE IF NOT EXISTS corruption_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  severity report_severity NOT NULL,
  status report_status DEFAULT 'Pending Review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE corruption_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reports"
  ON corruption_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports"
  ON corruption_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON corruption_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_corruption_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER corruption_reports_updated_at
  BEFORE UPDATE ON corruption_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_corruption_reports_updated_at();