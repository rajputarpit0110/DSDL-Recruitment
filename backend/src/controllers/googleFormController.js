const mongoose = require('mongoose');
const XLSX = require('xlsx');
const GoogleFormRegistration = require('../models/GoogleFormRegistration');
const { generateExcelBuffer, generateCsvBuffer } = require('../services/exportService');
const { STATUS_OPTIONS } = require('../config/recruitmentConfig');

// ─── Column Name Auto-Detection ────────────────────────────────────────────────
// Maps our DB fields to possible header names in a Google Form CSV export.
// Matching is case-insensitive and trims whitespace.

const COLUMN_PATTERNS = {
  fullName:        [/full\s*name/i, /student\s*name/i, /name/i, /applicant\s*name/i],
  rollNumber:      [/roll\s*(no|num|number)?/i, /university\s*roll/i, /enrollment/i, /enroll/i, /roll/i],
  email:           [/college\s*email/i, /email/i, /e-mail/i, /mail/i],
  phone:           [/phone/i, /mobile/i, /contact/i, /whatsapp/i, /ph\.?\s*no/i],
  branch:          [/branch/i, /department/i, /stream/i, /dept/i],
  technicalRating: [/tech(nical)?\s*rating/i, /rating/i, /self\s*rating/i, /skill\s*rating/i, /rate yourself/i],
  whyJoin:         [/why\s*(join|dsdl)/i, /motivation/i, /why\s*do\s*you/i, /statement/i, /reason/i],
  interests:       [/interest/i, /domain/i, /area\s*of\s*interest/i, /technical\s*area/i, /field/i]
};

/**
 * Detect which CSV header maps to which DB field.
 * Returns { dbField: headerString } map.
 */
function detectColumnMap(headers) {
  const map = {};
  for (const [field, patterns] of Object.entries(COLUMN_PATTERNS)) {
    for (const header of headers) {
      if (patterns.some(p => p.test(header.trim()))) {
        if (!map[field]) map[field] = header; // first match wins
      }
    }
  }
  return map;
}

/**
 * Parse a row object (from XLSX) into a GoogleFormRegistration document.
 */
function parseRow(row, colMap) {
  const get = (field) => {
    const header = colMap[field];
    if (!header) return '';
    const val = row[header];
    return val !== undefined && val !== null ? String(val).trim() : '';
  };

  const fullName = get('fullName');
  const rollNumber = get('rollNumber').toUpperCase();
  if (!fullName || !rollNumber) return null; // skip rows with no name/roll

  let technicalRating = null;
  const ratingRaw = get('technicalRating');
  if (ratingRaw) {
    const num = Number(ratingRaw);
    if (!isNaN(num) && num >= 1 && num <= 5) technicalRating = Math.round(num);
  }

  // Interests can be comma-separated
  const interestsRaw = get('interests');
  const interests = interestsRaw
    ? interestsRaw.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
    : [];

  return {
    fullName,
    rollNumber,
    email: get('email').toLowerCase(),
    phone: get('phone'),
    branch: get('branch'),
    interests,
    technicalRating,
    whyJoin: get('whyJoin')
  };
}

// ─── Import Google Form Sheet ──────────────────────────────────────────────────
exports.importGoogleFormSheet = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded. Please attach a CSV or Excel file.' });
  }

  try {
    // Parse file buffer with XLSX (handles both .csv and .xlsx/.xls)
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', raw: false });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

    if (!rows || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'The uploaded file is empty or has no data rows.' });
    }

    // Detect column mapping from the first row's keys
    const headers = Object.keys(rows[0]);
    const colMap = detectColumnMap(headers);
    const detectedFields = Object.keys(colMap);

    if (!colMap.fullName && !colMap.rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Could not detect Name or Roll Number columns. Please ensure your Google Form CSV has recognizable column headers.',
        detectedHeaders: headers
      });
    }

    const importBatch = new Date().toISOString();
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const parsed = parseRow(rows[i], colMap);
      if (!parsed) { skipped++; continue; }

      try {
        const existing = await GoogleFormRegistration.findOne({ rollNumber: parsed.rollNumber });
        if (existing) {
          // Update non-status fields but preserve status & history
          await GoogleFormRegistration.updateOne(
            { rollNumber: parsed.rollNumber },
            { $set: { ...parsed, importBatch } }
          );
          updated++;
        } else {
          await GoogleFormRegistration.create({
            ...parsed,
            status: 'Registered',
            statusHistory: [],
            importBatch
          });
          imported++;
        }
      } catch (err) {
        errors.push({ row: i + 2, rollNumber: parsed.rollNumber, error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Import complete. ${imported} new, ${updated} updated, ${skipped} skipped.`,
      summary: { totalRows: rows.length, imported, updated, skipped, errors: errors.length },
      detectedColumns: detectedFields,
      errors: errors.slice(0, 20) // cap error list
    });
  } catch (error) {
    console.error('Google Form Import Error:', error);
    return res.status(500).json({ success: false, message: `Import failed: ${error.message}` });
  }
};

// ─── Get Google Form Registrations (with pagination & filters) ─────────────────
exports.getGoogleFormRegistrations = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  try {
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip  = (page - 1) * limit;

    const sortBy    = req.query.sortBy    || 'importedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = {};
    const { search, branch, rating, interest, status } = req.query;

    if (search && search.trim()) {
      const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { fullName: rx }, { rollNumber: rx }, { email: rx }, { phone: rx }
      ];
    }
    if (branch  && branch.trim())  filter.branch = branch.trim();
    if (status  && status.trim())  filter.status = status.trim();
    if (interest && interest.trim()) filter.interests = interest.trim();
    if (rating) {
      const n = Number(rating);
      if (!isNaN(n) && n >= 1 && n <= 5) filter.technicalRating = n;
    }

    const [registrations, total] = await Promise.all([
      GoogleFormRegistration.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).lean(),
      GoogleFormRegistration.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      registrations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (error) {
    console.error('GF Registrations Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch Google Form registrations.' });
  }
};

// ─── Get Single Google Form Registration ──────────────────────────────────────
exports.getGoogleFormRegistrationById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  try {
    const rec = await GoogleFormRegistration.findById(req.params.id);
    if (!rec) return res.status(404).json({ success: false, message: 'Record not found.' });
    return res.status(200).json({ success: true, registration: rec });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch record.' });
  }
};

// ─── Update Status ─────────────────────────────────────────────────────────────
exports.updateGoogleFormStatus = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  try {
    const { status } = req.body;
    if (!status || !STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status "${status}". Valid: ${STATUS_OPTIONS.join(', ')}`
      });
    }

    const rec = await GoogleFormRegistration.findById(req.params.id);
    if (!rec) return res.status(404).json({ success: false, message: 'Record not found.' });

    rec.status = status;
    rec.statusHistory.push({ status, changedAt: new Date(), changedBy: req.admin?.username || 'Admin' });
    await rec.save({ validateBeforeSave: false });

    return res.status(200).json({ success: true, message: `Status updated to ${status}`, registration: rec });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Failed to update status: ${error.message}` });
  }
};

// ─── Delete ────────────────────────────────────────────────────────────────────
exports.deleteGoogleFormRegistration = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  try {
    const rec = await GoogleFormRegistration.findByIdAndDelete(req.params.id);
    if (!rec) return res.status(404).json({ success: false, message: 'Record not found.' });
    return res.status(200).json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete record.' });
  }
};

// ─── Export ────────────────────────────────────────────────────────────────────
exports.exportGoogleFormRegistrations = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  try {
    const format = (req.query.format || 'excel').toLowerCase();
    const filter = {};
    const { search, branch, rating, interest, status } = req.query;

    if (search && search.trim()) {
      const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ fullName: rx }, { rollNumber: rx }, { email: rx }, { phone: rx }];
    }
    if (branch)   filter.branch = branch.trim();
    if (status)   filter.status = status.trim();
    if (interest) filter.interests = interest.trim();
    if (rating) {
      const n = Number(rating);
      if (!isNaN(n) && n >= 1 && n <= 5) filter.technicalRating = n;
    }

    // Map GF records to same shape exportService expects
    const records = await GoogleFormRegistration.find(filter).sort({ importedAt: -1 }).lean();
    if (records.length === 0) {
      return res.status(404).json({ success: false, message: 'No matching records to export.' });
    }

    // Normalise to the export service's expected field names
    const normalised = records.map(r => ({
      registrationId: r._id.toString(),
      fullName:     r.fullName,
      rollNumber:   r.rollNumber,
      collegeEmail: r.email,
      phoneNumber:  r.phone,
      branch:       r.branch,
      interests:    r.interests,
      technicalRating: r.technicalRating,
      whyJoin:      r.whyJoin,
      whatsappConfirmedByUser: false,
      status:       r.status,
      createdAt:    r.importedAt
    }));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (format === 'csv') {
      const csv = generateCsvBuffer(normalised);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=DSDL_GoogleForm_${timestamp}.csv`);
      return res.status(200).send(csv);
    } else {
      const buf = generateExcelBuffer(normalised);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=DSDL_GoogleForm_${timestamp}.xlsx`);
      return res.status(200).send(buf);
    }
  } catch (error) {
    console.error('GF Export Error:', error);
    return res.status(500).json({ success: false, message: 'Export failed.' });
  }
};

// ─── Analytics (for Google Form tab metrics) ──────────────────────────────────
exports.getGoogleFormAnalytics = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  try {
    const total = await GoogleFormRegistration.countDocuments();
    const statusAgg = await GoogleFormRegistration.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const branchAgg = await GoogleFormRegistration.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        total,
        statusDistribution: statusAgg.map(s => ({ name: s._id, count: s.count })),
        branchDistribution:  branchAgg.map(b => ({ name: b._id, count: b.count }))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics.' });
  }
};
