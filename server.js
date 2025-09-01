const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from your GitHub Pages frontend
app.use(express.json());

// MongoDB Atlas connection
const uri = process.env.MONGODB_URI; // Store connection string in .env
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/api/themas', async (req, res) => {
  try {
    const themas = await db.collection('themavragen').find({}).toArray();
    res.json(themas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch themas' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});