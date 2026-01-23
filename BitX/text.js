// BitX/text.js
// Sinhala Unicode → Wijesekara English Key Converter
// Supports types 1-4

function sinhalaToWijesekara(text, type = 1) {
  if (!text) return '';

  // Base consonants (type 1)
  const consonants = {
    'ක': 'l', 'ඛ': 'L',
    'ග': '.', 'ඝ': '>',
    'ච': 'c', 'ඡ': 'P',
    'ජ': 'j', 'ඣ': 'C',
    'ට': 'g', 'ඨ': 'G',
    'ඩ': 'v', 'ඪ': 'V',
    'ත': ';', 'ථ': ':',
    'ද': 'o', 'ධ': 'O',
    'න': 'k', 'ණ': 'K',
    'ප': 'm', 'ඵ': 'M',
    'බ': 'n', 'භ': 'N',
    'ම': 'u',
    'ය': 'H',
    'ර': 'r',
    'ල': ',', 'ළ': '<',
    'ව': 'J',
    'ස': 'i', 'ශ': 'Y', 'ෂ': 'I',
    'හ': 'y',
    'ෆ': 'F'
  };

  // Dependent vowel signs
  const vowels = {
    'ා': 'a', 'ැ': 'q', 'ෑ': 'Q',
    'ි': 's', 'ී': 'S',
    'ු': 'd', 'ූ': 'D',
    'ෙ': 'f', 'ේ': 'fa',
    'ො': 'df', 'ෝ': 'dfa',
    'ෛ': 'ff'
  };

  // Special signs
  const signs = { 'ං': 'x', 'ඃ': 'X', '්': '' };

  // Independent vowels
  const independentVowels = {
    'අ': 'a', 'ආ': 'A', 'ඇ': 'q', 'ඈ': 'Q',
    'ඉ': 's', 'ඊ': 'S', 'උ': 'd', 'ඌ': 'D',
    'එ': 'f', 'ඒ': 'fa', 'ඔ': 'df', 'ඕ': 'dfa',
    'ඖ': 'ff'
  };

  // Extended type 2 characters
  const extendedType2 = {
    'ඞ': 'J', // example mapping
    'ඦ': 'K',
    '෴': '￦'
    // add more as needed
  };

  let result = '';
  let buffer = '';

  for (let char of text) {
    let mappedChar = '';
    if (type === 2 && extendedType2[char]) {
      mappedChar = extendedType2[char];
      if (buffer) result += buffer;
      buffer = mappedChar;
    }
    else if (consonants[char]) {
      if (buffer) result += buffer;
      buffer = consonants[char];
    }
    else if (vowels[char]) {
      result += buffer + vowels[char];
      buffer = '';
    }
    else if (signs[char] !== undefined) {
      result += buffer + signs[char];
      buffer = '';
    }
    else if (independentVowels[char]) {
      if (buffer) result += buffer;
      result += independentVowels[char];
      buffer = '';
    }
    else {
      result += buffer + char;
      buffer = '';
    }
  }

  return result + buffer;
}

async function text(query, type = 1) {
  if (!query) throw new Error('Query is required');

  try {
    const converted = sinhalaToWijesekara(query, type);

    return {
      status: true,
      Created_by: 'BitX',
      title: 'Sinhala → Wijesekara Converter',
      poweredBy: 'SLS 1134 Wijesekara Keyboard',
      response: converted
    };
  } catch (err) {
    console.error(err);
    throw new Error('Conversion failed');
  }
}

module.exports = { text };
