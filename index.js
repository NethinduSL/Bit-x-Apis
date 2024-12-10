const express = require('express');
const fs = require('fs');
const path = require('path');
const ytSearch = require('yt-search'); // Importing yt-search correctly

const app = express(); // Initialize the Express app

// Middleware to parse incoming requests
app.use(express.json()); // Parse JSON bodies

//╭──────────────────────main──────────────────────╮//
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/details', (req, res) => {
    res.json({ message: 'Details from About API' });
});

//╭──────────────────────fact──────────────────────╮//

app.get('/video', async (req, res) => {
    const query = req.query.q;  // Get the search query from the URL parameter
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        // Perform the video search using the query parameter
        const results = await ytSearch(query);
        
        if (!results || results.videos.length === 0) {
            return res.status(404).json({ error: 'No videos found for the search query' });
        }
        // Extract the details of the first video in the search results
        const video = results.videos[0];
        // Send the video details as a response
        res.json({
            powered: 'By Bitx❤️',
            title: video.title,
            viewCount: video.views,
            downloadUrl: video.url,
            thumbnailUrl: video.thumbnail
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video details', message: error.message });
    }
});

// Export the app for deployment on platforms like Vercel
module.exports = app;
