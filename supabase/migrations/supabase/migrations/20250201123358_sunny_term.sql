/*
  # Contract Review System Schema

  1. New Tables
    - `contracts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_name` (text)
      - `file_path` (text)
      - `file_type` (text)
      - `file_size` (integer)
      - `status` (enum: 'pending', 'in_review', 'completed')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contract_reviews`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, references contracts)
      - `summary` (text)
      - `risk_level` (enum: 'low', 'medium', 'high')
      - `recommendations` (text[])
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own contracts
    - Add policies for reading review data
*/

-- Create enum types
CREATE TYPE contract_status AS ENUM ('pending', 'in_review', 'completed');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  status contract_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT file_size_check CHECK (file_size <= 7000000) -- 7MB limit
);

-- Create contract_reviews table
CREATE TABLE IF NOT EXISTS contract_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) ON DELETE CASCADE,
  summary text NOT NULL,
  risk_level risk_level NOT NULL,
  recommendations text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for contracts table
CREATE POLICY "Users can view their own contracts"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts"
  ON contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
  ON contracts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for contract_reviews table
CREATE POLICY "Users can view reviews for their contracts"
  ON contract_reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = contract_reviews.contract_id
      AND contracts.user_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();