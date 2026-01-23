const {
    fmAbayaToUnicode,
    dlManelToUnicode,
    baminitoUnicode,
    kaputaToUnicode,
    amaleeToUnicode,
    thibusToUnicode
} = require('sinhala-unicode-coverter');

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

module.exports = convertText; // export function directly
