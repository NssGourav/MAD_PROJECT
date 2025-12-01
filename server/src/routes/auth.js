import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/signin
 * @desc    Login user (alias for /login)
 * @access  Public
 */
router.post('/signin', login);

export default router;

