// backend/routes/organizerRoutes.js
const express = require('express');
const organizerController = require('../controllers/organizerController');
const authController = require('../controllers/authController'); // For protect middleware

const router = express.Router();

// Protect all routes after this middleware for organizers/admins
router.use(authController.protect);

// Middleware to restrict to organizer or admin
const restrictToOrganizerOrAdmin = (req, res, next) => {
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'fail',
            message: 'You do not have permission to perform this action.',
        });
    }
    next();
};

router.get('/availability', restrictToOrganizerOrAdmin, organizerController.getAvailability);
router.patch('/availability', restrictToOrganizerOrAdmin, organizerController.updateAvailability);
// Add other organizer-specific routes here if needed

module.exports = router;