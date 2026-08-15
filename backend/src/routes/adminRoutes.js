const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const { adminLoginLimiter } = require('../middleware/rateLimiter');

// Public Admin Auth Routes (with rate limiting)
router.post('/login', adminLoginLimiter, adminController.loginAdmin);
router.post('/logout', adminController.logoutAdmin);

// Protected Admin Routes
router.get('/me', authMiddleware, adminController.getAdminMe);
router.get('/registrations', authMiddleware, adminController.getRegistrations);
router.get('/registrations/:id', authMiddleware, adminController.getRegistrationById);
router.patch('/registrations/:id/status', authMiddleware, adminController.updateRegistrationStatus);
router.delete('/registrations/:id', authMiddleware, adminController.deleteRegistration);
router.get('/export', authMiddleware, adminController.exportRegistrations);
router.get('/analytics', authMiddleware, adminController.getAnalytics);
router.post('/google-sheets/sync', authMiddleware, adminController.syncGoogleSheets);

module.exports = router;
