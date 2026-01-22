// BitX/ai.js
// Sinhala Unicode → Wijesekara English Key Converter

function sinhalaToWijesekara(text) {
  if (!text) return '';

  // --- Base consonants (from image) ---
  const consonants = {
    'ක': 'l',
    'ඛ': 'L',
    'ග': '.',
    'ඝ': '>',
    'ච': 'c',
    'ජ': 'j',
    'ට': 'g',
    'ඩ': 'v',
    'ත': 'w',
    'ද': 'o',
    'න': 'k',
    'ප': 'm',
    'බ': 'n',
    'ම': 'u',
    'ය': 'h',
    'ර': 'r',
    'ල': 's',
    'ව': 'j',
    'ස': 'i',
    'හ': 'y',
    'ළ': 'f',
    'ග': '.'
  };

  // --- Vowel signs ---
  const vowels = {
    'ා': 'a',
    'ැ': 'A',
    'ෑ': 'AA',
    'ි': 's',
    'ී': 'S',
    'ු': 'd',
    'ූ': 'D',
    'ෙ': 'f',
    'ේ': 'fa',
    'ො': 'df',
    'ෝ': 'dfa',
    'ෛ': 'ff',
    'ං': 'x',
    '්': '' // hal kirima
  };

  // --- Independent vowels ---
  const independentVowels = {
    'අ': 'a',
    'ආ': 'A',
    'ඉ': 's',
    'ඊ': 'S',
    'උ': 'd',
    'ඌ': 'D',
    'එ': 'f',
    'ඒ': 'fa',
    'ඔ': 'df',
    'ඕ': 'dfa'
  };

  let result = '';
  let buffer = '';

  for (let char of text) {
    if (consonants[char]) {
      buffer = consonants[char];
    } else if (vowels[char]) {
      buffer += vowels[char];
      result += buffer;
      buffer = '';
    } else if (independentVowels[char]) {
      result += independentVowels[char];
    } else {
      // space or unknown char
      result += buffer + char;
      buffer = '';
    }
  }

  return result + buffer;
}

// API wrapper
async function chatgpt(query) {
  if (!query) throw new Error('Query is required');

  try {
    const converted = sinhalaToWijesekara(query);

    return {
      status: true,
      Created_by: 'BitX',
      title: 'Sinhala → Wijesekara Converter',
      poweredBy: 'Wijesekara Keyboard Layout',
      response: converted
    };
  } catch (error) {
    console.error('Conversion Error:', error.message);
    throw new Error('Failed to convert text: ' + error.message);
  }
}

module.exports = { chatgpt };
