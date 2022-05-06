/*
  Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN Contoh:
  Contoh:

  Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

  diagonal pertama = 1 + 5 + 9 = 15 
  diagonal kedua = 0 + 5 + 7 = 12 

  maka hasilnya adalah 15 - 12 = 3
*/

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

const diagonal1 = [];
const diagonal2 = [];
for (let index = 0; index < matrix.length; index++) {
  const element = matrix[index];
  const halfMatrix = Math.floor(matrix.length / 2);
  const halfElement = Math.floor(element.length / 2);
  if (index === 0) {
    diagonal1.push(element[0]);
    diagonal2.push(element[element.length - 1]);
  } else if (index === halfMatrix) {
    diagonal1.push(element[halfElement]);
    diagonal2.push(element[halfElement]);
  } else if (index === matrix.length - 1) {
    diagonal1.push(element[element.length - 1]);
    diagonal2.push(element[0]);
  }
}

const sumDiagonal1 = diagonal1.reduce(
  (previousValue, currentValue) => previousValue + currentValue,
  0,
);

const sumDiagonal2 = diagonal2.reduce(
  (previousValue, currentValue) => previousValue + currentValue,
  0,
);

console.log('matrix = ', matrix);
console.log(
  'diagonal pertama = ' + diagonal1.join(' + ') + ' = ' + sumDiagonal1,
);

console.log('diagonal kedua = ' + diagonal1.join(' + ') + ' = ' + sumDiagonal2);

console.log(
  `maka hasilnya adalah ${sumDiagonal1} - ${sumDiagonal2} = ${
    sumDiagonal1 - sumDiagonal2
  }`,
);
