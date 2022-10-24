export const guessNames = ['A', 'B', 'C', 'D'];
export const maxGuesses = guessNames.length;
export const startingMoves = 4;
export const showScoreFrequency = 50;
export const boardSize = 19;

const pointsPerGuess = 30;

export function getEarnedPoints(correctGuess: number, nGuesses: number) {
  // Points are earned only if the correct guess is one of among the guesses made.
  if (correctGuess < 0 || correctGuess >= nGuesses) {
    return 0;
  }

  return getGuessPoints(correctGuess, nGuesses);
}

export function getGuessPoints(guess: number, nGuesses: number) {
  // For each move the total number of points is fixed and it is distributed among all the guesses so that all guesses have a number
  // of points corresponding to a multiple of the points 'x' attributed to the last guess. Each guess gets strictly more points that the
  // next and the first guess gets nGuesses*x points. Points are rounded to the nearest strictly positive integer.
  const minPoints = 2 * pointsPerGuess / (nGuesses * (nGuesses + 1));
  const earnedPoints = (nGuesses - guess) * minPoints;

  return Math.max(1, Math.round(earnedPoints));
}
