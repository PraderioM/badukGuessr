import {Game} from './models';
import {leeSedolHongJansik20030423} from './games/lee.sedol.hong.jansik.2003.04.23';
import {parkSeungmunOhKyuchul20221024} from './games/park.seungmun.oh.kyuchul.2022.10.24';
import {otakeYuHsuChiayuan20221024} from './games/otake.yu.hsu.chiayuan.2022.10.24';
import {yooChanghyukKimChongsu20221021} from './games/yoo.changhyuk.kim.chongsu.2022.10.21';
import {linShuyangLinJunyan20221023} from './games/lin.shuyang.lin.junyan.2022.10.23';
import {seoBongsooKimSoojang20221024} from './games/seo.bongsoo.kim.soojang.2022.10.24';
import {xuHaohongWangYuanjun20221021} from './games/xu.haohong.wang.yuanjun.2022.10.21';
import {yangKaiwenTongMengcheng20221024} from './games/yang.kaiwen.tong.mengcheng.2022.10.24';
import {liQinchengShiYue20221024} from './games/li.qincheng.shi.yue.2022.10.24';
import {paekSeonghoAnKwanwuk20221021} from './games/paek.seongho.an.kwanwuk.2022.10.21';
import {yuZhengqiIyamaYuta20221021} from './games/yu.zhengqi.iyama.yuta.2022.10.21';

const startingDate = new Date(2022, 9, 24, 0, 0, 0, 0);
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


// Todo find a way to get these games from go4go.
const allGames: Game[] = [
  leeSedolHongJansik20030423,
  parkSeungmunOhKyuchul20221024,
  otakeYuHsuChiayuan20221024,
  yooChanghyukKimChongsu20221021,
  linShuyangLinJunyan20221023,
  seoBongsooKimSoojang20221024,
  xuHaohongWangYuanjun20221021,
  yangKaiwenTongMengcheng20221024,
  liQinchengShiYue20221024,
  paekSeonghoAnKwanwuk20221021,
  yuZhengqiIyamaYuta20221021
];
