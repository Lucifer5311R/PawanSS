// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');

// Debug logs to ensure models are loaded
console.log('Booking model type in bookingController:', typeof Booking);
console.log('User model type in bookingController:', typeof User);

async function calculateAndFilterSlots(organizerId, date, slotDurationMinutes = 60) {
    const requestedDateObj = new Date(date); 
    requestedDateObj.setUTCHours(0, 0, 0, 0); 

    const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const requestedDayName = dayOfWeekNames[requestedDateObj.getUTCDay()];

    const availableSlotsList = [];

    const organizer = await User.findById(organizerId).select('workingHours absences');
    if (!organizer) {
        console.error(`calculateAndFilterSlots: Organizer not found for ID: ${organizerId}`);
        return []; 
    }

    // 1. Determine working hours for the requested day
    const daySetting = organizer.workingHours.find(wh => wh.dayOfWeek === requestedDayName);

    if (!daySetting || daySetting.isOff || !daySetting.startTime || !daySetting.endTime) {
        console.log(`calculateAndFilterSlots: Organizer ${organizerId} is off or no valid hours for ${requestedDayName}.`);
        return []; 
    }

    const [startHour, startMinute] = daySetting.startTime.split(':').map(Number);
    const [endHour, endMinute] = daySetting.endTime.split(':').map(Number);

    // 2. Check for absences on the requested day
    const isAbsent = organizer.absences.some(absence => {
        const absenceStart = new Date(absence.startDate);
        absenceStart.setUTCHours(0,0,0,0);
        const absenceEnd = new Date(absence.endDate);
        absenceEnd.setUTCHours(23,59,59,999); // Cover the entire end day
        return requestedDateObj >= absenceStart && requestedDateObj <= absenceEnd;
    });

    if (isAbsent) {
        console.log(`calculateAndFilterSlots: Organizer ${organizerId} is absent on ${date}.`);
        return []; 
    }
    
    // 3. Get existing bookings for the day
    const startOfDayForBookings = new Date(Date.UTC(requestedDateObj.getUTCFullYear(), requestedDateObj.getUTCMonth(), requestedDateObj.getUTCDate(), 0, 0, 0));
    const endOfDayForBookings = new Date(Date.UTC(requestedDateObj.getUTCFullYear(), requestedDateObj.getUTCMonth(), requestedDateObj.getUTCDate(), 23, 59, 59, 999));

    const existingBookings = await Booking.find({
        organizer: organizerId,
        startTime: { $gte: startOfDayForBookings, $lt: endOfDayForBookings }, 
        status: { $in: ['confirmed', 'pending_payment'] }
    }).lean();

    // 4. Generate slots
    for (let h = startHour; h < endHour || (h === endHour && startMinute < endMinute) ; h++) {
        for (let m = (h === startHour ? startMinute : 0); m < 60; m += slotDurationMinutes) {
            if (h === endHour && m >= endMinute && !(h === endHour && m === endMinute && slotDurationMinutes === 0) ) break; 

            const slotStartTime = new Date(Date.UTC(requestedDateObj.getUTCFullYear(), requestedDateObj.getUTCMonth(), requestedDateObj.getUTCDate(), h, m, 0));
            const slotEndTime = new Date(slotStartTime.getTime() + slotDurationMinutes * 60000);

            const dayEndTimeUTC = new Date(Date.UTC(requestedDateObj.getUTCFullYear(), requestedDateObj.getUTCMonth(), requestedDateObj.getUTCDate(), endHour, endMinute, 0));
            if (slotEndTime > dayEndTimeUTC) {
                continue;
            }
            
            const isClash = existingBookings.some(booking => {
                const bookingStartTime = new Date(booking.startTime);
                const bookingEndTime = new Date(booking.endTime);
                return (slotStartTime < bookingEndTime && slotEndTime > bookingStartTime);
            });

            // Also ensure slot is in the future relative to current time
            if (!isClash && slotStartTime >= new Date()) { 
                availableSlotsList.push({ startTime: slotStartTime, endTime: slotEndTime });
            }
        }
    }
    return availableSlotsList;
}

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, organizerId } = req.query;
    if (!date || !organizerId) {
        return res.status(400).json({ status: 'fail', message: 'Date and organizerId are required.' });
    }
    
    const organizer = await User.findById(organizerId);
    if (!organizer || (organizer.role !== 'organizer' && organizer.role !== 'admin')) {
        return res.status(404).json({ status: 'fail', message: 'Organizer not found or not an organizer.' });
    }
    
    const slotDuration = req.query.duration ? parseInt(req.query.duration, 10) : 60;
    if (isNaN(slotDuration) || slotDuration <= 0) {
        return res.status(400).json({ status: 'fail', message: 'Invalid slot duration.'});
    }

    const slots = await calculateAndFilterSlots(organizerId, date, slotDuration);
    res.status(200).json({ status: 'success', results: slots.length, data: { availableSlots: slots } });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching available slots.' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { organizer, startTime, endTime, serviceType, notes } = req.body;
    const client = req.user.id; 

    if (!organizer || !startTime || !endTime || !serviceType) {
        return res.status(400).json({ status: 'fail', message: 'Organizer, startTime, endTime, and serviceType are required.' });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime()) || parsedStartTime >= parsedEndTime || parsedStartTime < new Date()) {
        return res.status(400).json({ status: 'fail', message: 'Invalid start or end time. Ensure it is in the future and start time is before end time.' });
    }

    const conflictingBooking = await Booking.findOne({
        organizer, 
        status: { $in: ['confirmed', 'pending_payment'] },
        $or: [
            { startTime: { $lt: parsedEndTime, $gte: parsedStartTime } }, 
            { endTime: { $gt: parsedStartTime, $lte: parsedEndTime } },
            { startTime: { $lte: parsedStartTime }, endTime: { $gte: parsedEndTime } }
        ]
    });

    if (conflictingBooking) {
        return res.status(409).json({ status: 'fail', message: 'This time slot is no longer available or conflicts with an existing booking.' });
    }
    
    const newBooking = await Booking.create({ 
        client, 
        organizer, 
        startTime: parsedStartTime, 
        endTime: parsedEndTime, 
        serviceType, 
        notes 
    });
    res.status(201).json({ status: 'success', data: { booking: newBooking } });
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.code === 11000) { // Duplicate key error (from schema index)
        return res.status(409).json({ status: 'fail', message: 'This booking slot would create a duplicate entry. It might already be booked or conflict with another unique constraint.' });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: 'fail', message: messages.join('. ') });
    }
    res.status(400).json({ status: 'fail', message: error.message || 'Could not create booking.' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated.' });
    }
    const bookings = await Booking.find({ client: req.user.id })
                                  .populate('organizer', 'firstName lastName email')
                                  .sort({ startTime: 1 });
    res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve your bookings.' });
  }
};

exports.cancelMyBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated.' });
    }
    const booking = await Booking.findOne({ _id: req.params.bookingId, client: req.user.id });
    if (!booking) {
        return res.status(404).json({ status: 'fail', message: 'Booking not found or unauthorized.' });
    }
    if (booking.status === 'confirmed' || booking.status === 'pending_payment') {
      booking.status = 'cancelled_by_user';
      await booking.save({ validateModifiedOnly: true });
      return res.status(200).json({ status: 'success', data: { booking } });
    }
    res.status(400).json({ status: 'fail', message: `Cannot cancel booking with status: ${booking.status}.` });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ status: 'error', message: 'Failed to cancel booking.' });
  }
};

exports.getOrganizerBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'organizer') {
      filter.organizer = req.user.id;
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }
    // If admin and organizerId is provided in query, filter by that organizer
    if (req.user.role === 'admin' && req.query.organizerId) {
        filter.organizer = req.query.organizerId;
    }

    const { date, status, sort_by, sort_order } = req.query;

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      filter.startTime = { $gte: startDate, $lte: endDate };
    }

    if (status) {
      filter.status = status;
    }

    let sortOption = { startTime: 1 }; 
    if (sort_by) {
      // Basic protection against injecting arbitrary sort fields if needed
      // For now, assuming sort_by is a valid field name from client
      sortOption = { [sort_by]: sort_order === 'desc' ? -1 : 1 };
    }

    const bookings = await Booking.find(filter)
                                  .populate('client', 'firstName lastName email phone')
                                  .populate('organizer', 'firstName lastName')
                                  .sort(sortOption);
                                  
    res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
  } catch (error) {
    console.error('Error fetching organizer bookings:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve bookings.' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !Booking.schema.path('status').enumValues.includes(status)) {
        return res.status(400).json({ status: 'fail', message: 'Valid new status is required.'});
    }
    
    let bookingQuery = { _id: req.params.bookingId };
    if (req.user.role === 'organizer') {
        bookingQuery.organizer = req.user.id; // Organizer can only update their own bookings
    } 
    // Admin can update any booking, so no additional organizer filter if role is admin.

    const booking = await Booking.findOne(bookingQuery);

    if (!booking) {
        return res.status(404).json({ status: 'fail', message: 'Booking not found or you do not have permission to update it.' });
    }
    
    // Prevent organizer from directly changing status if it was cancelled by user to something other than specific states
    if (booking.status === 'cancelled_by_user' && req.user.role === 'organizer') {
        // Example: Allow organizer to change to 'confirmed' if payment received or 'completed' if service was somehow rendered.
        // For this example, let's say an organizer cannot unilaterally revert a user cancellation easily.
        if (status === 'cancelled_by_user') { // Trying to set it to the same
             return res.status(400).json({ status: 'fail', message: 'Booking already cancelled by user.' });
        }
        // Add more complex logic here if needed for specific status transitions by organizer on user-cancelled bookings.
    }

    booking.status = status;
    await booking.save({ validateModifiedOnly: true });
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    console.error('Error updating booking status:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: 'fail', message: messages.join('. ') });
    }
    res.status(500).json({ status: 'error', message: 'Failed to update status.' });
  }
};