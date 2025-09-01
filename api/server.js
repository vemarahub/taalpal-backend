const express = require('express');
const serverless = require('serverless-http');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://hellowereld.com/', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB Atlas connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

let db;
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db('taalpal');
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectToMongo();

// API endpoint to fetch all themes
app.get('/api/themavragen', async (req, res) => {
  try {
    const themavragen = await db.collection('themavragen').find({}).toArray();
    res.json(themavragen);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch themavragen' });
  }
});

// Export as serverless function for Vercel
module.exports = serverless(app);