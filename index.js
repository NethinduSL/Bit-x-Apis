const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { runInfoScript } = require('./BitX/info');
const { video, getYouTubeMp3 } = require('./BitX/download');
const { chatgpt } = require('./BitX/ai');
const { math } = require('./BitX/math');
const { hiru } = require('./BitX/news');
const { xen } = require('./BitX/xen.js');
const text = require('./BitX/text');
const { textImage } = require('./BitX/textimg');

const { mahindaNews } = require('./BitX/mahindaNews');
const {
  fetchMovies,
  getDownloadLinks,
  getDownloadLinkFromPixeldrain
} = require('./BitX/movie');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/details', (req, res) => {
  res.json({ message: 'Details from About API' });
});

app.get('/info', async (req, res) => {
  try {
    const infoData = await runInfoScript();
    res.json(infoData);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch info data',
      message: error.message
    });
  }
});

// -------------------------
// YouTube search
// -------------------------
app.get('/video', async (req, res) => {
  try {
    const query = req.query.q;
    const data = await video(query);
    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// -------------------------
// ✅ NEW: YouTube MP3 download
// -------------------------
app.get('/download', async (req, res) => {
  try {
    let youtubeUrl = req.query.url;
    const videoId = req.query.videoId;

    if (!youtubeUrl && !videoId) {
      return res.status(400).json({
        status: false,
        error: 'url or videoId is required'
      });
    }

    if (!youtubeUrl && videoId) {
      youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    const result = await getYouTubeMp3(youtubeUrl);

    res.json({
      powered: 'By Bitx❤️',
      ...result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// -------------------------
app.get('/xen', async (req, res) => {
  const query = req.query.q;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const result = await xen(query, ip);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/math', async (req, res) => {
  try {
    const result = await math(req.query.q);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
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

app.get('/movie', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const movies = await fetchMovies(query);
    res.json({ status: 'success', data: movies });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/moviedl', async (req, res) => {
  try {
    const downloadLinks = await getDownloadLinks(req.query.q);
    res.json({ powered: 'By Bitx❤️', downloadLinks });
  } catch (error) {
    res.status(500).send('Error scraping data');
  }
});

app.get('/moviedll', async (req, res) => {
  try {
    const { originalLink, apiLink } =
      await getDownloadLinkFromPixeldrain(req.query.q);

    res.json({
      powered: 'By Bitx❤️',
      originalLink,
      apiLink
    });
  } catch (error) {
    res.status(500).send('Error scraping data');
  }
});

// -------------------------
app.get('/textimg', async (req, res) => {
  try {
    const result = await textImage(
      req.query.q,
      req.query.font || 'sans',
      parseInt(req.query.size) || 200,
      req.query.align || 'center',
      req.query.color || '#000000',
      req.query.s || ''
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
  const type = parseInt(req.query.type) || 1;

  if (!query) {
    return res.status(400).json({
      status: false,
      error: 'Query parameter "q" is required'
    });
  }

  try {
    const result = text(query, type);
    res.json({ status: true, response: result });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

app.get('/fonts', (req, res) => {
  const fontDir = path.join(__dirname, 'BitX/Font');

  fs.readdir(fontDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }

    const fonts = files
      .filter(f => path.extname(f).toLowerCase() === '.ttf')
      .map(f => path.basename(f, '.ttf'));

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
