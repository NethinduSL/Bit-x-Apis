const express = require('express');
const fs = require('fs');
const path = require('path');
const { runInfoScript } = require('./BitX/info');
const { video } = require('./BitX/download');
const { chatgpt} = require('./BitX/ai');
const { hiru} = require('./BitX/news');

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

    video(query)
        .then((videoData) => {
            res.json(videoData);
        
        })
        .catch((error) => {
            res.status(error.statusCode || 500).json({ error: error.message });
        });
});


app.get('/Gpt-4', (req, res) => {
    const query = req.query.q;

    chatgpt(query)
        .then((chatgpt) => {
            res.json(chatgpt);
        })
        .catch((error) => {
            res.status(error.statusCode || 500).json({ error: error.message });
        });
});

app.get('/news', (req, res) => {
    const startId = parseInt(req.query.startId) || 390861; // Default to 390861 if not provided

    fetchNewsBatch(startId)
        .then((result) => {
            res.json(result); // Send back the fetched news
        })
        .catch((error) => {
            res.status(500).json({ error: error.message || 'Failed to fetch news' }); // Error handling
        });
});

//app.get('/Gemini', (req, res) => {
//    const query = req.query.q;
//
//    gemini(query)
//        .then((gemini) => {
//            res.json(gemini);
//        })
//        .catch((error) => {
//            res.status(error.statusCode || 500).json({ error: error.message });
//        });
//});




app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

module.exports = app;
