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


app.get('/info', (req, res) => {
    res.json({
        "status": "success",
        "message": "Welcome to our API! Here are some important details:",
        "data": {
            "team_members": [
                {
                    "name": "Nethindu Thaminda",
                    "role": "Lead Developer 🖥️",
                    "bio": "Nethindu is a passionate software engineer with experience in web development, machine learning, and system architecture. He enjoys solving complex problems and building efficient solutions.",
                    "skills": ["JavaScript", "Node.js", "MongoDB", "React", "Python"],
                    "contact": {
                        "email": "nethindu@example.com",
                        "linkedin": "https://linkedin.com/in/nethinduthaminda"
                    }
                },
                {
                    "name": "Jithula Bashitha",
                    "role": "Lead Developer😎",
                    "bio": "Jithula is an experienced UI/UX designer, focusing on creating visually appealing and user-friendly interfaces. She has a keen eye for detail and enjoys optimizing designs for both aesthetics and functionality.",
                   "skills": ["JavaScript", "Node.js", "MongoDB", "React", "Python"],
                    "contact": {
                        "email": "jithula@example.com",
                        "linkedin": "https://linkedin.com/in/jithulabashitha"
                    }
                }
            ],
            "project_details": {
                "name": "Tech Innovations 🚀",
                "description": "A cutting-edge platform aimed at solving real-world problems using technology. Our goal is to provide solutions that are both innovative and practical.",
                "status": "In Progress 🛠️",
                "expected_launch": "2025-12-01"
            }
        },
        "footer": {
            "note": "Stay tuned for more updates! ✨",
            "social_media": {
                "twitter": "https://twitter.com/TechInnovations 🐦",
                "facebook": "https://facebook.com/TechInnovations 📘",
                "instagram": "https://instagram.com/TechInnovations 📸"
            }
        }
    });
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




const fg = require('api-dylux');

app.get('/video2', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const searchResults = await fg.search(query);

        if (!searchResults || searchResults.length === 0) {
            return res.status(404).json({ error: 'No videos found for the search query' });
        }

        const video = searchResults[0];
        const videoUrl = video.url;
        const down = await fg.yta(videoUrl);
        const downloadUrl = down.dl_url;

        const response = {
            powered: 'By Bitx❤️',
            title: video.title,
            description: video.description,
            viewCount: video.views,
            downloadUrl: downloadUrl,
            thumbnailUrl: video.thumbnail
        };

        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch video details', message: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});





// Export the app for deployment on platforms like Vercel
module.exports = app;
