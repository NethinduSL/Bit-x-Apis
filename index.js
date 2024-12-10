const express = require('express');
const fs = require('fs');
const path = require('path');
const ytSearch = require('yt-search');


const app = express();

app.use(express.json());

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
                    "bio": "Nethindu is a passionate software engineer with experience in web development, machine learning, and system architecture.",
                    "skills": ["JavaScript", "Node.js", "MongoDB", "React", "Python"],
                    "contact": {
                        "email": "nethindu@example.com",
                        "linkedin": "https://linkedin.com/in/nethinduthaminda"
                    }
                },
                {
                    "name": "Jithula Bashitha",
                    "role": "Lead Developer😎",
                    "bio": "Jithula is an experienced UI/UX designer, focusing on creating visually appealing and user-friendly interfaces.",
                    "skills": ["JavaScript", "Node.js", "MongoDB", "React", "Python"],
                    "contact": {
                        "email": "jithula@example.com",
                        "linkedin": "https://linkedin.com/in/jithulabashitha"
                    }
                }
            ],
            "project_details": {
                "name": "Tech Innovations 🚀",
                "description": "A cutting-edge platform aimed at solving real-world problems using technology.",
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

app.get('/video', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const results = await ytSearch(query);
        
        if (!results || results.videos.length === 0) {
            return res.status(404).json({ error: 'No videos found for the search query' });
        }

        const video = results.videos[0];
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


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

module.exports = app;
