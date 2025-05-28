// backend/routes/bookingRoutes.js
const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.patch('/my-bookings/:bookingId/cancel', bookingController.cancelMyBooking);

const restrictToOrganizersOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'organizer' && req.user.role !== 'admin')) {
    return res.status(403).json({ status: 'fail', message: 'Permission denied.' });
  }
  next();
};

router.get('/organizer-bookings', restrictToOrganizersOrAdmin, bookingController.getOrganizerBookings);
router.patch('/organizer-bookings/:bookingId/status', restrictToOrganizersOrAdmin, bookingController.updateBookingStatus);

router.get('/available-slots', bookingController.getAvailableSlots);

module.exports = router;