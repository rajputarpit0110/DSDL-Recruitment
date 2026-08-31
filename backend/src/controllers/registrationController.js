const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const { generateRegistrationId } = require('../utils/generateId');

exports.submitRegistration = async (req, res) => {
  // Guard: ensure database is connected before attempting any write
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Registration service is temporarily unavailable. Please try again in a few moments.'
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
      return res.status(400).json({
        success: false,
        message: 'Full name is required.'
      });
    }

    if (!rollNumber || !rollNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'University Roll Number is required.'
      });
    }

    if (!collegeEmail || !collegeEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: 'College email address is required.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(collegeEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // College email domain validation
    const allowedDomain =
      process.env.ALLOWED_EMAIL_DOMAIN || 'kiet.edu';

    if (
      allowedDomain &&
      !collegeEmail
        .toLowerCase()
        .endsWith(`@${allowedDomain}`)
    ) {
      return res.status(400).json({
        success: false,
        message: `Please use your official college email ending with @${allowedDomain}`
      });
    }

    // Indian phone number validation
    const cleanedPhone = phoneNumber
      ? phoneNumber.trim().replace(/\D/g, '')
      : '';

    if (
      !cleanedPhone ||
      cleanedPhone.length !== 10 ||
      !/^[6-9]/.test(cleanedPhone)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.'
      });
    }

    // Branch validation
    // Allows standard branch values as well as custom "Other" values
    if (!branch || !branch.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please select or specify your branch.'
      });
    }

    // Interest validation
    // Accepts standard options as well as custom "Other" values
    if (
      !interests ||
      !Array.isArray(interests) ||
      interests.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one interest area.'
      });
    }

    const invalidInterests = interests.filter(
      (interest) =>
        !interest ||
        !interest.trim() ||
        interest.trim().length < 2
    );

    if (invalidInterests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid interest area.'
      });
    }

    // Technical rating validation
    const ratingNum = Number(technicalRating);

    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Technical rating must be between 1 and 5 stars.'
      });
    }

    // Why Join motivation validation — optional (no minimum limit, max limit enforced)
    const trimmedWhyJoin = typeof whyJoin === 'string' ? whyJoin.trim() : '';
    if (trimmedWhyJoin && trimmedWhyJoin.length > WHY_JOIN_MAX_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Motivation message cannot exceed ${WHY_JOIN_MAX_LENGTH} characters.`
      });
    }

    // Generate unique Registration ID with collision avoidance
    let registrationId = generateRegistrationId();
    let attempts = 0;

    while (
      await Registration.exists({ registrationId }) &&
      attempts < 5
    ) {
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
      branch: branch.trim(),
      interests: interests.map((interest) => interest.trim()),
      technicalRating: ratingNum,
      whyJoin: trimmedWhyJoin,
      whatsappConfirmedByUser: Boolean(whatsappConfirmedByUser),
      status: 'Registered',

      statusHistory: [
        {
          status: 'Registered',
          changedAt: new Date(),
          changedBy: 'System'
        }
      ]
    });

    await registration.save();

    // Return success response
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
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      let duplicateMsg =
        'You have already registered for DSDL Recruitment.';

      if (field === 'rollNumber') {
        duplicateMsg =
          'An application with this University Roll Number has already been submitted.';
      } else if (field === 'collegeEmail') {
        duplicateMsg =
          'An application with this College Email has already been submitted.';
      }

      return res.status(409).json({
        success: false,
        message: duplicateMsg
      });
    }

    console.error(
      'Registration Submission Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Registration service is temporarily unavailable. Please try again shortly.'
    });
  }
};
