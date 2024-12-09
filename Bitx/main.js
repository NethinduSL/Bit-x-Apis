const express = require('express');
const router = express.Router();

router.get('/info', (req, res) => {
    res.json({ message: 'Main API info is working' });
});

router.get('/about', (req, res) => {
    res.json({ message: 'About API is working' });
});




const ytSearch = require('yt-search');


router.get('/video', async (req, res) => {
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
            title: video.title,
            viewCount: video.views,
            downloadUrl: video.url,
            thumbnailUrl: video.thumbnail
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video details', message: error.message });
    }
});

module.exports = router;







module.exports = router;
