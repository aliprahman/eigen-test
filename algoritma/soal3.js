/*
  Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT
  Contoh:

  INPUT = ['xc', 'dz', 'bbb', 'dz']  
  QUERY = ['bbb', 'ac', 'dz']  

  OUTPUT = [1, 0, 2]
  karena kata 'bbb' terdapat 1 pada INPUT, 
  kata 'ac' tidak ada pada INPUT,
  dan kata 'dz' terdapat 2 pada INPUT
*/

const input = ['xc', 'dz', 'bbb', 'dz'];
const query = ['bbb', 'ac', 'dz'];

const output = [];

for (let index = 0; index < query.length; index++) {
  const targetKata = query[index];

  for (let zindex = 0; zindex < input.length; zindex++) {
    const pencarianKata = input[zindex];
    if (targetKata === pencarianKata) {
      output[index] = output[index] !== undefined ? output[index] + 1 : 1;
    } else {
      if (output[index] === undefined) {
        output[index] = 0;
      }
    }
  }
}

console.log(output);
