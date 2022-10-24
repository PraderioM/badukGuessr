import {Game} from './models';
import {leeSedolHongJansik20030423} from './lee.sedol.hong.jansik.2003.04.23';

const startingDate = new Date(2022, 10, 24, 0, 0, 0, 0);
const startingUTC = getUTCFromDate(startingDate);

function getUTCFromDate(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDailyGame() {
  // Get number of days since code was operational.
  const today = new Date();
  const todayUTC = getUTCFromDate(today);
  const dayDiff = Math.floor((todayUTC - startingUTC ) / (1000 * 60 * 60 * 24));

  // Pick a different game every day and once the full round is done re-start.
  const gameIndex = dayDiff % allGames.length;
  return allGames[gameIndex];
}


// Todo add more games.
const allGames: Game[] = [leeSedolHongJansik20030423];
