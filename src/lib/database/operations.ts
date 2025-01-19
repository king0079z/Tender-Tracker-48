import { db } from './azure';
import { CompanyTimeline } from '../../types/milestones';

export const getTimelines = async () => {
  const result = await db.query('SELECT * FROM timelines ORDER BY updated_at DESC');
  return result.rows;
};

export const updateTimeline = async (timeline: CompanyTimeline) => {
  await db.query(
    `UPDATE timelines 
     SET nda_received_date = $1,
         nda_received_completed = $2,
         nda_signed_date = $3,
         nda_signed_completed = $4,
         rfi_sent_date = $5,
         rfi_sent_completed = $6,
         rfi_due_date = $7,
         rfi_due_completed = $8,
         offer_received_date = $9,
         offer_received_completed = $10,
         updated_at = NOW()
     WHERE company_id = $11`,
    [
      timeline.ndaReceived.date,
      timeline.ndaReceived.isCompleted,
      timeline.ndaSigned.date,
      timeline.ndaSigned.isCompleted,
      timeline.rfiSent.date,
      timeline.rfiSent.isCompleted,
      timeline.rfiDue.date,
      timeline.rfiDue.isCompleted,
      timeline.offerReceived.date,
      timeline.offerReceived.isCompleted,
      timeline.companyId
    ]
  );
};