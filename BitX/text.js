const {
    fmAbayaToUnicode,
    dlManelToUnicode,
    baminitoUnicode,
    kaputaToUnicode,
    amaleeToUnicode,
    thibusToUnicode,
    unicodeToDlManel,
    unicodeToBamini,
    unicodeToKaputa
} = require('sinhala-unicode-coverter');

function convertText(text, type = 1) {
    switch(type){
        // normal Unicode → font
        case 1: return unicodeToDlManel(text);
        case 2: return unicodeToBamini(text);
        case 3: return unicodeToKaputa(text);

        // font → normal Unicode
        case 4: return kaputaToUnicode(text);
        case 5: return amaleeToUnicode(text);
        case 6: return thibusToUnicode(text);
        case 7: return fmAbayaToUnicode(text);
        case 8: return dlManelToUnicode(text);
        case 9: return baminitoUnicode(text);

        default: return text;
    }
}

module.exports = convertText; // export function directly
