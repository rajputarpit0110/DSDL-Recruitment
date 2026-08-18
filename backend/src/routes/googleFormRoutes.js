const express = require('express');
const router = express.Router();
const multer = require('multer');
const googleFormController = require('../controllers/googleFormController');
const authMiddleware = require('../middleware/auth');

// Multer: store uploaded file in memory (no disk I/O, works on Render)
// Limit: 10 MB — large Google Form exports should fit well within this.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream'
    ];
    const ext = file.originalname.toLowerCase();
    if (allowed.includes(file.mimetype) || ext.endsWith('.csv') || ext.endsWith('.xlsx') || ext.endsWith('.xls')) {
      return cb(null, true);
    }
    cb(new Error('Only CSV or Excel files are allowed.'));
  }
});

// All routes are protected by JWT auth middleware
// Mounted under /api/admin so full paths are e.g. POST /api/admin/google-form/import

router.post(  '/google-form/import',               authMiddleware, upload.single('sheet'), googleFormController.importGoogleFormSheet);
router.get(   '/google-form/registrations',         authMiddleware, googleFormController.getGoogleFormRegistrations);
router.get(   '/google-form/registrations/:id',     authMiddleware, googleFormController.getGoogleFormRegistrationById);
router.patch( '/google-form/registrations/:id/status', authMiddleware, googleFormController.updateGoogleFormStatus);
router.delete('/google-form/registrations/:id',     authMiddleware, googleFormController.deleteGoogleFormRegistration);
router.get(   '/google-form/export',                authMiddleware, googleFormController.exportGoogleFormRegistrations);
router.get(   '/google-form/analytics',             authMiddleware, googleFormController.getGoogleFormAnalytics);

module.exports = router;
