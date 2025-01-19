/*
  # Add Email Communications Tables

  1. New Tables
    - `communications`
      - `id` (uuid, primary key)
      - `company_id` (text, references timelines)
      - `subject` (text)
      - `content` (text)
      - `sent_date` (timestamptz)
      - `created_by` (text)
      - `created_at` (timestamptz)
    
    - `communication_responses`
      - `id` (uuid, primary key)
      - `communication_id` (uuid, references communications)
      - `response` (text)
      - `responder_name` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES timelines(company_id),
  subject text NOT NULL,
  content text NOT NULL,
  sent_date timestamptz NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Communication responses table
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

-- Policies for communications
CREATE POLICY "Allow authenticated users to read communications"
  ON communications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert communications"
  ON communications FOR INSERT TO authenticated WITH CHECK (true);

-- Policies for responses
CREATE POLICY "Allow authenticated users to read responses"
  ON communication_responses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert responses"
  ON communication_responses FOR INSERT TO authenticated WITH CHECK (true);