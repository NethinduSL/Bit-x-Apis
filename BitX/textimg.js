const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

async function textImage(query, fontName = 'sans', fontSize = 200) {
    if (!query) throw new Error('Query parameter "q" is required');

    // Load font
    const fontPath = path.join(__dirname,'Font', `${fontName}.ttf`);
    if (!fs.existsSync(fontPath)) throw new Error(`Font "${fontName}" not found`);
    registerFont(fontPath, { family: fontName });

    // Create temporary canvas to measure text width
    const tempCanvas = createCanvas(0, 0);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `bold ${fontSize}px "${fontName}"`;
    const textMetrics = tempCtx.measureText(query);
    const textWidth = textMetrics.width;

    // Set canvas width based on text + padding, height = fontSize * 1.5 for vertical padding
    const width = Math.ceil(textWidth + fontSize * 0.5);
    const height = Math.ceil(fontSize * 1.5);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw text
    ctx.fillStyle = '#000';
    ctx.font = `bold ${fontSize}px "${fontName}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(query, width / 2, height / 2);

    // Return image as base64
    const buffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    return {
        status: true,
        text: query,
        font: fontName,
        size: fontSize,
        image: base64Image
    };
}

module.exports = { textImage };
