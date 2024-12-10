const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Initialize the Express app


// Root route
app.get('/', (req, res) => {
    res.send('Bit x API server is running!');
});

// Export the app for Vercel
module.exports = app;
