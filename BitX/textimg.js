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
    
    /* ---------- SPLIT TEXT ---------- */
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
    
    /* ---------- MEASURE TEXT ---------- */
    const tempCanvas = createCanvas(10, 10);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `${fontSize}px "${fontName}"`;
    
    let maxWidth = 0;
    lines.forEach(line => {
        maxWidth = Math.max(maxWidth, tempCtx.measureText(line).width);
    });
    
    const lineHeight = fontSize * 1.3;
    const padding = fontSize * 0.5; // 10% padding on each side
    const width = Math.ceil(maxWidth + padding * 2);
    const height = Math.ceil(lines.length * lineHeight + padding * 2);
    
    /* ---------- CREATE CANVAS ---------- */
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px "${fontName}"`;
    ctx.textBaseline = 'top';
    
    // ✅ SET TEXT ALIGNMENT
    ctx.textAlign = align;
    
    // Calculate X position based on alignment
    let xPos = padding; // left
    if (align === 'center') xPos = width / 2;
    if (align === 'right') xPos = width - padding;
    
    /* ---------- DRAW TEXT ---------- */
    lines.forEach((line, index) => {
        const yPos = padding + index * lineHeight;
        
        ctx.save();
        
        // Fake Italic
        if (isItalic) ctx.transform(1, 0, -0.3, 1, 0, 0);
        
        // Fake Bold
        const offsets = isBold ? [0, 1.2, 2.4] : [0];
        offsets.forEach(offset => {
            let drawX = xPos + offset;
            if (isItalic && align !== 'left') drawX += yPos * 0.3;
            ctx.fillText(line, drawX, yPos);
        });
        
        ctx.restore();
        
        // Underline
        if (isUnderline) {
            const textWidth = ctx.measureText(line).width;
            let startX = xPos;
            if (align === 'center') startX = xPos - textWidth / 2;
            if (align === 'right') startX = xPos - textWidth;
            
            const underlineY = yPos + fontSize * 0.95;
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
