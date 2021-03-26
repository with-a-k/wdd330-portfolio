class Yaku {
  constructor(engName, romName, kanjiName, description, closedHan, openHan, tags, checkFunction, generateFunction) {
    this.engName = engName;
    this.romName = romName;
    this.kanjiName = kanjiName;
    this.description = description;
    this.closedValue = closedHan;
    this.openValue = openHan;
    this.tags = tags;
  }
}

let yakuList = [
  new Yaku(
    "Fully Closed Hand",
    "Menzenchin Tsumohou",
    "門前清自摸和",
    "Achieve this yaku by winning with a completely closed hand; you must never make any calls for another player's tiles and you must win on one of your own draws.",
    1,
    0,
    ["closed", "draws"]
  ),
  new Yaku(
    "Riichi",
    "Riichi",
    "立直",
    `Declare this yaku by betting 1000 points when your hand reaches tenpai.\n
    Your hand must be closed and there must be enough tiles left to draw that you are able to draw one.\n
    After declaring riichi, you may not discard tiles other than the one you have just drawn, but if the opportunity arises you may declare a closed quad if doing so would not change your wait.\n`,
    1,
    0,
    ["closed", "riichi"]
  ),
  new Yaku(
    "Double Riichi",
    "Daburu Riichi",
    "両立直",
    `Declare this yaku by betting 1000 points if your hand is in tenpai as of your first draw.\n
    If another player has called a chii, pon, or kan, you cannot declare double riichi but you may declare a single riichi.\n
    After declaring riichi, you may not discard tiles other than the one you have just drawn, but if the opportunity arises you may declare a closed quad if doing so would not change your wait.\n`,
    2,
    0,
    ["closed", "riichi", "lucky"]
  ),
  new Yaku(
    "One-Shot",
    "Ippatsu",
    "一発",
    "Achieve this yaku by winning on a riichi on or before the next tile you draw.",
    1,
    0,
    ["closed", "riichi", "lucky"]
  ),
  new Yaku(
    "All Simples",
    "Tan'yao",
    "断幺九",
    `Achieve this yaku by winning with a hand that has only tiles numbered 2 through 8.\n
    Certain rulesets may make All Simples closed-only.\n`,
    1,
    1,
    ["open"]
  ),
  new Yaku(
    "Pinfu",
    "Pinfu",
    "平和",
    "Achieve this yaku by winning with a hand that scores 0 fu based on its tiles.\n
    To achieve this, all four groups of three in the hand must be sequences,\n
    and the pair cannot be a tile type that would qualify for yakuhai.",
    1,
    0,
    ["closed", "sequences"]
  ),
  new Yaku(
    "Twin Sequences",
    "Iipeikou",
    "一盃口",
    "Achieve this yaku by winning with a hand that includes two of the exact same sequence.\n
    If the hand has two copies of two different sequences, this yaku upgrades into Two Twin Sequences.",
    1,
    0,
    ["closed", "sequences"]
  ),
  new Yaku(
    "Full Straight",
    "Ittsuu",
    "一通",
    "Achieve this yaku by winning with a hand that includes sequences of 123, 456, and 789 in the same suit.",
    2,
    1,
    ["semi-open", "sequences"]
  ),
  new Yaku(
    "Yakuhai",
    "Yakuhai",
    "役牌",
    `A category of yaku based on having a triplet of honor tiles.\n
    A triplet of any of the three types of dragon tiles is always a yakuhai.\n
    For a triplet of wind tiles to be a yakuhai, it must match the player's current seat wind or the current round wind.\n`,
    1,
    1,
    ["open", "honors"]
  ),
  new Yaku(
    "Mixed Color Sequence",
    "Sanshoku Doujun",
    "三色同順",
    "Achieve this yaku by winning with the same numbered sequence in all three suits.",
    2,
    1,
    ["semi-open", "sequences"]
  ),
  new Yaku(
    "Mixed Color Triplets",
    "Sanshoku Doukou",
    "三色同刻",
    "Achieve this yaku by winning with the same numbered triplet in all three suits.",
    2,
    2,
    ["open", "triplets"]
  ),
  new Yaku(
    "All Triplets",
    "Toitoihou",
    "対々和",
    "Achieve this yaku by winning with a hand in which all of its groups of three are triplets.",
    2,
    2,
    ["open", "triplets"]
  ),
  new Yaku(
    "Three Concealed Triplets",
    "Sanankou",
    "三暗刻",
    "Achieve this yaku by winning with a hand which contains three non-called triplets.",
    2,
    2,
    ["open", "triplets"]
  ),
  new Yaku(
    "Three Quads",
    "Sankantsu",
    "三槓子",
    "Achieve this yaku by winning with a hand which contains three quads.",
    2,
    2,
    ["open", "triplets"]
  ),
  new Yaku(
    "Half-Outside Hand",
    "Chanta",
    "全帯",
    "Achieve this yaku by winning with a hand in which all five groups contain a 1, 9, or honor tile.",
    2,
    1,
    ["open", "terminals", "honors"]
  ),
  new Yaku(
    "Full-Outside Hand",
    "Junchan",
    "純全",
    "Achieve this yaku by winning with a hand in which all five groups contain a 1 or 9.",
    3,
    2,
    ["open", "terminals"]
  ),
  new Yaku(
    "Two Twin Sequences",
    "Ryanpeikou",
    "純全",
    `Achieve this yaku by winning with a hand which contains two copies each of two different sequences.\n
    Two Twin Sequences hands do not also qualify for Seven Pairs.\n`,
    3,
    0,
    ["closed", "sequences"]
  ),
  new Yaku(
    "Little Three Dragons",
    "Shousangen",
    "小三元",
    "Achieve this yaku by winning with a hand which contains two triplets of dragons and a pair in the third.\n",
    2,
    2,
    ["open", "honors"]
  ),
  new Yaku(
    "Terminals And Honors",
    "Honroutou",
    "混老頭",
    "Achieve this yaku by winning with a hand which contains only 1s, 9s, and honor tiles.\n",
    2,
    2,
    ["open", "honors", "terminals"]
  ),
  new Yaku(
    "Half-Flush",
    "Hon'itsu",
    "混一色",
    "Achieve this yaku by winning with a hand which contains only tiles from one suit and honor tiles.\n",
    3,
    2,
    ["semi-open", "honors", "suits"]
  ),
  new Yaku(
    "Full Flush",
    "Hon'itsu",
    "混一色",
    "Achieve this yaku by winning with a hand which contains only tiles from one suit.\n",
    6,
    5,
    ["semi-open", "suits"]
  ),
  new Yaku(
    "Seven Pairs",
    "Chiitoitsu",
    "七対子",
    `Achieve this yaku by winning with a hand which contains seven pairs of tiles.\n
    Seven Pairs hands are well-formed despite not meeting the typical definition of a well-formed hand.\n`,
    2,
    0,
    ["closed", "exceptions"]
  ),
  new Yaku(
    "After a Kan",
    "Rinshan Kaihou",
    "嶺上開花",
    `Achieve this yaku by winning with the tile drawn after you declare a kan.\n`,
    1,
    1,
    ["open", "draws", "lucky"]
  ),
  new Yaku(
    "Under the Sea",
    "Haitei Raoyue",
    "海底撈月",
    `Achieve this yaku by winning with the last tile in the wall.\n`,
    1,
    1,
    ["open", "draws", "lucky"]
  ),
  new Yaku(
    "Under the River",
    "Houtei Raoyui",
    "河底撈魚",
    `Achieve this yaku by winning on the last discard.\n`,
    1,
    1,
    ["open", "discards", "lucky"]
  ),
  new Yaku(
    "Robbing a Quad",
    "Chankan",
    "搶槓",
    `If an opponent is upgrading a called triplet into a quad, and that tile can finish your hand, you may call it.\n
    By doing so, you also score this yaku.\n`,
    1,
    1,
    ["open", "exceptions"]
  ),
  new Yaku(
    "Nagashi Mangan",
    "Nagashi Mangan",
    "流し満貫",
    `A special exception that occurs in drawn rounds.\n
    A player scores nagashi mangan if all of their discards are 1s, 9s, and honors,
    and none of their discards were ever called for chii, pon, or kan.
    The state of that player's hand is irrelevant.\n
    This also cancels the usual handling of a drawn round.\n`,
    5,
    5,
    ["open", "exceptions"]
  ),
  new Yaku(
    "Thirteen Orphans",
    "Kokushi Musou",
    "国士無双",
    `A hand containing one of each 1, 9, and honor tile, plus an additional copy of one of these.
    Thirteen Orphans is well-formed, despite not meeting the typical definition.\n
    If you are waiting on the duplicate, this often scores double yakuman.\n
    If you are waiting on a specific tile with this hand and another player calls a closed quad of that tile, you may declare ron against that call and win.\n`,
    13,
    0,
    ["closed", "exceptions", "yakuman"]
  ),
  new Yaku(
    "Great Three Dragons",
    "Daisangen",
    "大三元",
    `A hand containing a triplet of all three types of dragon tiles.\n
    This hand is often subject to liability rules; if all three of these triplets are open,
    the player that discarded into the last triplet is subject to the payment.\n`,
    13,
    13,
    ["open", "honors", "liability", "yakuman"]
  ),
  new Yaku(
    "Four Concealed Triplets",
    "Suuankou",
    "四暗刻",
    `A hand containing four triplets that are closed.\n
    Winning this kind of hand on a pair wait often scores double yakuman.\n
    However, it is more common for this hand to be won as Fully Concealed Hand with All Triplets.\n`,
    13,
    0,
    ["closed", "yakuman"]
  ),
  new Yaku(
    "Little Four Winds",
    "Shousuushii",
    "小四喜",
    `A hand containing triplets of three of the four wind tiles and a pair of the last.\n`,
    13,
    13,
    ["open", "honors", "yakuman"]
  ),
  new Yaku(
    "Great Four Winds",
    "Daisuushii",
    "大四喜",
    `A hand containing triplets of all four types of wind tiles.\n`,
    26,
    26,
    ["open", "honors", "yakuman"]
  ),
  new Yaku(
    "All Honors",
    "Tsuuiisou",
    "字一色",
    `A hand containing only honor tiles.\n`,
    13,
    13,
    ["open", "honors", "yakuman"]
  ),
  new Yaku(
    "All Green",
    "Ryuuiisou",
    "緑一色",
    `A hand containing only tiles from the following:
    Green Dragon, 2-sou, 3-sou, 4-sou, 6-sou, and 8-sou.\n
    These tiles are painted using only green.\n`,
    13,
    13,
    ["open", "yakuman"]
  ),
  new Yaku(
    "All Terminals",
    "Chinroutou",
    "清老頭",
    `A hand containing only terminal tiles.\n`,
    13,
    13,
    ["open", "yakuman"]
  ),
  new Yaku(
    "Nine Gates",
    "Chuuren Poutou",
    "九連宝燈",
    `A closed hand containing three 1s, one each of 2-8, three 9s, and one extra of any of those in the same suit.\n
    This hand is so named because of its special formation that results in a 9-way wait.
    To that end, if you are waiting on the "extra", it scores double yakuman.\n`,
    13,
    0,
    ["closed", "suits", "yakuman"]
  ),
  new Yaku(
    "Four Quads",
    "Suukantsu",
    "四槓子",
    `A hand containing four quads.\n
    Four Quads is generally considered the most difficult yaku to achieve.\n`,
    13,
    13,
    ["open", "triplets", "yakuman"]
  ),
  new Yaku(
    "Blessing of Heaven",
    "Tenhou",
    "天和",
    `A hand which the dealer recieves already finished at the beginning of a round.\n`,
    13,
    0,
    ["closed", "yakuman", "lucky"]
  ),
  new Yaku(
    "Blessing of Earth",
    "Chihou",
    "地和",
    `A hand which a player other than the dealer finishes on their first draw.
    However, if someone calls chii, pon, or kan before your draw, you cannot win with chihou.\n`,
    13,
    0,
    ["closed", "yakuman", "lucky"]
  )
];
