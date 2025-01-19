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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read communications" ON communications;
DROP POLICY IF EXISTS "Allow authenticated users to insert communications" ON communications;
DROP POLICY IF EXISTS "Allow authenticated users to read responses" ON communication_responses;
DROP POLICY IF EXISTS "Allow authenticated users to insert responses" ON communication_responses;

-- Recreate policies
CREATE POLICY "Allow authenticated users to read communications"
  ON communications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert communications"
  ON communications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read responses"
  ON communication_responses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert responses"
  ON communication_responses FOR INSERT TO authenticated WITH CHECK (true);