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

// Pre-vowels (before consonant)
const preVowels = {
  'ැ':'q','ෑ':'Q','ෙ':'f','ේ':'fa','ෛ':'ff'
};

// Post-vowels (after consonant)
const postVowels = {
  'ා':'a','ි':'s','ී':'S','ු':'d','ූ':'Qid'  // here we fix long u
};

// Combined vowels (pre+post)
const combinedVowels = {
  'ො':['f','a'],   // “ො” = ෙ + ා
  'ෝ':['f','da'],  // “ෝ” = ෙ + ෛ
  'ෞ':['f','!']    // “ෞ” = ෙ + ෟ
};

// independent vowels
const independentVowels = {
  'අ':'a','ආ':'A','ඇ':'q','ඈ':'Q',
  'ඉ':'s','ඊ':'S','උ':'d','ඌ':'Qid',
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

    if(independentVowels[char]){
      result+=independentVowels[char];
    }
    else if(consonants[char]){
      let output=consonants[char];

      if(preVowels[next]){
        output=preVowels[next]+output;
        i++;
      } else if(postVowels[next]){
        output+=postVowels[next];
        i++;
      } else if(combinedVowels[next]){
        output=combinedVowels[next][0]+output+combinedVowels[next][1];
        i++;
      }

      result+=output;
    }
    else if(preVowels[char]) result+=preVowels[char];
    else if(postVowels[char]) result+=postVowels[char];
    else if(combinedVowels[char]) result+=combinedVowels[char][0]+combinedVowels[char][1];
    else if(signs[char]!==undefined) result+=signs[char];
    else result+=char;
  }

  return result;
}

module.exports.text=async function(text){
  return sinhalaToWijesekara(text);
};
