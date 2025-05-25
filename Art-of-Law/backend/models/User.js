// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const workingHourSchema = new mongoose.Schema({
    dayOfWeek: { 
        type: String, 
        required: true, 
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
    },
    startTime: { type: String }, // Store as HH:mm (e.g., "09:00")
    endTime: { type: String },   // Store as HH:mm (e.g., "17:00")
    isOff: { type: Boolean, default: false }
}, { _id: false });

const absenceSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }, // Could be same as startDate for single day
    reason: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phone: { type: String, required: [true, 'Phone number is required'] },
  altPhone: { type: String },
  street: { type: String, required: [true, 'Street address is required'] },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  zip: { type: String, required: [true, 'ZIP code is required'] },
  country: { type: String, default: 'India', required: true },
  dob: { type: Date },
  gender: { type: String },
  occupation: { type: String },
  govtId: { type: String },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false, 
  },
  role: { 
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user',
  },
  // --- NEW FIELDS FOR ORGANIZER AVAILABILITY ---
  workingHours: {
    type: [workingHourSchema],
    default: () => { // Default working hours (e.g., Mon-Fri 9-5, Sat/Sun off)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days.map(day => ({
            dayOfWeek: day,
            startTime: (day === 'Sunday' || day === 'Saturday') ? "00:00" : "09:00",
            endTime: (day === 'Sunday' || day === 'Saturday') ? "00:00" : "17:00",
            isOff: (day === 'Sunday' || day === 'Saturday')
        }));
    }
  },
  absences: [absenceSchema],
  // --- END NEW FIELDS ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;