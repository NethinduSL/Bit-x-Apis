const express = require('express');
const router = express.Router();


router.get('/details', (req, res) => {
    res.json({ message: 'Details from About API' });
});

module.exports = router;
