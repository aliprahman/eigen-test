/*
  Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"
*/
const kata = 'NEGIE1';
const pecah_kata = kata.split('');
const angka = [];
const huruf = [];
for (let index = 0; index < pecah_kata.length; index++) {
  const char = pecah_kata[index];
  if (Number(char) >= 0) {
    angka.push(char);
  } else {
    huruf.push(char);
  }
}
const balikan_huruf = huruf.reverse().join('');
const gabungkan_angka = angka.join('');
const result = balikan_huruf + gabungkan_angka;

console.log(result);
