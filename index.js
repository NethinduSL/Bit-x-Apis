const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { runInfoScript } = require('./BitX/info');
const { video } = require('./BitX/download');
const { chatgpt } = require('./BitX/ai');
const { math } = require('./BitX/math');
const { hiru } = require('./BitX/news');
const { xen } = require('./BitX/xen.js');
const { text } = require('./BitX/text');
const { textImage } = require('./BitX/textimg');

const { mahindaNews } = require('./BitX/mahindaNews');
const { fetchMovies, getDownloadLinks, getDownloadLinkFromPixeldrain } = require('./BitX/movie');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/details', (req, res) => {
    res.json({ message: 'Details from About API' });
});

app.get('/info', (req, res) => {
    runInfoScript()
        .then(infoData => res.json(infoData))
        .catch(error => res.status(500).json({ error: 'Failed to fetch info data', message: error.message }));
});

app.get('/video', (req, res) => {
    const query = req.query.q;
    video(query)
        .then(videoData => res.json(videoData))
        .catch(error => res.status(error.statusCode || 500).json({ error: error.message }));
});


app.get("/xen", async (req, res) => {
    const query = req.query.q;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    xen(query, ip)
        .then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/math', (req, res) => {
    const query = req.query.q;
    math(query)
        .then(mathData => res.json(mathData))
        .catch(error => res.status(error.statusCode || 500).json({ error: error.message }));
});

app.get('/hiru', async (req, res) => {
    try {
        const externalId = req.query.q || 390689;
        const latestNews = await hiru(externalId);
        res.json(latestNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/mahindatv', async (req, res) => {
    try {
        const latestNews = await mahindaNews();
        res.json(latestNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/movie", async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required." });

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

// -------------------------
// New /textimg route
// -------------------------
app.get('/textimg', async (req, res) => {
    const query = req.query.q;
    const font = req.query.font || 'sans';
    const size = parseInt(req.query.size) || 200;
    const align = req.query.align || 'center';
    const color = req.query.color || '#000000';
    const style = req.query.s || ''; // b, i, u, bi, etc.

    try {
        const result = await textImage(
            query,
            font,
            size,
            align,
            color,
            style
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
});

app.get('/text', (req, res) => {
    const query = req.query.q;
    const type = parseInt(req.query.type) || 1; // Default to 1 if not provided

    if (!query) {
        return res.status(400).json({ status: false, error: 'Query parameter "q" is required' });
    }

    text(query, type)
        .then(data => res.json(data))
        .catch(error => res.status(500).json({ status: false, error: error.message }));
});


app.get('/fonts', (req, res) => {
    const fontDir = path.join(__dirname, 'BitX/Font');

    fs.readdir(fontDir, (err, files) => {
        if (err) {
            return res.status(500).json({ status: false, error: err.message });
        }

        // Filter .ttf files and remove extension
        const fonts = files
            .filter(file => path.extname(file).toLowerCase() === '.ttf')
            .map(file => path.basename(file, '.ttf'));

        res.json({
            status: true,
            fonts
        });
    });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

module.exports = app;
