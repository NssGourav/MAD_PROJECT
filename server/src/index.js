import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory user storage (in production, use a real database)
const users = [];
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
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/api/routes">/api/routes</a></li>
      <li><a href="/api/shuttles">/api/shuttles</a></li>
      <li><a href="/api/users">/api/users</a></li>
      <li>POST /api/auth/signup</li>
      <li>POST /api/auth/signin</li>
    </ul>
  `);
});

app.get('/api/routes', (_req, res) => {
  res.json({ routes });
});

app.get('/api/shuttles', (_req, res) => {
  res.json({ shuttles });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In production, hash the password!
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    message: 'User created successfully',
    user: userWithoutPassword
  });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Sign in successful',
    user: userWithoutPassword
  });
});

app.get('/api/users', (_req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json({ users: usersWithoutPasswords });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


