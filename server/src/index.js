import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

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
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/api/routes">/api/routes</a></li>
      <li><a href="/api/shuttles">/api/shuttles</a></li>
    </ul>
  `);
});

app.get('/api/routes', (_req, res) => {
  res.json({ routes });
});

app.get('/api/shuttles', (_req, res) => {
  res.json({ shuttles });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});


