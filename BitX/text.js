// BitX/text.js
// Sinhala → Wijesekara full typing-style converter

const consonants = {
  'ක':'l','ඛ':'L','ග':'.','ඝ':'>','ඞ':'J','ඦ':'K',
  'ච':'c','ඡ':'P','ජ':'j','ඣ':'C','ඤ':'[','ඥ':'{',
  'ට':'g','ඨ':'G','ඩ':'v','ඪ':'V','ණ':'K','න':'k',
  'ප':'m','ඵ':'M','බ':'n','භ':'N','ම':'u','ය':'H',
  'ර':'r','ල':',','ළ':'<','ව':'J','ස':'i','ශ':'Y',
  'ෂ':'I','හ':'y','ෆ':'F'
};

const independentVowels = {
  'අ':'a','ආ':'A','ඇ':'q','ඈ':'Q','ඉ':'s','ඊ':'S',
  'උ':'d','ඌ':'Qid','එ':'f','ඒ':'fa','ඓ':'ff',
  'ඔ':'df','ඕ':'dfa','ඖ':'ff'
};

// dependent vowels
const dependentVowels = {
  'ා':'a','ැ':'q','ෑ':'Q','ි':'s','ී':'S','ු':'d','ූ':'Qid',
  'ෙ':'f','ේ':'fa','ො':['f','a'],'ෝ':['f','da'],'ෛ':'ff','ෞ':['f','!']
};

// signs
const signs = {'්':'','ං':'x','ඃ':'X'};

// function to handle dependent vowel placement
function getDependentVowel(char){
  if(Array.isArray(dependentVowels[char])) return dependentVowels[char]; // pre+post
  if(dependentVowels[char]) return [dependentVowels[char]]; // post only
  return null;
}

function sinhalaToWijesekara(text){
  if(!text) return '';
  let result='';
  for(let i=0;i<text.length;i++){
    const char=text[i];
    const next=text[i+1]||'';

    // independent vowel
    if(independentVowels[char]){
      result+=independentVowels[char];
    }
    // consonant
    else if(consonants[char]){
      let output=consonants[char];
      // check next char for dependent vowel
      const dep = getDependentVowel(next);
      if(dep){
        if(dep.length===2){ // pre+post
          output=dep[0]+output+dep[1];
        } else { // post only
          output+=dep[0];
        }
        i++; // skip vowel
      }
      result+=output;
    }
    // dependent vowel alone
    else if(dependentVowels[char]){
      const dep = getDependentVowel(char);
      if(dep.length===2) result+=dep[0]+dep[1];
      else result+=dep[0];
    }
    // signs
    else if(signs[char]!==undefined) result+=signs[char];
    else result+=char;
  }
  return result;
}

module.exports.text = async function(text){
  return sinhalaToWijesekara(text);
};
