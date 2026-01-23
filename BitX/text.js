const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  fmAbayaToUnicode,
  dlManelToUnicode,
  baminitoUnicode,
  kaputaToUnicode,
  amaleeToUnicode,
  thibusToUnicode
} = require('sinhala-unicode-coverter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Helper function to select converter
function convertText(text, type = 1) {
    switch(type){
        case 1: return fmAbayaToUnicode(text);
        case 2: return dlManelToUnicode(text);
        case 3: return baminitoUnicode(text);
        case 4: return kaputaToUnicode(text);
        case 5: return amaleeToUnicode(text);
        case 6: return thibusToUnicode(text);
        default: return text;
    }
}

// API endpoint
app.get('/text', async (req, res) => {
    const query = req.query.q;
    const type = parseInt(req.query.type) || 1;

    if (!query) {
        return res.status(400).json({ status: false, error: 'Query parameter "q" is required' });
    }

    try {
        const result = convertText(query, type);
        res.json({ status: true, response: result });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
