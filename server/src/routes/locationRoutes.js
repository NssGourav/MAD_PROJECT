import express from 'express';
import {
  updateDriverLocation,
  getDriverLocation,
  getAllDrivers,
  assignDriverToStudent
} from '../controllers/locationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Driver routes
router.post('/driver/update-location', authenticate, updateDriverLocation);

// Student routes
router.get('/student/driver-location/:driverId', authenticate, getDriverLocation);
router.post('/student/assign-driver', authenticate, assignDriverToStudent);

// Public routes
router.get('/drivers', getAllDrivers);

export default router;
