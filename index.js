const express = require('express');
const fs = require('fs');
const path = require('path');
const { runInfoScript } = require('./BitX/info');
const { fetchVideoDetails } = require('./BitX/video');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/details', (req, res) => {
    res.json({ message: 'Details from About API' });
});




app.get('/info', (req, res) => {
    runInfoScript()
        .then((infoData) => {
            res.json(infoData);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch info data', message: error.message });
        });
});





app.get('/video', (req, res) => {
    const query = req.query.q;

    fetchVideoDetails(query)
        .then((videoData) => {
            res.json(videoData);
        })
        .catch((error) => {
            res.status(error.statusCode || 500).json({ error: error.message });
        });
});




app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

module.exports = app;
