/*
  # Add initial bidders and unique constraint

  1. Schema Changes
    - Add unique constraint on company_id
  
  2. Data Migration
    - Insert initial bidder data
    - Each bidder gets their company information
    - All milestone fields start as not completed
*/

-- First add unique constraint on company_id
ALTER TABLE timelines ADD CONSTRAINT timelines_company_id_key UNIQUE (company_id);

-- Then insert the data
INSERT INTO timelines (
  company_id,
  company_name,
  nda_received_completed,
  nda_signed_completed,
  rfi_sent_completed,
  rfi_due_completed,
  offer_received_completed
)
VALUES
  ('1', 'Accenture', false, false, false, false, false),
  ('2', 'Atos', false, false, false, false, false),
  ('3', 'BCG', false, false, false, false, false),
  ('4', 'Cognizant', false, false, false, false, false),
  ('5', 'Dell', false, false, false, false, false),
  ('6', 'Delloitte', false, false, false, false, false),
  ('7', 'Digitas', false, false, false, false, false),
  ('8', 'Diversified', false, false, false, false, false),
  ('9', 'EY', false, false, false, false, false),
  ('10', 'GlobalLogic', false, false, false, false, false),
  ('11', 'GlobeCast', false, false, false, false, false),
  ('12', 'IBM', false, false, false, false, false),
  ('13', 'InfoSys', false, false, false, false, false),
  ('14', 'KPMG', false, false, false, false, false),
  ('15', 'Mckinsey', false, false, false, false, false),
  ('16', 'Mejdi Elkhater', false, false, false, false, false),
  ('17', 'NEP', false, false, false, false, false),
  ('18', 'PWC', false, false, false, false, false),
  ('19', 'Qvest', false, false, false, false, false),
  ('20', 'SoftServe', false, false, false, false, false),
  ('21', 'SouthWorks', false, false, false, false, false),
  ('22', 'TenX', false, false, false, false, false),
  ('23', 'Valtech', false, false, false, false, false),
  ('24', 'Whyfive', false, false, false, false, false)
ON CONFLICT (company_id) DO NOTHING;