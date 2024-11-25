import { Handler, schedule } from "@netlify/functions";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import emailjs from '@emailjs/browser';
import { format, endOfMonth, startOfMonth } from "date-fns";
import { ChecklistItem } from "../../src/types";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const handler: Handler = async (event, context) => {
  try {
    const now = new Date();
    const isLastDayOfMonth = endOfMonth(now).getDate() === now.getDate();

    if (!isLastDayOfMonth) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Not the last day of the month" }),
      };
    }

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const snapshot = await db
      .collection("checklists")
      .where("date", ">=", format(monthStart, "yyyy-MM-dd"))
      .where("date", "<=", format(monthEnd, "yyyy-MM-dd"))
      .get();

    if (snapshot.empty) {
      console.log("No data found for the current month");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No data to send" }),
      };
    }

    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChecklistItem[];

    const csvContent = generateMonthlyReport(records);
    const monthYear = format(now, "MMMM yyyy");

    await emailjs.send(
      'service_2aqxvxr',
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: 'marconibenito82@gmail.com',
        subject: `Melmer Stübchen - Monatsbericht ${monthYear}`,
        message: `Anbei finden Sie den Monatsbericht für ${monthYear}.`,
        attachment: Buffer.from(csvContent).toString('base64'),
        filename: `melmer-stuebchen-monatsbericht-${format(now, "yyyy-MM")}.csv`
      },
      '-vX-Xu0v-kys4kH1Z'
    );

    // Archive the month's data
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      const archiveRef = db.collection('checklist_archive').doc(doc.id);
      batch.set(archiveRef, {
        ...doc.data(),
        archivedAt: new Date().toISOString()
      });
      batch.delete(doc.ref);
    });
    await batch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Monthly report sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending monthly report:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send monthly report" }),
    };
  }
};

function generateMonthlyReport(records: ChecklistItem[]): string {
  // Reuse the CSV generation logic from csvExport.ts
  const sections = [
    createFoodSection(records),
    createEquipmentSection(records),
    createCleaningSection(records),
    createRevenueSection(records),
    createMonthlyTotalsSection(records)
  ].filter(Boolean);

  return '\ufeff' + sections.join('\n\n');
}

export const handler = schedule("0 20 L * *", handler);