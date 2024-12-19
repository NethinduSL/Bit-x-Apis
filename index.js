const express = require('express');
const fs = require('fs');
const path = require('path');
const { runInfoScript } = require('./BitX/info');
const { video } = require('./BitX/download');
const { chatgpt } = require('./BitX/ai');
const { hiru } = require('./BitX/news');
const { fetchMovies, getDownloadLinks, getDownloadLinkFromPixeldrain } = require('./BitX/movie');

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
        .then((chatgptData) => {
            res.json(chatgptData);
        })
        .catch((error) => {
            res.status(error.statusCode || 500).json({ error: error.message });
        });
});

app.get('/hiru', async (req, res) => { // Mark the function as 'async'
    try {
        const externalId = req.query.q || 390689;
        const latestNews = await hiru(externalId); 
        res.json(latestNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error fetching news:', error.message);
    }
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




app.get("/movie", async (req, res) => {
  const { query } = req.query;

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
