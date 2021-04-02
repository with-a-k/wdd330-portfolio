import Tile from './Hand.js';

class Hand() {
  constructor(tilecodes) {

  }

  calculate(conditions) {
    //check for yakuman formations
    

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
