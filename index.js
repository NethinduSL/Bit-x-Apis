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
const { fetchMovies, getDownloadLinks, getDownloadLinkFromPixeldrain } = require('./BitX/movie');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Home ----------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// ---------- Details ----------
app.get('/details', (req, res) => {
  res.json({ message: 'Details from About API' });
});

// ---------- Info ----------
app.get('/info', async (req, res) => {
  try {
    const infoData = await runInfoScript();
    res.json(infoData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch info data', message: error.message });
  }
});

// ---------- Video Search ----------
app.get('/video', async (req, res) => {
  try {
    const query = req.query.q;
    const data = await video(query);
    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// ---------- YouTube MP3 Download ----------
app.get('/download', async (req, res) => {
  try {
    let youtubeUrl = req.query.url;
    const videoId = req.query.videoId;

    if (!youtubeUrl && !videoId) {
      return res.status(400).json({ status: false, error: 'url or videoId is required' });
    }

    if (!youtubeUrl && videoId) {
      youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    const result = await getYouTubeMp3(youtubeUrl);
    res.json({ powered: 'By Bitx❤️', ...result });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

// ---------- Xen ----------
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

// ---------- Math ----------
app.get('/math', async (req, res) => {
  try {
    const result = await math(req.query.q);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// ---------- Hiru News ----------
app.get('/hiru', async (req, res) => {
  try {
    const externalId = req.query.q || 390689;
    const latestNews = await hiru(externalId);
    res.json(latestNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Mahinda TV ----------
app.get('/mahindatv', async (req, res) => {
  try {
    const latestNews = await mahindaNews();
    res.json(latestNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Movies ----------
app.get('/movie', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required.' });

  try {
    const movies = await fetchMovies(query);
    res.json({ status: 'success', data: movies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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
    const { originalLink, apiLink } = await getDownloadLinkFromPixeldrain(req.query.q);
    res.json({ powered: 'By Bitx❤️', originalLink, apiLink });
  } catch (error) {
    res.status(500).send('Error scraping data');
  }
});

// ---------- Text Image ----------
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
    res.status(500).json({ status: false, error: err.message });
  }
});

// ---------- Text ----------
app.get('/text', (req, res) => {
  const query = req.query.q;
  const type = parseInt(req.query.type) || 1;

  if (!query) return res.status(400).json({ status: false, error: 'Query parameter "q" is required' });

  try {
    const result = text(query, type);
    res.json({ status: true, response: result });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

// ---------- Fonts ----------
app.get('/fonts', (req, res) => {
  const fontDir = path.join(__dirname, 'BitX/Font');
  fs.readdir(fontDir, (err, files) => {
    if (err) return res.status(500).json({ status: false, error: err.message });

    const fonts = files.filter(f => path.extname(f).toLowerCase() === '.ttf').map(f => path.basename(f, '.ttf'));
    res.json({ status: true, fonts });
  });
});

// ---------- ✅ Visits Route ----------
app.get('/visits', (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'url query is required' });

    const now = new Date();
    const filePath = path.join(__dirname, 'visits.json');

    // Load existing visits
    let visitsData = {};
    if (fs.existsSync(filePath)) {
      try {
        visitsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch {
        visitsData = {};
      }
    }

    // Initialize array for URL
    if (!visitsData[url]) visitsData[url] = [];

    // Add current visit
    visitsData[url].push(now.getTime());

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(visitsData, null, 2));

    const timestamps = visitsData[url];
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const dailyVisits = timestamps.filter(ts => ts >= startOfDay).length;
    const monthlyVisits = timestamps.filter(ts => ts >= startOfMonth).length;
    const totalVisits = timestamps.length;

    res.json({ url, dailyVisits, monthlyVisits, totalVisits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
