const XLSX = require('xlsx');

function formatRegistrationRecords(records) {
  return records.map(rec => ({
    'Registration ID': rec.registrationId,
    'Full Name': rec.fullName,
    'University Roll Number': rec.rollNumber,
    'College Email': rec.collegeEmail,
    'Phone Number': rec.phoneNumber,
    'Branch': rec.branch,
    'Interest Areas': Array.isArray(rec.interests) ? rec.interests.join(', ') : '',
    'Technical Knowledge Rating': rec.technicalRating,
    'Why Do You Want To Join DSDL': rec.whyJoin,
    'WhatsApp Group Joined': rec.whatsappConfirmedByUser ? 'Yes' : 'No',
    'Application Status': rec.status,
    'Registration Date': rec.createdAt ? new Date(rec.createdAt).toLocaleString('en-IN') : ''
  }));
}

function generateExcelBuffer(records) {
  const data = formatRegistrationRecords(records);
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const colWidths = [
    { wch: 18 }, // Reg ID
    { wch: 22 }, // Name
    { wch: 18 }, // Roll
    { wch: 28 }, // Email
    { wch: 15 }, // Phone
    { wch: 12 }, // Branch
    { wch: 35 }, // Interests
    { wch: 10 }, // Rating
    { wch: 50 }, // Why DSDL
    { wch: 12 }, // WhatsApp
    { wch: 14 }, // Status
    { wch: 22 }  // Date
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

function generateCsvBuffer(records) {
  const data = formatRegistrationRecords(records);
  const worksheet = XLSX.utils.json_to_sheet(data);
  return XLSX.utils.sheet_to_csv(worksheet);
}

module.exports = {
  generateExcelBuffer,
  generateCsvBuffer
};
