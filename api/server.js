const express = require('express');
const serverless = require('serverless-http');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['https://hellowereld.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Use global cache to persist DB connection across invocations
let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

async function connectToMongo() {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Fail fast if unreachable
    });
    await cachedClient.connect();
    global._mongoClient = cachedClient;
    console.log('Connected to MongoDB Atlas');
  }

  cachedDb = cachedClient.db('taalpal');
  global._mongoDb = cachedDb;
  return cachedDb;
}

app.get('/api/themavragen', async (req, res) => {
  try {
    const db = await connectToMongo();
    const data = await db.collection('themavragen').find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch themavragen' });
  }
});

// Optional for local testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => console.log('Local server running at http://localhost:3001'));
}

module.exports = serverless(app);