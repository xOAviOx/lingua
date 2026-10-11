const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const dataFile = path.join(__dirname, 'data', 'feedback.json');
app.use(express.json());
app.get(['/playground.html', '/docs.html', '/about.html', '/feedback.html', '/playground.css', '/playground.js', '/feedback.js'], (request, response) => {
  response.sendFile(path.join(__dirname, request.path));
});
app.get('/', (request, response) => response.redirect('/playground.html'));
app.post('/api/feedback', async (request, response) => {
  const name = String(request.body.name || '').trim();
  const email = String(request.body.email || '').trim();
  const message = String(request.body.message || '').trim();
  if (name.length < 2 || name.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100 || message.length < 10 || message.length > 500) return response.status(400).json({ error: 'Please check the form fields.' });
  try {
    const saved = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    saved.push({ name, email, message, date: new Date().toISOString() });
    await fs.writeFile(dataFile, JSON.stringify(saved, null, 2));
    response.json({ message: 'Feedback saved.' });
  } catch (error) { response.status(500).json({ error: 'Could not save feedback.' }); }
});
app.listen(3000, () => console.log('Lingua is running at http://localhost:3000'));
