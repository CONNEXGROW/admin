const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the root directory
app.use(express.static(__dirname));  // This serves all files in the root folder

// Basic Authentication Middleware
const authMiddleware = (req, res, next) => {
  const auth = { username: 'admin', password: 'password' }; // Change these values for your use

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, pwd] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login === auth.username && pwd === auth.password) {
    return next(); // Authentication successful
  }

  // If authentication fails
  res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
  res.status(401).send('Authentication required.');
};

// Apply authentication to the admin route
app.use('/admin.html', authMiddleware);

// Endpoint to get data
app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading data.json:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Endpoint to update data
app.post('/api/data', (req, res) => {
  try {
    const newData = req.body;
    fs.writeFileSync('data.json', JSON.stringify(newData, null, 2), 'utf8');
    res.json({ message: 'Data updated successfully!' });
  } catch (error) {
    console.error('Error writing to data.json:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
