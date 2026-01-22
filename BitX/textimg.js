const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

async function textImage(query, fontName = 'sans') {
    if (!query) throw new Error('Query parameter "q" is required');

    const fontPath = path.join(__dirname, 'fonts', `${fontName}.ttf`);
    if (!fs.existsSync(fontPath)) throw new Error(`Font "${fontName}" not found`);

    registerFont(fontPath, { family: fontName });

    const width = 800;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#000';
    ctx.font = `bold 80px "${fontName}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(query, width / 2, height / 2);

    const buffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    return {
        status: true,
        text: query,
        font: fontName,
        image: base64Image
    };
}

module.exports = { textImage };
