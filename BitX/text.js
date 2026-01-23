// BitX/text.js
// Sinhala → Wijesekara typing-style converter (correct vowel positions)

const consonants = {
  'ක':'l','ඛ':'L','ග':'.','ඝ':'>',
  'ච':'c','ඡ':'P','ජ':'j','ඣ':'C',
  'ට':'g','ඨ':'G','ඩ':'v','ඪ':'V',
  'ත':';','ථ':':','ද':'o','ධ':'O',
  'න':'k','ණ':'K','ප':'m','ඵ':'M',
  'බ':'n','භ':'N','ම':'u',
  'ය':'H','ර':'r','ල':',','ළ':'<',
  'ව':'J','ස':'i','ශ':'Y','ෂ':'I',
  'හ':'y','ෆ':'F','ඞ':'J','ඦ':'K'
};

// vowels that go **after consonant**
const postVowels = {
  'ා':'a','ි':'s','ී':'S','ු':'d','ූ':'D','ො':'df','ෝ':'dfa'
};

// vowels that go **before consonant**
const preVowels = {
  'ැ':'q','ෑ':'Q','ෙ':'f','ේ':'fa','ෛ':'ff'
};

// independent vowels
const independentVowels = {
  'අ':'a','ආ':'A','ඇ':'q','ඈ':'Q',
  'ඉ':'s','ඊ':'S','උ':'d','ඌ':'D',
  'එ':'f','ඒ':'fa','ඓ':'ff','ඔ':'df','ඕ':'dfa','ඖ':'ff'
};

// signs
const signs = {'්':'','ං':'x','ඃ':'X'};

function sinhalaToWijesekara(text){
  if(!text) return '';
  let result='';

  for(let i=0;i<text.length;i++){
    const char=text[i];
    const next=text[i+1]||'';

    // independent vowels
    if(independentVowels[char]){
      result+=independentVowels[char];
    }
    // consonants
    else if(consonants[char]){
      let output=consonants[char];

      // check next char
      if(preVowels[next]){
        output=preVowels[next]+output;
        i++;
      } else if(postVowels[next]){
        output+=postVowels[next];
        i++;
      }
      result+=output;
    }
    // dependent vowel alone
    else if(preVowels[char]) result+=preVowels[char];
    else if(postVowels[char]) result+=postVowels[char];
    // signs
    else if(signs[char]!==undefined) result+=signs[char];
    else result+=char;
  }

  return result;
}

module.exports.text=async function(text){
  return sinhalaToWijesekara(text);
};
