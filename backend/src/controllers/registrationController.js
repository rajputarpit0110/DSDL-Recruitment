const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const { generateRegistrationId } = require('../utils/generateId');
const { BRANCH_OPTIONS, INTEREST_OPTIONS, WHY_JOIN_MIN_LENGTH, WHY_JOIN_MAX_LENGTH } = require('../config/recruitmentConfig');

exports.submitRegistration = async (req, res) => {
  // Guard: ensure database is connected before attempting any write
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Registration service is temporarily unavailable. Please try again in a few moments.'
    });
  }

  try {
    const {
      fullName,
      rollNumber,
      collegeEmail,
      phoneNumber,
      branch,
      interests,
      technicalRating,
      whyJoin,
      whatsappConfirmedByUser
    } = req.body;

    // Basic required field validations
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!rollNumber || !rollNumber.trim()) {
      return res.status(400).json({ success: false, message: 'University Roll Number is required.' });
    }
    if (!collegeEmail || !collegeEmail.trim()) {
      return res.status(400).json({ success: false, message: 'College email address is required.' });
    }

    // Email format & domain validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collegeEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'kiet.edu';
    if (allowedDomain && !collegeEmail.toLowerCase().endsWith(`@${allowedDomain}`)) {
      return res.status(400).json({
        success: false,
        message: `Please use your official college email ending with @${allowedDomain}`
      });
    }

    // Indian Phone format validation
    const cleanedPhone = phoneNumber ? phoneNumber.trim().replace(/\D/g, '') : '';
    if (!cleanedPhone || cleanedPhone.length !== 10 || !/^[6-9]/.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.'
      });
    }

    // Branch validation — allow any non-empty string; standard options are the common choices
    // but a custom value entered via the "Other" text box is also valid.
    if (!branch || !branch.trim()) {
      return res.status(400).json({ success: false, message: 'Please select or specify your branch.' });
    }

    // Interest options validation — accept standard options OR a custom string (typed in "Other" box)
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one interest area.' });
    }
    const invalidInterests = interests.filter(i => !i || !i.trim() || i.trim().length < 2);
    if (invalidInterests.length > 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid interest area.' });
    }

    // Technical rating validation
    const ratingNum = Number(technicalRating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Technical rating must be between 1 and 5 stars.' });
    }

    // Why Join motivation validation
    const trimmedWhyJoin = whyJoin ? whyJoin.trim() : '';
    if (trimmedWhyJoin.length < WHY_JOIN_MIN_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Please explain why you want to join DSDL (at least ${WHY_JOIN_MIN_LENGTH} characters).`
      });
    }
    if (trimmedWhyJoin.length > WHY_JOIN_MAX_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Motivation message cannot exceed ${WHY_JOIN_MAX_LENGTH} characters.`
      });
    }

    // Generate unique Registration ID with collision avoidance
    let registrationId = generateRegistrationId();
    let attempts = 0;
    while (await Registration.exists({ registrationId }) && attempts < 5) {
      registrationId = generateRegistrationId();
      attempts++;
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanEmail = collegeEmail.trim().toLowerCase();

    // Create registration record
    const registration = new Registration({
      registrationId,
      fullName: fullName.trim(),
      rollNumber: cleanRoll,
      collegeEmail: cleanEmail,
      phoneNumber: cleanedPhone,
      branch,
      interests,
      technicalRating: ratingNum,
      whyJoin: trimmedWhyJoin,
      whatsappConfirmedByUser: Boolean(whatsappConfirmedByUser),
      status: 'Registered',
      statusHistory: [{
        status: 'Registered',
        changedAt: new Date(),
        changedBy: 'System'
      }]
    });

    await registration.save();

    // Return direct success payload (No public GET lookup endpoint exposed)
    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      registrationId: registration.registrationId,
      applicant: {
        fullName: registration.fullName,
        rollNumber: registration.rollNumber,
        branch: registration.branch
      },
      submittedAt: registration.createdAt
    });

  } catch (error) {
    // Handle MongoDB duplicate key errors gracefully
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      let duplicateMsg = 'You have already registered for DSDL Recruitment.';
      if (field === 'rollNumber') {
        duplicateMsg = 'An application with this University Roll Number has already been submitted.';
      } else if (field === 'collegeEmail') {
        duplicateMsg = 'An application with this College Email has already been submitted.';
      }
      return res.status(409).json({ success: false, message: duplicateMsg });
    }

    console.error('Registration Submission Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration service is temporarily unavailable. Please try again shortly.'
    });
  }
};
