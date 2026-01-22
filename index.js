const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { runInfoScript } = require('./BitX/info');
const { video } = require('./BitX/download');
const { chatgpt } = require('./BitX/ai');
const { math } = require('./BitX/math'); // Renamed to avoid conflict
const { hiru } = require('./BitX/news');
const { xen } = require("./BitX/xen.js");
const { chatgpt } = require('./BitX/text');

const { mahindaNews } = require('./BitX/mahindaNews');
const { fetchMovies, getDownloadLinks, getDownloadLinkFromPixeldrain } = require('./BitX/movie');

const app = express();

app.use(cors()); // <-- add this
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
app.get('/text', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            status: false,
            error: 'Query parameter "q" is required'
        });
    }

    chatgpt(query)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({
                status: false,
                error: error.message
            });
        });
});

/* Uncomment if you want to use the download route
app.get('/api/download', async (req, res) => {
    try {
        const videoId = req.query.videoId;
        
        if (!videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }
        
        await downloadVideo(videoId, res);
        // Note: downloadVideo function handles the response
    } catch (error) {
        console.error('Download error:', error);
        res.status(error.statusCode || 500).json({ 
            error: true, 
            message: error.message,
            details: error.details 
        });
    }
});


app.get('/Gpt-4', (req, res) => {
    const query = req.query.q;

    chatgpt(query)
        .then((chatgptData) => {
            res.json(chatgptData);
        })
        .catch((error) => {
            res.status(error.statusCode || 500).json({ error: error.message });
        });
});
*/
app.get("/xen", async (req, res) => {
    const query = req.query.q;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // get client IP

    xen(query, ip)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

app.get('/math', (req, res) => {
    const query = req.query.q;

    math(query)
        .then((mathData) => {
            res.json(mathData);
        })
        .catch((error) => {
            res.status(error.statusCode || 500).json({ error: error.message });
        });
});

app.get('/hiru', async (req, res) => {
    try {
        const externalId = req.query.q || 390689;
        const latestNews = await hiru(externalId);
        res.json(latestNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error fetching news:', error.message);
    }
});

app.get('/mahindatv', async (req, res) => {
    try {
        const latestNews = await mahindaNews();
        res.json(latestNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error fetching news:', error.message);
    }
});

// Uncomment if you want to use the gemini route
// app.get('/Gemini', (req, res) => {
//     const query = req.query.q;
//     gemini(query)
//         .then((gemini) => {
//             res.json(gemini);
//         })
//         .catch((error) => {
//             res.status(error.statusCode || 500).json({ error: error.message });
//         });
// });

app.get("/movie", async (req, res) => {
    const query = req.query.query; // Changed to match the expected parameter

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required." });
    }

    try {
        const movies = await fetchMovies(query);
        res.json({ status: "success", data: movies });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.get('/moviedl', async (req, res) => {
    const link = req.query.q;

    try {
        const downloadLinks = await getDownloadLinks(link);
        res.json({ powered: 'By Bitx❤️', downloadLinks });
    } catch (error) {
        res.status(500).send('Error scraping data');
    }
});

app.get('/moviedll', async (req, res) => {
    const link = req.query.q;

    try {
        const { originalLink, apiLink } = await getDownloadLinkFromPixeldrain(link);
        res.json({ powered: 'By Bitx❤️', originalLink, apiLink });
    } catch (error) {
        res.status(500).send('Error scraping data');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

module.exports = app;
