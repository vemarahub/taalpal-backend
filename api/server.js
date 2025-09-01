const express = require('express');
const serverless = require('serverless-http');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://hellowereld.com', 'http://localhost:3000'], // no trailing slash
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const uri = process.env.MONGODB_URI;
let client;
let db;

// Lazy MongoDB connection
async function getDb() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  }

  db = client.db('taalpal');
  return db;
}

// Routes
app.get('/api/themavragen', async (req, res) => {
  try {
    const database = await getDb();
    const themavragen = await database.collection('themavragen').find({}).toArray();
    res.json(themavragen);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch themavragen' });
  }
});

// Local dev server (optional)
if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => console.log('Local server running at http://localhost:3001'));
}

module.exports = serverless(app);