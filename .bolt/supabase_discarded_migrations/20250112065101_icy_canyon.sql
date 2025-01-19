/*
  # Add Meetings Support

  1. New Tables
    - `meetings`
      - `id` (uuid, primary key)
      - `company_id` (text, references timelines)
      - `meeting_date` (timestamptz)
      - `subject` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `meeting_attendees`
      - `id` (uuid, primary key)
      - `meeting_id` (uuid, references meetings)
      - `name` (text)
      - `email` (text)
      - `role` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES timelines(company_id) ON DELETE CASCADE,
  meeting_date timestamptz NOT NULL,
  subject text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_meetings_company_id ON meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting ON meeting_attendees(meeting_id);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;

-- Add policies for meetings
CREATE POLICY "meetings_read_policy" 
  ON meetings FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "meetings_insert_policy"
  ON meetings FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY "meetings_update_policy"
  ON meetings FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add policies for attendees
CREATE POLICY "attendees_read_policy"
  ON meeting_attendees FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "attendees_insert_policy"
  ON meeting_attendees FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Add updated_at trigger for meetings
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();