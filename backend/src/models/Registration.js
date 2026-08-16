const mongoose = require('mongoose');
const { BRANCH_OPTIONS, INTEREST_OPTIONS, STATUS_OPTIONS, WHY_JOIN_MIN_LENGTH, WHY_JOIN_MAX_LENGTH } = require('../config/recruitmentConfig');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
    // No enum here — controller validates against STATUS_OPTIONS before saving
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  changedBy: {
    type: String,
    default: 'Admin'
  }
}, { _id: false });

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long']
  },
  rollNumber: {
    type: String,
    required: [true, 'University Roll Number is required'],
    uppercase: true,
    trim: true,
    unique: true,
    index: true
  },
  collegeEmail: {
    type: String,
    required: [true, 'College Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
    index: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch selection is required'],
    enum: {
      values: BRANCH_OPTIONS,
      message: '{VALUE} is not a supported branch'
    },
    index: true
  },
  interests: {
    type: [String],
    validate: {
      validator: function(val) {
        return Array.isArray(val) && val.length > 0 && val.every(item => INTEREST_OPTIONS.includes(item));
      },
      message: 'Please select at least one valid interest area'
    }
  },
  technicalRating: {
    type: Number,
    required: [true, 'Technical rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    index: true
  },
  whyJoin: {
    type: String,
    required: [true, 'Motivation text is required'],
    trim: true,
    minlength: [WHY_JOIN_MIN_LENGTH, `Motivation must be at least ${WHY_JOIN_MIN_LENGTH} characters`],
    maxlength: [WHY_JOIN_MAX_LENGTH, `Motivation cannot exceed ${WHY_JOIN_MAX_LENGTH} characters`]
  },
  whatsappConfirmedByUser: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'Registered',
    index: true
    // No enum here — controller validates against STATUS_OPTIONS before saving.
    // Keeping enum in schema causes ValidationErrors on save when STATUS_OPTIONS
    // changes but the running server hasn't restarted yet.
  },
  statusHistory: [statusHistorySchema]
}, {
  timestamps: true
});

// Compound search index for ultra-fast query execution
registrationSchema.index({ fullName: 'text', rollNumber: 'text', collegeEmail: 'text', phoneNumber: 'text' });

module.exports = mongoose.model('Registration', registrationSchema);
