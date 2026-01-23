const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

/* ---------- FONT FINDER (ttf / TTF) ---------- */
function findFontFile(fontDir, fontName) {
    const files = fs.readdirSync(fontDir);
    return files.find(f => f.toLowerCase() === `${fontName.toLowerCase()}.ttf`);
}

/* ---------- MAIN FUNCTION ---------- */
async function textImage(
    query,
    fontName = 'sans',
    fontSize = 200,
    align = 'center',
    color = '#000000',
    style = ''
) {
    if (!query) throw new Error('Query parameter "q" is required');

    /* ---------- SPLIT TEXT (FIXES YOUR ERROR) ---------- */
    const lines = query.split(/\r?\n/);

    /* ---------- STYLE FLAGS ---------- */
    const isBold = style.includes('b');
    const isItalic = style.includes('i');
    const isUnderline = style.includes('u');

    /* ---------- LOAD FONT ---------- */
    const fontDir = path.join(__dirname, 'Font');
    const fontFile = findFontFile(fontDir, fontName);
    if (!fontFile) throw new Error(`Font "${fontName}" not found`);

    registerFont(path.join(fontDir, fontFile), { family: fontName });

    /* ---------- MEASURE ---------- */
    const tempCanvas = createCanvas(10, 10);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `${fontSize}px "${fontName}"`;

    let maxWidth = 0;
    lines.forEach(line => {
        maxWidth = Math.max(maxWidth, tempCtx.measureText(line).width);
    });

    const lineHeight = fontSize * 1.2;
    const width = Math.ceil(maxWidth + fontSize * 0.6);
    const height = Math.ceil(lines.length * lineHeight + fontSize * 0.3);

    /* ---------- CANVAS ---------- */
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px "${fontName}"`;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    let xPos = width / 2;
    if (align === 'left') xPos = fontSize * 0.3;
    if (align === 'right') xPos = width - fontSize * 0.3;

    /* ---------- DRAW TEXT ---------- */
    lines.forEach((line, index) => {
        const yPos = index * lineHeight + fontSize * 0.15;

        ctx.save();

        /* FAKE ITALIC */
        if (isItalic) ctx.transform(1, 0, -0.3, 1, 0, 0);

        /* FAKE BOLD */
        const offsets = isBold ? [0, 1.2, 2.4] : [0];
        offsets.forEach(offset => {
            let drawX = xPos + offset;
            if (isItalic) drawX += yPos * 0.3;
            ctx.fillText(line, drawX, yPos);
        });

        ctx.restore();

        /* UNDERLINE */
        if (isUnderline) {
            const textWidth = ctx.measureText(line).width;
            let startX = xPos - textWidth / 2;
            if (align === 'left') startX = xPos;
            if (align === 'right') startX = xPos - textWidth;

            const underlineY = yPos + fontSize + 6;
            ctx.beginPath();
            ctx.moveTo(startX, underlineY);
            ctx.lineTo(startX + textWidth, underlineY);
            ctx.lineWidth = Math.max(2, fontSize * 0.06);
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    });

    const buffer = canvas.toBuffer('image/png');

    return {
        status: true,
        image: `data:image/png;base64,${buffer.toString('base64')}`
    };
}

module.exports = { textImage };
