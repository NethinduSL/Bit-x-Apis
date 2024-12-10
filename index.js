const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // Initialize the Express app


//╭──────────────────────main──────────────────────╮//
app.get('/', (req, res) => {
    res.json({ Bitx: 'Bit x apis are comming soon ❤️' });
});


app.get('/details', (req, res) => {
   res.json({ message: 'Details from About API' }); 
});



// Export the app for Vercel
module.exports = app;
