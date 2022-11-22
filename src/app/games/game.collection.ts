const startingDate = new Date(2022, 9, 24, 0, 0, 0, 0);
const startingUTC = getUTCFromDate(startingDate);

function getUTCFromDate(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getGameLinkByIndex(index: number = getDailyGameIndex()) {
  return allGames[index];
}

export function getDailyGameIndex() {
  // Get number of days since code was operational.
  const today = new Date();
  const todayUTC = getUTCFromDate(today);
  const dayDiff = Math.floor((todayUTC - startingUTC ) / (1000 * 60 * 60 * 24));

  // Pick a different game every day and once the full round is done re-start.
  return dayDiff % allGames.length;
}

const allGames: string[] = [
  'assets/lee.sedol.hong.jansik.2003.04.23.f92a052e-84bd-4c10-ae10-e3bfc153a08c.json',
  'assets/park.seungmun.oh.kyuchul.2022.10.24.69cc9807-f576-4eb7-bc2c-fe0d8df6c33b.json',
  'assets/park.seungmun.oh.kyuchul.2022.10.24.69cc9807-f576-4eb7-bc2c-fe0d8df6c33b.json',  // todo replace with otake game.
  'assets/yoo.changhyuk.kim.chongsu.2022.10.21.515bac0b-d877-4c46-8b44-79907b3ac4eb.json',
  'assets/lin.shuyang.lin.junyan.2022.10.23.c94b27ac-e6f8-4dd8-8c9c-8665769ccc1d.json',
  'assets/seo.bongsoo.kim.soojang.2022.10.24.13ace0a8-a05e-43bd-bbbe-12b0d4f1c3dc.json',
  'assets/xu.haohong.wang.yuanjun.2022.10.21.9cf46fe7-ba15-4e21-aafc-5629efedfd23.json',
  'assets/yang.kaiwen.tong.mengcheng.2022.10.24.ce565752-c040-43d8-a8e8-847e751129f7.json',
  'assets/li.qincheng.shi.yue.2022.10.24.5c7f6390-7b06-4bdf-a438-b6668a7dca78.json',
  'assets/paek.seongho.an.kwanwuk.2022.10.21.19d6f02b-bcfd-40c4-b04c-01c44fdae26d.json',
  'assets/yu.zhengqi.iyama.yuta.2022.10.21.c755c4a1-5b8d-481f-abbe-f4522aea8da8.json',
  'assets/yu.zhiying.lee.hyungjin.2022.10.28.62e979d4-7615-4414-9432-07b8c30f56b3.json',
  'assets/konishi.kazuko.yoshihara.yukari.2022.10.27.aa7c6421-50a3-439e-a723-cb61c25c9619.json',
  'assets/li.xuanhao.kim.myounghoon.2022.10.28.f98e077a-fc52-44f2-91c5-afbf308a802b.json',
  'assets/ke.jie.park.junghwan.2022.10.28.eac12e1a-6b4e-4028-8c74-1f4ebe4886dd.json',
  'assets/xie.yimin.nakamura.sumire.2022.10.27.c328fc32-b3e0-4ca2-8039-035b3bdca73a.json',
  'assets/tang.weixing.yoo.ohseong.2022.10.27.43c32202-dba8-4d2b-8208-4dc503457ed0.json',
  'assets/yamashita.keigo.takao.shinji.2022.10.27.5f638d5b-3400-4758-ae19-403b115654a3.json',
  'assets/dang.yifei.byun.sangil.2022.10.28.12f955ec-61ae-43f7-9457-6ab8576ae614.json',
  'assets/fan.tingyu.kang.dongyun.2022.10.28.84caefb8-7862-4ca9-b562-9105a640e3cc.json',
  'assets/yang.dingxin.shin.minjun.2022.10.27.9d4e0394-48ba-4dfd-be02-c4fcc60be67f.json',
  'assets/lin.junyan.li.wei.2022.10.28.a16ecba2-b26d-478a-8ed8-06d51dad8ba2.json',
  'assets/heo.seohyun.kim.kyeongeun.2022.10.29.31e657e6-59b3-49f4-a8e1-88c9370c8ff1.json',
  'assets/lee.hyungjin.nakamura.sumire.2022.11.01.a276b103-43e0-4b5d-9ee1-0aefe57b3390.json',
  'assets/kim.chanwu.choi.kyubyeong.2022.11.02.19ed4b09-1cb5-4989-92c1-3466a379ee33.json',
  'assets/kim.kihun.cho.daehyeon.2022.11.02.bcce70e5-bbe8-42dc-984d-eca37a0b4295.json',
  'assets/iyama.yuta.shibano.toramaru.2022.11.02.707b7d8d-f9cf-4da3-9515-9565a2904220.json',
  'assets/park.seungmun.yoo.changhyuk.2022.11.02.9a40f426-a0a1-4d93-a52a-a4d0e7c6d40f.json',
  'assets/tang.weixing.kim.myounghoon.2022.10.31.2571ff1f-24ea-4f3a-b9b0-9b9baa649d31.json',
  'assets/kim.ilhwan.kim.chongsu.2022.11.02.da06b1b4-e22a-42c3-a8a6-f3de8615043f.json',
  'assets/kwon.hyojin.an.kwanwuk.2022.11.02.e706a3aa-5b4c-44a9-b82f-c9ab6256b886.json',
  'assets/byun.sangil.gu.zihao.2022.10.31.35eb064c-57cc-4395-9a0b-d54ee3781cde.json',
  'assets/choi.jeong.yang.dingxin.2022.11.03.f81096c1-5acb-4b4f-8c35-301e0eab47de.json',
  'assets/choi.jeong.byun.sangil.2022.11.04.8ca25556-9ab6-4341-825a-a787539a5743.json',
  'assets/lee.hyungjin.byun.sangil.2022.11.03.51d566a2-559c-4d5d-be36-f8ec031a7be1.json',
  'assets/choi.jeong.shin.jinseo.2022.11.08.45df582b-d06f-418d-8950-b9cb0aff6cf8.json',
  'assets/shin.jinseo.choi.jeong.2022.11.07.b1b71f61-74ca-484a-8980-acedee27c15b.json',
  'assets/shin.jinseo.kim.myounghoon.2022.11.05.d492d87e-ef06-44bc-8abb-793cdaef0059.json',
  'assets/kim.seungjun.seo.bongsoo.2022.11.18.a15b7308-8ee4-4a02-b558-3c8ddf07b1fe.json',
  'assets/kim.hyeoimin.choi.jeong.2022.11.18.5c44eb74-19b5-468a-bb72-73f07960de10.json',
  'assets/paek.seongho.oh.kyuchul.2022.11.18.ed5b0a8d-252c-45a3-b1d0-740eb40d34fd.json',
  'assets/yamashita.keigo.shibano.toramaru.2022.11.18.ef44424c-2f09-4451-8ae4-aff4023d4169.json',
  'assets/kim.ilhwan.kim.chanwu.2022.11.18.a6e8b811-3dbd-43ba-bb1e-45655f65116e.json',
  'assets/yu.zhengqi.iyama.yuta.2022.11.18.d2aba32e-eb2b-4eef-ad79-7580ba604700.json',
  'assets/ke.jie.yang.kaiwen.2022.11.18.0aafd408-344c-4ba6-bfa5-4c6bf3b2b247.json',
  'assets/wang.xinghao.dang.yifei.2022.11.18.cef88428-28c7-4f0e-8131-07b5a42468ce.json',
  'assets/gu.zihao.mi.yuting.2022.11.18.4ec8fc97-41a9-4157-9004-f2dea1cc2002.json',
  'assets/tang.weixing.zhao.chenyu.2022.11.18.fc4b3a3a-31ff-45df-807a-a95bf6e7e22b.json',
]
