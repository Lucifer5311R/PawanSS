// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // Ensure this is at the top

const connectDB = require('./config/db.js'); // Assuming db.js is in config folder
const authRoutes = require('./routes/auth.js');
const paymentRoutes = require('./routes/payment.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const organizerRoutes = require('./routes/organizerRoutes.js'); // <<< NEW ROUTE

const app = express();

// CORS configuration (allow credentials if using cookies/sessions)
app.use(cors({
  origin:[ 'http://localhost:3000','https://pawanss-artoflaw.vercel.app'], // Your frontend URL
  credentials: true // If you plan to use cookies or sessions for auth
}));

app.use(express.json());

connectDB();

app.get('/api', (req, res) => res.json({ message: 'Art of Law API is Live' }));
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/organizer', organizerRoutes); // <<< MOUNT NEW ROUTE

app.get('/', (req, res) => res.send('API Server Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API base: http://localhost:${PORT}/api`);
});