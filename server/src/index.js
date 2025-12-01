import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import locationRoutes from './routes/locationRoutes.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(cors());
app.use(express.json());
const routes = [
  {
    id: 'route-1',
    name: 'Main Loop',
    color: '#1E90FF',
    stops: [
      { id: 'stop-a', name: 'North Gate', latitude: 17.447, longitude: 78.349 },
      { id: 'stop-b', name: 'Library', latitude: 17.446, longitude: 78.350 },
      { id: 'stop-c', name: 'Hostels', latitude: 17.445, longitude: 78.352 }
    ]
  }
];

const shuttles = [
  {
    id: 'shuttle-101',
    name: 'Shuttle 101',
    routeId: 'route-1',
    latitude: 17.4462,
    longitude: 78.3497,
    speedKph: 18
  }
];
setInterval(() => {
  for (const shuttle of shuttles) {
    const deltaLat = (Math.random() - 0.5) * 0.0003;
    const deltaLng = (Math.random() - 0.5) * 0.0003;
    shuttle.latitude += deltaLat;
    shuttle.longitude += deltaLng;
    shuttle.speedKph = 10 + Math.round(Math.random() * 20);
  }
}, 2000);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.type('html').send(`
    <h1>Smart Shuttle Tracker API</h1>
    <h2>Authentication</h2>
    <ul>
      <li>POST /api/auth/signup - Create new user (driver/student)</li>
      <li>POST /api/auth/signin - Sign in user</li>
      <li><a href="/api/users">/api/users</a> - Get all users</li>
    </ul>
    <h2>Location Tracking</h2>
    <ul>
      <li>POST /api/driver/update-location - Update driver location</li>
      <li>GET /api/student/driver-location/:driverId - Get driver location</li>
      <li><a href="/api/drivers">/api/drivers</a> - Get all drivers</li>
      <li>POST /api/student/assign-driver - Assign driver to student</li>
    </ul>
    <h2>Legacy Routes</h2>
    <ul>
      <li><a href="/api/routes">/api/routes</a></li>
      <li><a href="/api/shuttles">/api/shuttles</a></li>
      <li><a href="/health">/health</a></li>
    </ul>
  `);
});

app.get('/api/routes', (_req, res) => {
  res.json({ routes });
});

app.get('/api/shuttles', (_req, res) => {
  res.json({ shuttles });
});
app.get('/api/users', async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api', locationRoutes);

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});



