const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Example of a protected route
// router.get('/me', authController.protect, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: req.user
//     }
//   });
// });

module.exports = router;