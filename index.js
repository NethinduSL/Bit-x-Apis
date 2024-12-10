const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Initialize the Express app


// Root route
app.get('/', (req, res) => {
    res.json('🇱🇰:Bit x API server is running!');
});

app.get('/details', (req, res) => {
    res.json({ message: 'Details from About API' });
});



// Export the app for Vercel
module.exports = app;  fix errors
