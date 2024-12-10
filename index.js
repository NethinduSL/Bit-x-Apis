const express = require('express');
const fs = require('fs');
const path = require('path');
const ytSearch = require('yt-search'); // Importing yt-search correctly

const app = express(); // Initialize the Express app

// Middleware to parse incoming requests
app.use(express.json()); // Parse JSON bodies

//╭──────────────────────main──────────────────────╮//
app.get('/', (req, res) => {
    res.json({ Bitx: 'Bit x apis are comming soon ❤️' });
});

app.get('/details', (req, res) => {
    res.json({ message: 'Details from About API' });
});

//╭──────────────────────fact──────────────────────╮//


// Export the app for deployment on platforms like Vercel
module.exports = app;
