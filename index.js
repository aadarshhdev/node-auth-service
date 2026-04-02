const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! The app is running and managing the DB.');
});

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.send('OK');
  } catch (err) {
    res.status(500).send('DB connection failed');
  }
});

app.get('/customers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    console.error('DB query failed:', err);
    res.status(500).send('DB query failed');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}`);
});
