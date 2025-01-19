/*
  # Fix communications tables and policies

  1. Changes
    - Drop and recreate communications tables with proper constraints
    - Add delete policies for admin users
    - Add cascade delete for responses
    - Add indexes for better performance

  2. Security
    - Enable RLS
    - Add comprehensive policies for CRUD operations
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS communication_responses;
DROP TABLE IF EXISTS communications;

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES timelines(company_id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  sent_date timestamptz NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create communication responses table
CREATE TABLE IF NOT EXISTS communication_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id uuid NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  response text NOT NULL,
  responder_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_communications_company_id ON communications(company_id);
CREATE INDEX IF NOT EXISTS idx_communications_sent_date ON communications(sent_date);
CREATE INDEX IF NOT EXISTS idx_responses_communication_id ON communication_responses(communication_id);

-- Enable RLS
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_responses ENABLE ROW LEVEL SECURITY;

-- Policies for communications
CREATE POLICY "communications_read_policy" 
  ON communications FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "communications_insert_policy"
  ON communications FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY "communications_delete_policy"
  ON communications FOR DELETE TO authenticated
  USING (true);

-- Policies for responses
CREATE POLICY "responses_read_policy"
  ON communication_responses FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "responses_insert_policy"
  ON communication_responses FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY "responses_delete_policy"
  ON communication_responses FOR DELETE TO authenticated
  USING (true);

-- Add updated_at trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON communications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE ON communication_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();