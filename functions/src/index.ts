import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { format, endOfMonth, startOfMonth } from 'date-fns';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendMonthlyReport = functions.pubsub
  .schedule('0 20 * * *') // Runs every day at 8:00 PM
  .timeZone('Europe/Berlin')
  .onRun(async (context) => {
    const now = new Date();
    const isLastDayOfMonth = endOfMonth(now).getDate() === now.getDate();

    if (!isLastDayOfMonth) {
      console.log('Not the last day of the month, skipping report generation');
      return null;
    }

    try {
      const db = admin.firestore();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      // Get all records for the current month
      const snapshot = await db.collection('checklists')
        .where('date', '>=', format(monthStart, 'yyyy-MM-dd'))
        .where('date', '<=', format(monthEnd, 'yyyy-MM-dd'))
        .get();

      if (snapshot.empty) {
        console.log('No data found for the current month');
        return null;
      }

      // Generate CSV content
      const records = snapshot.docs.map(doc => doc.data());
      const csvContent = await generateCSV(records);

      // Create email with attachment
      const monthYear = format(now, 'MMMM yyyy');
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `Melmer Stübchen - Monatsbericht ${monthYear}`,
        text: `Anbei finden Sie den Monatsbericht für ${monthYear}.`,
        attachments: [{
          filename: `melmer-stuebchen-checkliste-${format(now, 'yyyy-MM')}.csv`,
          content: csvContent,
          encoding: 'utf-8'
        }]
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log('Monthly report email sent successfully');

      // Archive current month's records
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        // Move to archive collection
        const archiveRef = db.collection('checklist_archive').doc(doc.id);
        batch.set(archiveRef, {
          ...doc.data(),
          archivedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Delete from main collection
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('Records archived successfully');

      return null;
    } catch (error) {
      console.error('Error sending monthly report:', error);
      throw error;
    }
  });

async function generateCSV(records: any[]): Promise<string> {
  // Implementation similar to your existing csvExport.ts logic
  // but adapted for server-side Node.js environment
  // ... CSV generation logic ...
  return ''; // Replace with actual CSV generation
}