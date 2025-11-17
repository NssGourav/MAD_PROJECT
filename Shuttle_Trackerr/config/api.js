import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * IMPORTANT: For physical devices, you need to use your computer's local IP address
 * 
 * To find your IP address:
 * - Mac/Linux: Run `ifconfig | grep "inet " | grep -v 127.0.0.1` in terminal
 * - Windows: Run `ipconfig` in command prompt, look for IPv4 Address
 * 
 * Your current IP appears to be: 192.168.138.40 (check if this is correct)
 * 
 * Examples:
 * - iOS Simulator: http://localhost:4000 ✅ (works automatically)
 * - Android Emulator: http://10.0.2.2:4000 ✅ (works automatically)
 * - Physical Device: http://192.168.138.40:4000 (update PHYSICAL_DEVICE_IP below)
 */

// ⚠️ SET THIS to 'true' if you're testing on a PHYSICAL DEVICE
// Then update PHYSICAL_DEVICE_IP with your computer's local IP address
const USE_PHYSICAL_DEVICE_IP = true; // Set to true for physical devices
const PHYSICAL_DEVICE_IP = '192.168.138.40'; // Your computer's IP (find with: ifconfig or ipconfig)

// Determine the API base URL
let API_BASE_URL;
if (__DEV__) {
  if (USE_PHYSICAL_DEVICE_IP) {
    // Use your computer's IP for physical devices
    API_BASE_URL = `http://${PHYSICAL_DEVICE_IP}:4000`;
  } else {
    // Use default URLs for simulators/emulators
    API_BASE_URL = Platform.select({
      ios: 'http://localhost:4000', // iOS Simulator
      android: 'http://10.0.2.2:4000', // Android Emulator
      default: 'http://localhost:4000',
    });
  }
} else {
  // Production URL
  API_BASE_URL = 'https://your-production-api.com';
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    // Add more endpoints as needed
  },
};

// Log the API URL being used (helpful for debugging)
if (__DEV__) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('📱 Platform:', Platform.OS);
  console.log('🔧 Using Physical Device IP:', USE_PHYSICAL_DEVICE_IP);
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG;

