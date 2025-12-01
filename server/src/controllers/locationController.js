import User from '../models/User.js';

/**
 * @desc    Update driver's current location
 * @route   POST /api/driver/update-location
 * @access  Private (Driver only)
 */
export const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const driverId = req.user._id;

    if (!lat || !lng) {
      return res.status(400).json({
        message: 'Latitude and longitude are required'
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        message: 'Invalid coordinates'
      });
    }

    const driver = await User.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (driver.role !== 'driver') {
      return res.status(403).json({ message: 'User is not a driver' });
    }

    driver.currentLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      updatedAt: new Date()
    };

    await driver.save();

    res.json({
      message: 'Location updated successfully',
      location: driver.currentLocation
    });

  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({
      message: 'Server error while updating location',
      error: error.message
    });
  }
};

/**
 * @desc    Get driver's latest location
 * @route   GET /api/student/driver-location/:driverId
 * @access  Private (Student only)
 */
export const getDriverLocation = async (req, res) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ message: 'Driver ID is required' });
    }

    const driver = await User.findById(driverId).select('name email role currentLocation');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (driver.role !== 'driver') {
      return res.status(400).json({ message: 'User is not a driver' });
    }
    if (!driver.currentLocation || !driver.currentLocation.lat || !driver.currentLocation.lng) {
      return res.status(404).json({
        message: 'Driver location not available',
        driver: {
          id: driver._id,
          name: driver.name,
          email: driver.email
        }
      });
    }

    res.json({
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        location: driver.currentLocation
      }
    });

  } catch (error) {
    console.error('Error fetching driver location:', error);
    res.status(500).json({
      message: 'Server error while fetching location',
      error: error.message
    });
  }
};

/**
 * @desc    Get all drivers with their locations
 * @route   GET /api/drivers
 * @access  Public
 */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' })
      .select('name email currentLocation')
      .sort({ 'currentLocation.updatedAt': -1 });

    res.json({
      count: drivers.length,
      drivers: drivers.map(driver => ({
        id: driver._id,
        name: driver.name,
        email: driver.email,
        location: driver.currentLocation
      }))
    });

  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({
      message: 'Server error while fetching drivers',
      error: error.message
    });
  }
};

/**
 * @desc    Assign a driver to a student
 * @route   POST /api/student/assign-driver
 * @access  Private (Student only)
 */
export const assignDriverToStudent = async (req, res) => {
  try {
    const { driverId } = req.body;
    const studentId = req.user._id;

    if (!driverId) {
      return res.status(400).json({
        message: 'Driver ID is required'
      });
    }
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }
    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (driver.role !== 'driver') {
      return res.status(400).json({ message: 'Assigned user is not a driver' });
    }
    student.assignedDriverId = driverId;
    await student.save();

    res.json({
      message: 'Driver assigned successfully',
      student: {
        id: student._id,
        name: student.name,
        assignedDriver: {
          id: driver._id,
          name: driver.name,
          email: driver.email
        }
      }
    });

  } catch (error) {
    console.error('Error assigning driver:', error);
    res.status(500).json({
      message: 'Server error while assigning driver',
      error: error.message
    });
  }
};
