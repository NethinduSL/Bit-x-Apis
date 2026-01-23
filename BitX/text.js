// BitX/text.js
// Sinhala Unicode → Wijesekara Converter

function sinhalaToWijesekara(text, type = 1) {
  if (!text) return '';

  const consonants = {
    'ක':'l','ඛ':'L','ග':'.','ඝ':'>',
    'ච':'c','ඡ':'P','ජ':'j','ඣ':'C',
    'ට':'g','ඨ':'G','ඩ':'v','ඪ':'V',
    'ත':';','ථ':':','ද':'o','ධ':'O',
    'න':'k','ණ':'K','ප':'m','ඵ':'M',
    'බ':'n','භ':'N','ම':'u',
    'ය':'H','ර':'r','ල':',','ළ':'<',
    'ව':'J','ස':'i','ශ':'Y','ෂ':'I',
    'හ':'y','ෆ':'F'
  };

  const vowels = {
    'ා':'a','ැ':'q','ෑ':'Q',
    'ි':'s','ී':'S','ු':'d','ූ':'D',
    'ෙ':'f','ේ':'fa','ො':'df','ෝ':'dfa','ෛ':'ff'
  };

  const signs = {'ං':'x','ඃ':'X','්':''};

  const independentVowels = {
    'අ':'a','ආ':'A','ඇ':'q','ඈ':'Q',
    'ඉ':'s','ඊ':'S','උ':'d','ඌ':'D',
    'එ':'f','ඒ':'fa','ඔ':'df','ඕ':'dfa','ඖ':'ff'
  };

  const extendedType2 = {
    'ඞ':'J','ඦ':'K','෴':'￦'
  };

  let result = '';
  let buffer = '';

  for (let i=0; i<text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1] || '';

    // Extended type 2
    if(type === 2 && extendedType2[char]){
      if(buffer) result += buffer;
      buffer = extendedType2[char];
      continue;
    }

    // Independent vowels
    if(independentVowels[char]){
      if(buffer) result += buffer;
      result += independentVowels[char];
      buffer = '';
      continue;
    }

    // Consonants
    if(consonants[char]){
      if(buffer) result += buffer;
      buffer = consonants[char];

      // Check for dependent vowel
      if(vowels[nextChar]){
        buffer += vowels[nextChar];
        i++; // skip next char
        result += buffer;
        buffer = '';
      } else if(nextChar === '්'){ // hal kirīma
        i++; // skip hal
        result += buffer;
        buffer = '';
      } else {
        // consonant without vowel or hal = implicit 'a'
        buffer += 'a';
        result += buffer;
        buffer = '';
      }
      continue;
    }

    // Dependent vowel alone
    if(vowels[char]){
      result += buffer + vowels[char];
      buffer = '';
      continue;
    }

    // Signs
    if(signs[char] !== undefined){
      result += buffer + signs[char];
      buffer = '';
      continue;
    }

    // Anything else (punctuation, space)
    result += buffer + char;
    buffer = '';
  }

  return result + buffer;
}

// Export as async function to match your route usage
module.exports.text = async function(text, type = 1) {
  return sinhalaToWijesekara(text, type);
};
