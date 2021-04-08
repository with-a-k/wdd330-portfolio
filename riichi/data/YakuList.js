import {allCondition, isTileSimple, isTileTerminal} from '../utility.js';

class Yaku {
  constructor(engName, romName, kanjiName, description, closedHan, openHan, tags, checkFunction, generateFunction) {
    this.engName = engName;
    this.romName = romName;
    this.kanjiName = kanjiName;
    this.description = description;
    this.closedValue = closedHan;
    this.openValue = openHan;
    this.tags = tags;
    this.checkFunction = checkFunction;
  }
}

let yakuDict = {
  tsumo: new Yaku(
    "Fully Closed Hand",
    "Menzenchin Tsumohou",
    "門前清自摸和",
    "Achieve this yaku by winning with a completely closed hand; you must never make any calls for another player's tiles and you must win on one of your own draws.",
    1,
    0,
    ["closed", "draws"],
    function checkTsumo(possibility, conditions) {
      //rework once melds are implemented
      return conditions.method === 'tsumo';
    }
  ),
  riichi: new Yaku(
    "Riichi",
    "Riichi",
    "立直",
    `Declare this yaku by betting 1000 points when your hand reaches tenpai.
    Your hand must be closed and there must be enough tiles left to draw that you are able to draw one.
    After declaring riichi, you may not discard tiles other than the one you have just drawn, but if the opportunity arises you may declare a closed quad if doing so would not change your wait.`,
    1,
    0,
    ["closed", "riichi"],
    function checkRiichi(possibility, conditions) {
      //rework once melds are implemented
      return conditions.reach === 'riichi';
    }
  ),
  wriichi: new Yaku(
    "Double Riichi",
    "Daburu Riichi",
    "両立直",
    `Declare this yaku by betting 1000 points if your hand is in tenpai as of your first draw.
    If another player has called a chii, pon, or kan, you cannot declare double riichi but you may declare a single riichi.
    After declaring riichi, you may not discard tiles other than the one you have just drawn, but if the opportunity arises you may declare a closed quad if doing so would not change your wait.`,
    2,
    0,
    ["closed", "riichi", "lucky"],
    function checkWRiichi(possibility, conditions) {
      //rework once melds are implemented
      return conditions.reach === 'wriichi';
    }
  ),
  oneshot: new Yaku(
    "One-Shot",
    "Ippatsu",
    "一発",
    "Achieve this yaku by winning on a riichi on or before the next tile you draw.",
    1,
    0,
    ["closed", "riichi", "lucky"],
    function checkIpptasu(possibility, conditions) {
      return conditions.reach !== 'dama' && conditions.timing === 'ippatsu';
    }
  ),
  simples: new Yaku(
    "All Simples",
    "Tan'yao",
    "断幺九",
    `Achieve this yaku by winning with a hand that has only tiles numbered 2 through 8.
    Certain rulesets may make All Simples closed-only.`,
    1,
    1,
    ["open"],
    function checkSimple(possibility, conditions) {
      let allTiles = possibility.pair.concat(possibility.blocks.reduce(function(acc, block) {
        acc.concat(block.tiles);
      }, []));
      return allCondition(allTiles, function(tile) {
        return isTileSimple(tile);
      });
    }
  ),
  pinfu: new Yaku(
    "Pinfu",
    "Pinfu",
    "平和",
    `Achieve this yaku by winning with a hand that scores 0 fu based on its tiles.
    To achieve this, all four groups of three in the hand must be sequences,
    and the pair cannot be a tile type that would qualify for yakuhai.`,
    1,
    0,
    ["closed", "sequences"]
  ),
  iipeikou: new Yaku(
    "Twin Sequences",
    "Iipeikou",
    "一盃口",
    `Achieve this yaku by winning with a hand that includes two of the exact same sequence.
    If the hand has two copies of two different sequences, this yaku upgrades into Two Twin Sequences.`,
    1,
    0,
    ["closed", "sequences"]
  ),
  straight: new Yaku(
    "Full Straight",
    "Ittsuu",
    "一通",
    "Achieve this yaku by winning with a hand that includes sequences of 123, 456, and 789 in the same suit.",
    2,
    1,
    ["semi-open", "sequences"]
  ),
  yakuhai: new Yaku(
    "Yakuhai",
    "Yakuhai",
    "役牌",
    `A category of yaku based on having a triplet of honor tiles.
    A triplet of any of the three types of dragon tiles is always a yakuhai.
    For a triplet of wind tiles to be a yakuhai, it must match the player's current seat wind or the current round wind.`,
    1,
    1,
    ["open", "honors"]
  ),
  mixseq: new Yaku(
    "Mixed Color Sequence",
    "Sanshoku Doujun",
    "三色同順",
    "Achieve this yaku by winning with the same numbered sequence in all three suits.",
    2,
    1,
    ["semi-open", "sequences"]
  ),
  mixtri: new Yaku(
    "Mixed Color Triplets",
    "Sanshoku Doukou",
    "三色同刻",
    "Achieve this yaku by winning with the same numbered triplet in all three suits.",
    2,
    2,
    ["open", "triplets"]
  ),
  triplets: new Yaku(
    "All Triplets",
    "Toitoihou",
    "対々和",
    "Achieve this yaku by winning with a hand in which all of its groups of three are triplets.",
    2,
    2,
    ["open", "triplets"]
  ),
  sanankou: new Yaku(
    "Three Concealed Triplets",
    "Sanankou",
    "三暗刻",
    "Achieve this yaku by winning with a hand which contains three non-called triplets.",
    2,
    2,
    ["open", "triplets"]
  ),
  sankan: new Yaku(
    "Three Quads",
    "Sankantsu",
    "三槓子",
    "Achieve this yaku by winning with a hand which contains three quads.",
    2,
    2,
    ["open", "triplets"]
  ),
  halfout: new Yaku(
    "Half-Outside Hand",
    "Chanta",
    "全帯",
    "Achieve this yaku by winning with a hand in which all five groups contain a 1, 9, or honor tile.",
    2,
    1,
    ["open", "terminals", "honors"]
  ),
  outside: new Yaku(
    "Full-Outside Hand",
    "Junchan",
    "純全",
    "Achieve this yaku by winning with a hand in which all five groups contain a 1 or 9.",
    3,
    2,
    ["open", "terminals"]
  ),
  ryan: new Yaku(
    "Two Twin Sequences",
    "Ryanpeikou",
    "純全",
    `Achieve this yaku by winning with a hand which contains two copies each of two different sequences.
    Two Twin Sequences hands do not also qualify for Seven Pairs.`,
    3,
    0,
    ["closed", "sequences"],
    function checkRyan(possibility, conditions) {
      groupNames = possibility.blocks.map(function(block) {
        return {
          number: block[0].number,
          suit: block[0].suit,
          type: block[0].nvType
        }
      });
      return groupNames.some(function(group) {
        let otherGroups = groupNames.filter(function(gn) {
          return gn !== group;
        });
        let seqCounter = 0;
        otherGroups.forEach(function(ogp) {
          if (otherGroups.find(function(oogp) {
            return ogp.suit === oogrp.suit && ogp.number+1 === oogrp.number
          }) && otherGroups.find(function(oogp) {
            return ogp.suit === oogrp.suit && ogp.number+2 === oogrp.number
          })) {
            seqCounter++;
          }
        });
        return seqCounter === 2;
      });
    }
  ),
  ssg: new Yaku(
    "Little Three Dragons",
    "Shousangen",
    "小三元",
    "Achieve this yaku by winning with a hand which contains two triplets of dragons and a pair in the third.",
    2,
    2,
    ["open", "honors"]
  ),
  termnhon: new Yaku(
    "Terminals And Honors",
    "Honroutou",
    "混老頭",
    "Achieve this yaku by winning with a hand which contains only 1s, 9s, and honor tiles.",
    2,
    2,
    ["open", "honors", "terminals"],
    function checkHonroto(possibility, conditions) {
      let allTiles = possibility.pair.concat(possibility.blocks.reduce(function(acc, block) {
        acc.concat(block.tiles);
      }, []));
      return allCondition(allTiles, function(tile) {
        return !isTileSimple(tile);
      });
    }
  ),
  halfflush: new Yaku(
    "Half-Flush",
    "Hon'itsu",
    "混一色",
    "Achieve this yaku by winning with a hand which contains only tiles from one suit and honor tiles.",
    3,
    2,
    ["semi-open", "honors", "suits"],
    function checkHonitsu(possibility, conditions) {
      let allTiles = possibility.pair.concat(possibility.blocks.reduce(function(acc, block) {
        acc.concat(block.tiles);
      }, []));
      let suits = groupBy(allTiles, 'suit');
      return suits.length === 2 && suits.includes('h');
    }
  ),
  fullflush: new Yaku(
    "Full Flush",
    "Chin'itsu",
    "混一色",
    "Achieve this yaku by winning with a hand which contains only tiles from one suit.",
    6,
    5,
    ["semi-open", "suits"],
    function checkChinitsu(possibility, conditions) {
      let allTiles = possibility.pair.concat(possibility.blocks.reduce(function(acc, block) {
        acc.concat(block.tiles);
      }, []));
      let suits = groupBy(allTiles, 'suit');
      return suits.length === 1 && !suits.includes('h');
    }
  ),
  chiitoi: new Yaku(
    "Seven Pairs",
    "Chiitoitsu",
    "七対子",
    `Achieve this yaku by winning with a hand which contains seven pairs of tiles.
    Seven Pairs hands are well-formed despite not meeting the typical definition of a well-formed hand.`,
    2,
    0,
    ["closed", "exceptions"]
  ),
  rinshan: new Yaku(
    "After a Kan",
    "Rinshan Kaihou",
    "嶺上開花",
    `Achieve this yaku by winning with the tile drawn after you declare a kan.`,
    1,
    1,
    ["open", "draws", "lucky"],
    function checkRinshan(possibility, conditions) {
      return conditions.timing === 'rinshan';
    }
  ),
  undersea: new Yaku(
    "Under the Sea",
    "Haitei Raoyue",
    "海底撈月",
    `Achieve this yaku by winning with the last tile in the wall.`,
    1,
    1,
    ["open", "draws", "lucky"],
    function checkSea(possibility, conditions) {
      return conditions.timing === 'haitei';
    }
  ),
  riverbed: new Yaku(
    "Under the River",
    "Houtei Raoyui",
    "河底撈魚",
    `Achieve this yaku by winning on the last discard.`,
    1,
    1,
    ["open", "discards", "lucky"],
    function checkRiver(possibility, conditions) {
      return conditions.timing === 'houtei';
    }
  ),
  chankan: new Yaku(
    "Robbing a Quad",
    "Chankan",
    "搶槓",
    `If an opponent is upgrading a called triplet into a quad, and that tile can finish your hand, you may call it.
    By doing so, you also score this yaku.`,
    1,
    1,
    ["open", "exceptions"],
    function checkSteal(possibility, conditions) {
      return conditions.timing === 'chankan';
    }
  ),
  nagashi: new Yaku(
    "Nagashi Mangan",
    "Nagashi Mangan",
    "流し満貫",
    `A special exception that occurs in drawn rounds.
    A player scores nagashi mangan if all of their discards are 1s, 9s, and honors,
    and none of their discards were ever called for chii, pon, or kan.
    The state of that player's hand is irrelevant.
    This also cancels the usual handling of a drawn round.`,
    5,
    5,
    ["open", "exceptions"]
  ),
  orphans: new Yaku(
    "Thirteen Orphans",
    "Kokushi Musou",
    "国士無双",
    `A hand containing one of each 1, 9, and honor tile, plus an additional copy of one of these.
    Thirteen Orphans is well-formed, despite not meeting the typical definition.
    If you are waiting on the duplicate, this often scores double yakuman.
    If you are waiting on a specific tile with this hand and another player calls a closed quad of that tile, you may declare ron against that call and win.`,
    13,
    0,
    ["closed", "exceptions", "yakuman"],
    function checkOrphans(possibility, conditions) {
      return true;
    }
  ),
  doubleorphans: new Yaku(
    "13-way Wait Thirteen Orphans",
    "Kokushi Musou Sannen-Machi",
    "国士無双",
    `A hand containing one of each 1, 9, and honor tile, plus an additional copy of one of these.
    Thirteen Orphans is well-formed, despite not meeting the typical definition.
    If you are waiting on the duplicate, this often scores double yakuman.
    If you are waiting on a specific tile with this hand and another player calls a closed quad of that tile, you may declare ron against that call and win.`,
    26,
    0,
    ["closed", "exceptions", "yakuman"],
    function checkDoubleOrphans(possibility, condition) {
      return possibility.double;
    }
  ),
  dsg: new Yaku(
    "Great Three Dragons",
    "Daisangen",
    "大三元",
    `A hand containing a triplet of all three types of dragon tiles.
    This hand is often subject to liability rules; if all three of these triplets are open,
    the player that discarded into the last triplet is subject to the payment.`,
    13,
    13,
    ["open", "honors", "liability", "yakuman"],
    function checkDSG(possibility, condition) {
      return possibility.blocks.map(function(block) {
        
      });
    }
  ),
  suuankou: new Yaku(
    "Four Concealed Triplets",
    "Suuankou",
    "四暗刻",
    `A hand containing four triplets that are closed.
    Winning this kind of hand on a pair wait often scores double yakuman.
    However, it is more common for this hand to be won as Fully Concealed Hand with All Triplets.`,
    13,
    0,
    ["closed", "yakuman"]
  ),
  suuankoutanki: new Yaku(
    "Pair-Wait Four Concealed Triplets",
    "Suuankou Tanki",
    "四暗刻",
    `A hand containing four triplets that are closed.
    Winning this kind of hand on a pair wait often scores double yakuman.
    However, it is more common for this hand to be won as Fully Concealed Hand with All Triplets.`,
    26,
    0,
    ["closed", "yakuman"]
  ),
  smallwind: new Yaku(
    "Little Four Winds",
    "Shousuushii",
    "小四喜",
    `A hand containing triplets of three of the four wind tiles and a pair of the last.`,
    13,
    13,
    ["open", "honors", "yakuman"]
  ),
  bigwind: new Yaku(
    "Great Four Winds",
    "Daisuushii",
    "大四喜",
    `A hand containing triplets of all four types of wind tiles.`,
    26,
    26,
    ["open", "honors", "yakuman"]
  ),
  honors: new Yaku(
    "All Honors",
    "Tsuuiisou",
    "字一色",
    `A hand containing only honor tiles.`,
    13,
    13,
    ["open", "honors", "yakuman"],
    function checkAllHonors(possibility, conditions) {
      return possibility.blocks.reduce(function(result, block) {
        return result && block[0].suit === 'h';
      }) && (possibility.pair === [] || possibility.pair[0].suit === 'h');
    }
  ),
  green: new Yaku(
    "All Green",
    "Ryuuiisou",
    "緑一色",
    `A hand containing only tiles from the following:
    Green Dragon, 2-sou, 3-sou, 4-sou, 6-sou, and 8-sou.
    These tiles are painted using only green.`,
    13,
    13,
    ["open", "yakuman"]
  ),
  terminals: new Yaku(
    "All Terminals",
    "Chinroutou",
    "清老頭",
    `A hand containing only terminal tiles.`,
    13,
    13,
    ["open", "yakuman"]
  ),
  gates: new Yaku(
    "Nine Gates",
    "Chuuren Poutou",
    "九連宝燈",
    `A closed hand containing three 1s, one each of 2-8, three 9s, and one extra of any of those in the same suit.
    This hand is so named because of its special formation that results in a 9-way wait.
    To that end, if you are waiting on the "extra", it scores double yakuman.`,
    13,
    0,
    ["closed", "suits", "yakuman"]
  ),
  puregates: new Yaku(
    "Pure Nine Gates",
    "Junsei Chuuren Poutou",
    "九連宝燈",
    `A closed hand containing three 1s, one each of 2-8, three 9s, and one extra of any of those in the same suit.
    This hand is so named because of its special formation that results in a 9-way wait.
    To that end, if you are waiting on the "extra", it scores double yakuman.`,
    26,
    0,
    ["closed", "suits", "yakuman"]
  ),
  fourkan: new Yaku(
    "Four Quads",
    "Suukantsu",
    "四槓子",
    `A hand containing four quads.
    Four Quads is generally considered the most difficult yaku to achieve.`,
    13,
    13,
    ["open", "triplets", "yakuman"]
  ),
  tenhou: new Yaku(
    "Blessing of Heaven",
    "Tenhou",
    "天和",
    `A hand which the dealer recieves already finished at the beginning of a round.`,
    13,
    0,
    ["closed", "yakuman", "lucky"],
    function checkTenhou(possibility, conditions) {
      return conditions.timing === 'blessing' && conditions.seat === 'east';
    }
  ),
  chihou: new Yaku(
    "Blessing of Earth",
    "Chihou",
    "地和",
    `A hand which a player other than the dealer finishes on their first draw.
    However, if someone calls chii, pon, or kan before your draw, you cannot win with chihou.`,
    13,
    0,
    ["closed", "yakuman", "lucky"],
    function checkChihou(possibility, conditions) {
      return conditions.timing === 'blessing' && conditions.seat !== 'east';
    }
  )
};

export default yakuDict;
