/*
  # Azure Database Migration Script
  
  1. Tables
    - timelines
    - meetings
    - meeting_attendees
    - communications
    - communication_responses
  
  2. Indexes and Constraints
    - Primary keys
    - Foreign keys
    - Indexes for performance
*/

-- Create timelines table
CREATE TABLE IF NOT EXISTS timelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text UNIQUE NOT NULL,
  company_name text NOT NULL,
  nda_received_date timestamptz,
  nda_received_completed boolean DEFAULT false,
  nda_signed_date timestamptz,
  nda_signed_completed boolean DEFAULT false,
  rfi_sent_date timestamptz,
  rfi_sent_completed boolean DEFAULT false,
  rfi_due_date timestamptz,
  rfi_due_completed boolean DEFAULT false,
  offer_received_date timestamptz,
  offer_received_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES timelines(company_id) ON DELETE CASCADE,
  meeting_date timestamptz NOT NULL,
  subject text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create meeting attendees table
CREATE TABLE IF NOT EXISTS meeting_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  role text,
  created_at timestamptz DEFAULT now()
);

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_timelines_company_id ON timelines(company_id);
CREATE INDEX IF NOT EXISTS idx_meetings_company_id ON meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_attendees_meeting ON meeting_attendees(meeting_id);
CREATE INDEX IF NOT EXISTS idx_communications_company ON communications(company_id);
CREATE INDEX IF NOT EXISTS idx_communications_date ON communications(sent_date);
CREATE INDEX IF NOT EXISTS idx_responses_communication ON communication_responses(communication_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_timelines_updated_at
  BEFORE UPDATE ON timelines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON communications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE ON communication_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();