const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const apiFolderPath = path.join(__dirname, 'Bitx');

// Load all routes from the 'Bitx' folder
fs.readdirSync(apiFolderPath).forEach(file => {
    const filePath = path.join(apiFolderPath, file);

    if (file.endsWith('.js')) {
        const routes = require(filePath);
        
        if (routes) {
            // Attach all the routes from the file to the app
            app.use(routes);
        }
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('API server is running!');
});

// Export the app for Vercel
module.exports = app;
