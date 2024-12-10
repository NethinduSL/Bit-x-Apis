const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Initialize the Express app
const apiFolderPath = path.join(__dirname, 'API'); // Path to the API folder

// Dynamically load all route files in the API folder
fs.readdirSync(apiFolderPath).forEach(file => {
    const filePath = path.join(apiFolderPath, file);

    // Ensure the file is a JavaScript file
    if (file.endsWith('.js')) {
        try {
            const routes = require(filePath);

            // Check if the file exports a router or function
            if (typeof routes === 'function') {
                // Attach routes with app instance
                routes(app);
            } else if (routes && typeof routes === 'object' && routes.stack) {
                // Attach an exported router
                app.use(routes);
            } else {
                console.warn(`File ${file} does not export a valid route`);
            }
        } catch (error) {
            console.error(`Error loading route file ${file}:`, error.message);
        }
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Bit x API server is running!');
});

// Export the app for Vercel or other cloud platforms
module.exports = app;
