const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

async function textImage(query, fontName = 'sans', fontSize = 200, align = 'center', color = '#000000') {
    if (!query) throw new Error('Query parameter "q" is required');

    const fontPath = path.join(__dirname, 'Font', `${fontName}.ttf`);
    if (!fs.existsSync(fontPath)) throw new Error(`Font "${fontName}" not found`);
    registerFont(fontPath, { family: fontName });

    const tempCanvas = createCanvas(0, 0);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `bold ${fontSize}px "${fontName}"`;
    const textMetrics = tempCtx.measureText(query);
    const textWidth = textMetrics.width;

    const width = Math.ceil(textWidth + fontSize * 0.5);
    const height = Math.ceil(fontSize * 1.5);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px "${fontName}"`;
    ctx.textAlign = align; // 'left', 'center', 'right'
    ctx.textBaseline = 'middle';

    let xPos = width / 2;
    if (align === 'left') xPos = fontSize * 0.25;
    if (align === 'right') xPos = width - fontSize * 0.25;

    ctx.fillText(query, xPos, height / 2);

    const buffer = canvas.toBuffer('image/png');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    return {
        status: true,
        text: query,
        font: fontName,
        size: fontSize,
        align: align,
        color: color,
        image: base64Image
    };
}

module.exports = { textImage };
