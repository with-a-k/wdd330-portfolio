import Tile from './Tile.js';
import Meld from './Meld.js';
import { arrayToQuantities } from '../utility.js';

export default class Hand {
  constructor(closed, melds, agari) {
    this.agari = agari;
    this.closed = closed;
    this.melds = melds;
  }

  calculate(conditions) {
    //get finished hand versions
    let closedString = this.closed.sort(function(t1, t2) {
      return t1.type().slice(0,2) - t2.type().slice(0,2);
    });
    let simpleArray = this.closed.map(function(tile) {
      return tile.type().slice(0,2);
    })
    let tx = 0;
    let currentTile;
    //closed tiles should be interpreted as whatever gives the hand maximum score


  }

  findPairs(simpleArray) {
    let quantities = utilis.arrayToQuantities;
    let pairCandidates = Object.keys(quantities).map(function(tc) {
      //If there are more than 2 of an honor tile, that can't be the pair.
      //Suit tiles can form straights, though, so 456|66 can still work.
      return quantities[tc] > 1 && (!tc.includes('h') && quantities[tc] > 2);
    });
  }

  score(conditions) {
    //check for yakuman formations
    if(conditions.timing = 'blessing') {
      if(conditions.seat = 'east') {
        this.scoredYaku.append(yakuList.tenhou);
      } else {
        this.scoredYaku.append(yakuList.chihou);
      }
    }

    //get fu and han
    let fu = this.getFu();
    let basePoints = fu * 2 ^ (2 + han);
    let scoreName = "";
    //cap the base points
    //13 han or more is a Composite Yakuman
    if (han > 12) {
      basePoints = 8000;
      scoreName = "Composite Yakuman";
    //11 or 12 han is a Sanbaiman (3x mangan)
    } else if (han > 10) {
      basePoints = 6000;
      scoreName = "Sanbaiman";
    //8-10 han is a Baiman (2x mangan)
    } else if (han > 7) {
      basePoints = 4000;
      scoreName = "Baiman";
    //6-7 han is a Haneman (1.5x mangan)
    } else if (han > 5) {
      basePoints = 3000;
      scoreName = "Haneman";
    //5 han, or a hand with less than 5 han but a lot of fu, is Mangan
    } else if (han === 5 || basePoints > 2000) {
      basePoints = 2000;
      scoreName = "Mangan";
    //otherwise, score it normally
    } else {
      scoreName = "";
    }
    //determine the final score from the conditions
    if (conditions['seat'] == 'east') {
      //Dealer Wins
      finalScore = basePoints * 6;
    } else {
      finalScore = basePoints * 4;
    }
    return {
      han: han,
      fu: fu,
      yaku: this.scoredYaku,
      score: finalScore,
      scoreName: scoreName
    }
  }

  getFu() {
    if (this.scoredYaku.includes('Seven Pairs')) {
      return 25; //fixed value
    }
  }
}
