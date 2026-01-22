import express from 'express';
import { loginUser, registerUser, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').put(protect, updateUserProfile);

export default router;
