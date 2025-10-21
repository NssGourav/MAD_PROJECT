# Authentication Setup Guide

## Overview
Your Smart Shuttle Tracker app now includes a complete authentication system with Sign In and Sign Up pages.

## Features Added

### 1. **Sign In Screen** (`screens/SignInScreen.js`)
- Email and password login
- Form validation
- Password visibility toggle
- Error handling with snackbar notifications
- Navigation to Sign Up screen

### 2. **Sign Up Screen** (`screens/SignUpScreen.js`)
- User registration with name, email, and password
- Password confirmation
- Password strength requirements (minimum 6 characters)
- Form validation
- Error handling with snackbar notifications
- Navigation to Sign In screen

### 3. **Authentication Context** (`context/AuthContext.js`)
- Centralized authentication state management
- Persistent user sessions using AsyncStorage
- Sign in, sign up, and sign out functions
- Automatic user loading on app start

### 4. **Updated App.js**
- Integrated authentication flow
- Protected routes (tracker only accessible when logged in)
- User menu in the app bar showing user info and sign out option
- Welcome message on landing page

### 5. **Server Authentication Endpoints** (`server/src/index.js`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/users` - List all users (for debugging)

## Installation Steps

1. **Install new dependencies:**
   ```bash
   cd Shuttle_Trackerr
   npm install
   ```

2. **Start the backend server:**
   ```bash
   cd ../server
   npm start
   ```

3. **Start the Expo app:**
   ```bash
   cd ../Shuttle_Trackerr
   npm start
   ```

## How to Use

### User Flow:
1. **First Launch**: App shows Sign In screen
2. **New User**: Click "Sign Up" to create an account
3. **Existing User**: Enter credentials and click "Sign In"
4. **Logged In**: Access the landing page and tracker
5. **Sign Out**: Click the user icon in the top right corner

### Testing:
1. Create a test account with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123

2. Sign in with the credentials

3. You should see:
   - Welcome message on landing page
   - User menu in the app bar
   - Full access to tracker functionality

## API Endpoints

### Sign Up
```
POST http://localhost:4000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Sign In
```
POST http://localhost:4000/api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**
1. The current implementation stores passwords in plain text - **DO NOT use in production**
2. Implement proper password hashing (bcrypt, argon2, etc.)
3. Add JWT tokens or session management
4. Use a real database (MongoDB, PostgreSQL, etc.)
5. Add rate limiting to prevent brute force attacks
6. Implement email verification
7. Add password reset functionality
8. Use HTTPS for all communications

## File Structure

```
Shuttle_Trackerr/
├── App.js                     # Main app with navigation and auth flow
├── screens/
│   ├── SignInScreen.js       # Sign in page
│   └── SignUpScreen.js       # Sign up page
├── context/
│   └── AuthContext.js        # Authentication state management
└── package.json              # Updated with new dependencies

server/
└── src/
    └── index.js              # Updated with auth endpoints
```

## Customization

### Styling
All screens use React Native Paper components and can be customized through the `styles` object in each file.

### Validation Rules
- Email: Standard email format validation
- Password: Minimum 6 characters (can be changed in validation functions)
- Name: Required field

### Storage
User data is stored in AsyncStorage on the device. To clear stored data during development:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.clear();
```

## Troubleshooting

### "Cannot find module" errors
```bash
cd Shuttle_Trackerr
npm install
```

### Server connection issues
- Make sure the server is running on `http://localhost:4000`
- Check that CORS is properly configured
- Verify the API endpoint URLs in the screens

### Navigation issues
- Make sure all navigation dependencies are installed
- Clear the Metro bundler cache: `expo start -c`

## Next Steps

1. ✅ Authentication system implemented
2. Add password reset functionality
3. Add email verification
4. Implement JWT tokens
5. Add profile editing
6. Add user preferences
7. Implement proper database storage
8. Add social login (Google, Facebook, etc.)
