// Base URL for API
const API_URL = 'http://localhost:3000/api/data';

// Load content on the website
async function loadContent() {
  const response = await fetch(API_URL);
  const data = await response.json();

  // Update the website with the data
  document.getElementById('name').textContent = `Name: ${data.name}`;
  document.getElementById('date').textContent = `Date: ${data.date}`;
  document.getElementById('time').textContent = `Time: ${data.time}`;
  document.getElementById('location').textContent = `Location: ${data.location}`;
}

// Save new content from the admin panel
async function saveContent() {
  const name = document.getElementById('nameInput').value;
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  const location = document.getElementById('locationInput').value;

  const newData = { name, date, time, location };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });

  alert('Content updated!');
}

// Attach events
if (document.title === 'Website Content') {
  loadContent();
} else if (document.title === 'Admin Panel') {
  document.getElementById('saveButton').addEventListener('click', saveContent);
}
