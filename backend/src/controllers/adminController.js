const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const { generateExcelBuffer, generateCsvBuffer } = require('../services/exportService');
const { syncToGoogleSheets } = require('../services/googleSheetsService');
const { STATUS_OPTIONS } = require('../config/recruitmentConfig');

// Helper to build MongoDB filter query from admin query params
function buildFilterQuery(queryParams) {
  const { search, branch, rating, interest, status } = queryParams;
  const filter = {};

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { fullName: searchRegex },
      { rollNumber: searchRegex },
      { collegeEmail: searchRegex },
      { phoneNumber: searchRegex },
      { registrationId: searchRegex }
    ];
  }

  if (branch && branch.trim()) {
    filter.branch = branch.trim();
  }

  if (rating) {
    const numRating = Number(rating);
    if (!isNaN(numRating) && numRating >= 1 && numRating <= 5) {
      filter.technicalRating = numRating;
    }
  }

  if (interest && interest.trim()) {
    filter.interests = interest.trim();
  }

  if (status && status.trim()) {
    filter.status = status.trim();
  }

  return filter;
}

exports.loginAdmin = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const jwtSecret = process.env.JWT_SECRET || 'dsdl_fallback_jwt_secret_key';
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      jwtSecret,
      { expiresIn: '8h' }
    );

    // Set secure HttpOnly cookie
    res.cookie('dsdl_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    return res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      admin: { username: admin.username },
      token // Provided for API testing / client state if needed
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'An internal error occurred during login.' });
  }
};

exports.logoutAdmin = (req, res) => {
  res.clearCookie('dsdl_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

exports.getAdminMe = (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin
  });
};

exports.getRegistrations = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const filter = buildFilterQuery(req.query);

    const [registrations, total] = await Promise.all([
      Registration.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Registration.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get Registrations Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch registrations.' });
  }
};

exports.getRegistrationById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Applicant record not found.' });
    }
    return res.status(200).json({ success: true, registration });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch registration details.' });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const { status } = req.body;
    if (!status || !STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Applicant record not found.' });
    }

    registration.status = status;
    registration.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.admin?.username || 'Admin'
    });

    await registration.save();

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      registration
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
};

exports.deleteRegistration = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Applicant record not found.' });
    }
    return res.status(200).json({ success: true, message: 'Applicant registration deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete registration.' });
  }
};

exports.exportRegistrations = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const format = (req.query.format || 'excel').toLowerCase();
    const filter = buildFilterQuery(req.query);

    const records = await Registration.find(filter).sort({ createdAt: -1 }).lean();

    if (records.length === 0) {
      return res.status(404).json({ success: false, message: 'No matching records found to export.' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (format === 'csv') {
      const csvContent = generateCsvBuffer(records);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=DSDL_Registrations_${timestamp}.csv`);
      return res.status(200).send(csvContent);
    } else {
      const excelBuffer = generateExcelBuffer(records);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=DSDL_Registrations_${timestamp}.xlsx`);
      return res.status(200).send(excelBuffer);
    }
  } catch (error) {
    console.error('Export Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export registration data.' });
  }
};

exports.getAnalytics = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const totalRegistrations = await Registration.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRegistrations = await Registration.countDocuments({ createdAt: { $gte: todayStart } });

    const avgRatingResult = await Registration.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$technicalRating' } } }
    ]);
    const averageRating = avgRatingResult.length > 0 ? Number(avgRatingResult[0].avgRating.toFixed(1)) : 0;

    const branchAgg = await Registration.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const branchDistribution = branchAgg.map(b => ({ name: b._id, count: b.count }));

    const ratingAgg = await Registration.aggregate([
      { $group: { _id: '$technicalRating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const ratingDistribution = [1, 2, 3, 4, 5].map(r => {
      const found = ratingAgg.find(item => item._id === r);
      return { rating: `${r} Star`, count: found ? found.count : 0 };
    });

    const interestAgg = await Registration.aggregate([
      { $unwind: '$interests' },
      { $group: { _id: '$interests', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const interestDistribution = interestAgg.map(i => ({ name: i._id, count: i.count }));

    const statusAgg = await Registration.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusDistribution = statusAgg.map(s => ({ name: s._id, count: s.count }));

    return res.status(200).json({
      success: true,
      analytics: {
        totalRegistrations,
        todayRegistrations,
        averageRating,
        branchDistribution,
        ratingDistribution,
        interestDistribution,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate recruitment analytics.' });
  }
};

exports.syncGoogleSheets = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable: database not connected.' });
  }

  try {
    const result = await syncToGoogleSheets();
    if (!result.configured) {
      return res.status(400).json(result);
    }
    if (!result.success) {
      return res.status(500).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Google Sheets sync execution failed.' });
  }
};
