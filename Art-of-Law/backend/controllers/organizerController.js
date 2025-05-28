// backend/controllers/organizerController.js
const User = require('../models/User');

exports.getAvailability = async (req, res) => {
    try {
        // req.user should be populated by the authController.protect middleware
        const organizerId = req.user.id; 
        const organizer = await User.findById(organizerId).select('workingHours absences');

        if (!organizer) {
            return res.status(404).json({ status: 'fail', message: 'Organizer not found.' });
        }
        if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'User is not an organizer or admin.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                workingHours: organizer.workingHours,
                absences: organizer.absences,
            },
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch availability.' });
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const organizerId = req.user.id;
        const { workingHours, absences } = req.body;

        if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'User is not an organizer or admin.' });
        }

        const updateData = {};
        if (workingHours) updateData.workingHours = workingHours;
        if (absences) updateData.absences = absences;


        const updatedOrganizer = await User.findByIdAndUpdate(organizerId, updateData, {
            new: true, // Return the modified document
            runValidators: true, // Ensure schema validations are run
        }).select('workingHours absences');

        if (!updatedOrganizer) {
            return res.status(404).json({ status: 'fail', message: 'Organizer not found.' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Availability updated successfully.',
            data: {
                workingHours: updatedOrganizer.workingHours,
                absences: updatedOrganizer.absences,
            },
        });
    } catch (error) {
        console.error('Error updating availability:', error);
         if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ status: 'fail', message: messages.join('. ') });
        }
        res.status(500).json({ status: 'error', message: 'Failed to update availability.' });
    }
};