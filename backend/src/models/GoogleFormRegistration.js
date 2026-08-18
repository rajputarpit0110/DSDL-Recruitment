const mongoose = require('mongoose');
const { STATUS_OPTIONS } = require('../config/recruitmentConfig');

const gfStatusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: String, default: 'Admin' }
}, { _id: false });

const googleFormRegistrationSchema = new mongoose.Schema({
  // Source tracking
  source: { type: String, default: 'Google Form', immutable: true },

  // Core applicant fields
  fullName: { type: String, required: true, trim: true },
  rollNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true
  },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  branch: { type: String, trim: true, default: '' },

  // Interests stored as array (CSV rows may have comma-separated values)
  interests: { type: [String], default: [] },

  technicalRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  whyJoin: { type: String, trim: true, default: '' },

  // Status management — same options as website registrations
  status: {
    type: String,
    default: 'Registered'
    // No enum — validated in controller against STATUS_OPTIONS
  },
  statusHistory: [gfStatusHistorySchema],

  // Import metadata
  importedAt: { type: Date, default: Date.now },
  importBatch: { type: String, default: '' } // timestamp of import session
}, {
  timestamps: true,
  collection: 'googleformregistrations'
});

// Text search index
googleFormRegistrationSchema.index({
  fullName: 'text',
  rollNumber: 'text',
  email: 'text',
  phone: 'text'
});

module.exports = mongoose.model('GoogleFormRegistration', googleFormRegistrationSchema);
