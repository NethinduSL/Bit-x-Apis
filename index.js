const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Initialize the Express app
const apiFolderPath = path.join(__dirname, 'API'); // Path to API folder

// Dynamically load and use all route files in the folder
fs.readdirSync(apiFolderPath).forEach(file => {
    const filePath = path.join(apiFolderPath, file);

    // Ensure the file is a JavaScript file
    if (file.endsWith('.js')) {
        const routes = require(filePath);

        // Check if the file exports a function to attach to the app
        if (typeof routes === 'function') {
            routes(app); // Pass the app instance to the route
        }
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Bit x API server is running!');
});

// Export the app for Vercel
module.exports = app;
