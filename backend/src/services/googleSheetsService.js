const { google } = require('googleapis');
const Registration = require('../models/Registration');

async function syncToGoogleSheets() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return {
      configured: false,
      message: 'Google Sheets integration is not configured. Please set GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in .env.'
    };
  }

  // Handle escaped newlines in private key
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const registrations = await Registration.find().sort({ createdAt: -1 });

    const headers = [
      'Registration ID', 'Full Name', 'Roll Number', 'College Email', 
      'Phone Number', 'Branch', 'Interests', 'Technical Rating', 
      'Why KML', 'WhatsApp Joined', 'Status', 'Date'
    ];

    const rows = registrations.map(rec => [
      rec.registrationId,
      rec.fullName,
      rec.rollNumber,
      rec.collegeEmail,
      rec.phoneNumber,
      rec.branch,
      Array.isArray(rec.interests) ? rec.interests.join(', ') : '',
      rec.technicalRating,
      rec.whyJoin,
      rec.whatsappConfirmedByUser ? 'Yes' : 'No',
      rec.status,
      rec.createdAt ? new Date(rec.createdAt).toLocaleString('en-IN') : ''
    ]);

    const values = [headers, ...rows];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });

    return {
      configured: true,
      success: true,
      syncedCount: registrations.length,
      message: `Successfully synced ${registrations.length} registrations to Google Sheets.`
    };
  } catch (error) {
    console.error('Google Sheets sync error:', error.message);
    return {
      configured: true,
      success: false,
      message: `Failed to sync to Google Sheets: ${error.message}`
    };
  }
}

module.exports = { syncToGoogleSheets };
