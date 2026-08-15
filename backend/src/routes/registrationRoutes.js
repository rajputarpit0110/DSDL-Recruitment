const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { registrationLimiter } = require('../middleware/rateLimiter');

// Public Registration Submission API
router.post('/', registrationLimiter, registrationController.submitRegistration);

module.exports = router;
