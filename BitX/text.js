// BitX/text.js
// Sinhala Unicode → Wijesekara English Key Converter
// Based on SLS 1134:2004 (Wijesekara Layout)

function sinhalaToWijesekara(text) {
  if (!text) return '';

  // Base consonants
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
    'ා': 'a',
    'ැ': 'q',
    'ෑ': 'Q',
    'ි': 's',
    'ී': 'S',
    'ු': 'd',
    'ූ': 'D',
    'ෙ': 'f',
    'ේ': 'fa',
    'ො': 'df',
    'ෝ': 'dfa',
    'ෛ': 'ff'
  };

  // Special signs
  const signs = {
    'ං': 'x',
    'ඃ': 'X',
    '්': '' // hal kirīma
  };

  // Independent vowels
  const independentVowels = {
    'අ': 'a',
    'ආ': 'A',
    'ඇ': 'q',
    'ඈ': 'Q',
    'ඉ': 's',
    'ඊ': 'S',
    'උ': 'd',
    'ඌ': 'D',
    'එ': 'f',
    'ඒ': 'fa',
    'ඔ': 'df',
    'ඕ': 'dfa',
    'ඖ': 'ff'
  };

  let result = '';
  let buffer = '';

  for (let char of text) {
    if (consonants[char]) {
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

async function text(query) {
  if (!query) throw new Error('Query is required');

  try {
    const converted = sinhalaToWijesekara(query);

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
