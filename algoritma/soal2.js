/*
  Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, 
  jika ada kata dengan panjang yang sama silahkan ambil salah satu

  Contoh:

  const sentence = "Saya sangat senang mengerjakan soal algoritma"

  longest(sentence) 
  // mengerjakan: 11 character
*/

const sentence = 'Saya sangat senang mengerjakan soal algoritma';

let indicator = 0;
function longest(sentence) {
  const kalimat = sentence.split(' ');
  let indexKata = 0;
  for (let index = 0; index < kalimat.length; index++) {
    const kata = kalimat[index];
    if (kata.length >= indicator) {
      indicator = kata.length;
      indexKata = index;
    }
  }
  return kalimat[indexKata];
}

const kata_terpanjang = longest(sentence);
console.log(kata_terpanjang + ': ' + indicator + ' character');
