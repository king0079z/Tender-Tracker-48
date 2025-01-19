/*
  # Create timelines table

  1. New Tables
    - `timelines`
      - `id` (uuid, primary key)
      - `company_id` (text, required)
      - `company_name` (text, required)
      - `nda_received_date` (timestamptz)
      - `nda_received_completed` (boolean)
      - `nda_signed_date` (timestamptz)
      - `nda_signed_completed` (boolean)
      - `rfi_sent_date` (timestamptz)
      - `rfi_sent_completed` (boolean)
      - `rfi_due_date` (timestamptz)
      - `rfi_due_completed` (boolean)
      - `offer_received_date` (timestamptz)
      - `offer_received_completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `timelines` table
    - Add policies for authenticated users to read and update timelines
*/

CREATE TABLE IF NOT EXISTS timelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL,
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

ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read timelines"
  ON timelines
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update timelines"
  ON timelines
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert timelines"
  ON timelines
  FOR INSERT
  TO authenticated
  WITH CHECK (true);