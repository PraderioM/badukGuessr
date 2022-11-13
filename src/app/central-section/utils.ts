const matrixInverse = require('matrix-inverse');

export const guessNames = ['A', 'B', 'C', 'D'];
export const maxGuesses = guessNames.length;
export const startingMoves = 4;
export const showScoreFrequency = 50;
export const boardSize = 19;
export const maxGuessSquareSize = 5;
export const maxHintSquareSize = 5;

export const minShowScoreFrequency = startingMoves + 1;
export const maxShowScoreFrequency = 1000;

export const pointsPerSingleGuess = 100;


export function getEarnedPoints(correctGuess: number, nGuesses: number, splitFactor: number = 1) {
  // Points are earned only if the correct guess is one of among the guesses made.
  if (correctGuess < 0 || correctGuess >= nGuesses) {
    return 0;
  }

  return getGuessPoints(correctGuess, nGuesses, splitFactor);
}

export function getGuessPoints(guess: number, nGuesses: number, splitFactor: number = 1) {
  return getAllGuessPoints(nGuesses, splitFactor)[guess];
}

export function getAllGuessPoints(nGuesses: number, splitFactor: number = 1) {
  // Get all points without rounding.
  const guessPoints = getGuessPointList(nGuesses);

  // Round points and give them a minimum of 1 in length.
  for (let i = 0; i < guessPoints.length; i++) {
    guessPoints[i] = Math.max(0, Math.round(guessPoints[i]/splitFactor));
  }

  return guessPoints;
}

function getGuessPointList(n: number) {
  const pointSums = [pointsPerSingleGuess];
  let allPoints: number[] = [pointsPerSingleGuess];

  while (pointSums.length < n) {
    const LEMatrix = getLEMatrix(pointSums.length + 1);
    const inverse = matrixInverse(LEMatrix);
    pointSums.push(getLastSum(pointSums));
    allPoints = multiplyMatrices(inverse, pointSums);
    pointSums.pop();
    pointSums.push(addList(allPoints));
  }

  return allPoints;
}


function getLEMatrix(n: number, threshold: number = 1 / 2) {
  const matrix = [];
  for (let i = 0; i < n - 1; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      if (j <= i) {
        row.push(1);
      } else {
        row.push(threshold);
      }
    }
    matrix.push(row);
  }

  // Last row is used in order to keep the choices evened out, so I try to match alternate sum with n / 2 times the last value.
  matrix.push(getLastRow(n));

  return matrix;
}

function getLastRow(n: number) {
  const lastRow = [];
  for (let i = 0; i < n - 1; i++) {
    lastRow.push(0);
  }
  lastRow.push(1);
  return lastRow;
}

function getLastSum(prevSums: number[]) {
  return prevSums[0] * 0.5 ** (prevSums.length);
}

function multiplyMatrices(matrix: number[][], column: number[]) {
  const result = [];
  for (const row of matrix) {
    let sum = 0;
    for (let j = 0; j < column.length; j++) {
      sum += row[j] * column[j];
    }
    result.push(sum);
  }
  return result;
}

function addList(l: number[]) {
  let sum = 0;
  for (const x of l) {
    sum += x;
  }
  return sum;
}
