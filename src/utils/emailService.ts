import emailjs from '@emailjs/browser';
import { format } from 'date-fns';

export async function sendMonthlyReport(csvContent: string) {
  try {
    const monthYear = format(new Date(), 'MMMM yyyy');
    const templateParams = {
      to_email: process.env.RECIPIENT_EMAIL,
      subject: `Melmer Stübchen - Monatsbericht ${monthYear}`,
      message: `Anbei finden Sie den Monatsbericht für ${monthYear}.`,
      attachment: csvContent,
    };

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.EMAILJS_PUBLIC_KEY
    );

    console.log('Monthly report sent successfully');
  } catch (error) {
    console.error('Error sending monthly report:', error);
    throw new Error('Failed to send monthly report');
  }
}