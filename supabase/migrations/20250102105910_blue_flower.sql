/*
  # Add email communication tables

  1. New Tables
    - `communications` - Stores email communications
      - `id` (uuid, primary key)
      - `company_id` (text, references timelines)
      - `subject` (text)
      - `content` (text)
      - `sent_date` (timestamptz)
      - `created_by` (text)
      - `created_at` (timestamptz)
    
    - `communication_responses` - Stores responses to communications
      - `id` (uuid, primary key)
      - `communication_id` (uuid, references communications)
      - `response` (text)
      - `responder_name` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS communication_responses;
DROP TABLE IF EXISTS communications;

-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES timelines(company_id),
  subject text NOT NULL,
  content text NOT NULL,
  sent_date timestamptz NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create communication responses table
CREATE TABLE IF NOT EXISTS communication_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id uuid NOT NULL REFERENCES communications(id),
  response text NOT NULL,
  responder_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_responses ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "communications_select_policy" 
  ON communications FOR SELECT TO authenticated USING (true);

CREATE POLICY "communications_insert_policy"
  ON communications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "communication_responses_select_policy"
  ON communication_responses FOR SELECT TO authenticated USING (true);

CREATE POLICY "communication_responses_insert_policy"
  ON communication_responses FOR INSERT TO authenticated WITH CHECK (true);