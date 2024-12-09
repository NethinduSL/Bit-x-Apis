const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const apiFolderPath = path.join(__dirname, 'API');

fs.readdirSync(apiFolderPath).forEach(file => {
    const filePath = path.join(apiFolderPath, file);

    if (file.endsWith('.js')) {
        const routes = require(filePath);
        
        if (routes) {
            // Attach all the routes from the file to the app
            app.use(routes);
        }
    }
});

app.get('/', (req, res) => {
    res.send('API server is running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
