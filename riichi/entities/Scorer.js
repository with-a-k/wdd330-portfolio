import Hand from './Hand.js';
import Meld from './Meld.js';
import Tile from './Tile.js';
import yakuList from '../data/YakuList.js';
import { possibleSuits, possibleHonors } from '../utility.js';

export default class Scorer {

  constructor(numberSelector, honorSelector) {
    this.tileCounts = {};
    this.doraInds = this.startingDora();
    this.openDora = 1;
    this.hand = this.assignHand();
    this.melds = [];
    this.uraDoraEnabled = false;
    this.selectedTile = false;
    this.numberSelector = numberSelector;
    this.honorSelector = honorSelector;
    this.changeNumberSelectView(honorSelector);
    let scorer = this;
    //Make dora indicators
    this.doraInds.topDora.forEach(function(tile, index) {
      tile.display(document.querySelector('.top-dora'));
      //The leftmost dora indicator should stay open.
      //Those after it should be toggleable.
      tile.image.addEventListener('click', function(e) {
        scorer.openDora = index+1;
        scorer.manageKanDora();
      });
      tile.hint.addEventListener('click', function(e) {
        scorer.changeSelectedTileTo(tile);
      });
    });
    this.doraInds.uraDora.forEach(function(tile, index) {
      tile.display(document.querySelector('.ura-dora'));
      tile.image.addEventListener('click', function(e) {
        scorer.openDora = index+1;
        scorer.manageKanDora();
      });
      tile.hint.addEventListener('click', function(e) {
        scorer.changeSelectedTileTo(tile);
      });
    });
    this.hand.closed.forEach(function(tile, index) {
      tile.display(document.querySelector('.closed-tiles'));
      tile.hint.addEventListener('click', function(e) {
        scorer.changeSelectedTileTo(tile);
      });
    });
    this.hand.agari.display(document.querySelector('.agari'));
    this.hand.agari.hint.addEventListener('click', function(e) {
      scorer.changeSelectedTileTo(scorer.hand.agari);
    });
    Array.from(numberSelector.querySelectorAll('.ns-option')).forEach(function (option) {
      option.addEventListener('click', function (e) {
        scorer.alterCurrentlySelectedTile(false, option.value[0], (option.value === '5r' ? 'r' : ''));
        scorer.score();
      });
    });
    Array.from(honorSelector.querySelectorAll('.ns-option')).forEach(function (option) {
      option.addEventListener('click', function (e) {
        scorer.alterCurrentlySelectedTile(false, option.value[0], (option.value === '5r' ? 'r' : ''));
        scorer.score();
      });
    });
    this.animateDora();
    this.score();
  };

  startingDora() {
    let topDora = [];
    let uraDora = [];

    for(let i = 0; i < 5; i++) {
      this.generateTile(topDora, (i === 0 ? 'open' : 'closed'));
      this.generateTile(uraDora);
    }
    return {
      topDora: topDora,
      uraDora: uraDora
    }
  }

  assignHand() {
    let closedContainer = [];
    let agariContainer = [];
    for(let i = 0; i < 13; i++) {
      this.generateTile(closedContainer, 'open');
    }
    this.generateTile(agariContainer, 'open');
    let hand = new Hand(closedContainer, [], agariContainer[0]);
    return hand;
  }

  generateTile(destination, vis = 'closed') {
    let suit, number, tileCode = '';
    let variant = '';
    let rlvTileCount = 0;
    suit = possibleSuits[Math.floor(Math.random()*4)];
    if (suit === 'h') {
      number = possibleHonors[Math.floor(Math.random()*7)];
    } else {
      number = Math.ceil(Math.random()*9);
      if (number === 5) {
        variant = (Math.random() < 0.25 ? 'r' : '');
      }
    }
    tileCode = `${number}${suit}${variant}`;
    if (!this.tileCounts[tileCode]) {
      this.tileCounts[tileCode] = 1;
      destination.push(new Tile(suit, number, variant, vis));
    } else {
      rlvTileCount = this.tileCounts[tileCode];
      if (this.checkTileCount(rlvTileCount)) {
          //Too many of a kind
          this.generateTile(destination, vis);
      } else {
        this.tileCounts[tileCode]++;
        destination.push(new Tile(suit, number, variant, vis));
      }
    }
  }

  enableTimingRon() {
    //Blessing/FirstDraw, Rinshan/Afterkan, and Haitei/LastDraw timing should be off for ron
    document.querySelector('#blessing').disabled = true;
    document.querySelector('#rinshan').disabled = true;
    document.querySelector('#haitei').disabled = true;
    document.querySelector('#l-blessing').classList.add('disabled');
    document.querySelector('#l-rinshan').classList.add('disabled');
    document.querySelector('#l-haitei').classList.add('disabled');
    //and Chankan/StealKan and Houtei/LastDiscard timing should be on
    document.querySelector('#chankan').disabled = false;
    document.querySelector('#houtei').disabled = false;
    document.querySelector('#l-chankan').classList.remove('disabled');
    document.querySelector('#l-houtei').classList.remove('disabled');
  }

  enableTimingTsumo() {
    //Blessing/FirstDraw, Rinshan/Afterkan, and Haitei/LastDraw timing should be on for tsumo
    document.querySelector('#blessing').disabled = false;
    document.querySelector('#rinshan').disabled = false;
    document.querySelector('#haitei').disabled = false;
    document.querySelector('#l-blessing').classList.remove('disabled');
    document.querySelector('#l-rinshan').classList.remove('disabled');
    document.querySelector('#l-haitei').classList.remove('disabled');
    //and Chankan/StealKan and Houtei/LastDiscard timing should be off
    document.querySelector('#chankan').disabled = true;
    document.querySelector('#houtei').disabled = true;
    document.querySelector('#l-chankan').classList.add('disabled');
    document.querySelector('#l-houtei').classList.add('disabled');
  }

  manageKanDora(number) {
    let openDora = this.openDora;
    this.doraInds.topDora.forEach(function(di, ix) {
      if (ix < openDora) {
        di.open();
      } else {
        di.close();
      }
    });
    if(this.uraDoraEnabled) {
      this.openUraDora();
    }
    this.animateDora();
  }

  openUraDora(upto = this.openDora) {
    this.uraDoraEnabled = true;
    this.doraInds.uraDora.forEach(function(udi, index) {
      if (index < upto) {
        udi.open();
      } else {
        udi.close();
      }
    });
    this.animateDora();
  }

  closeUraDora() {
    this.uraDoraEnabled = false;
    this.doraInds.uraDora.forEach(function(udi, index) {
      udi.close();
    });
    this.animateDora();
  }

  score() {
    let scorer = this;
    let possibilities = this.hand.isWellFormed();
    let conditionForm = document.querySelector('form#conditions');
    let conditions = {
      round: conditionForm.elements.round.value,
      seat: conditionForm.elements.seat.value,
      reach: conditionForm.elements.reach.value,
      method: conditionForm.elements.method.value,
      timing: conditionForm.elements.timing.value
    };
    let defaultScore = {
      yakuScored: [],
      han: 0,
      fu: 0,
      name: 'No Yaku'
    }
    possibilities.reduce(function(maxScore, possibility) {
      let score = {
        tiles: possibility,
        yakuScored: [],
        han: 0,
        fu: 0,
        name: 'No Yaku'
      };
      if (possibility.special == 'orphans') {
        let testYaku = [
          yakuList.tenhou,
          yakuList.chihou
        ];
        testYaku.forEach(function(yaku) {
          if (yaku.checkFunction(possibility, conditions)) {
            score.yakuScored.push(yaku);
          }
        });
        if (score.yakuScored.includes(yakuList.tenhou) || yakuList.doubleorphans.checkFunction(possibility, conditions)) {
          //Tenhou thirteen orphans is always 13-way wait.
          score.yakuScored.push(yakuList.doubleorphans);
        } else {
          score.yakuScored.push(yakuList.orphans);
        }
      } else if (possibility.special == 'pairs') {
        let testYakuman = [
          yakuList.tenhou,
          yakuList.chihou,
          yakuList.honors
        ];
        testYakuman.forEach(yakuman => {
          if (yakuman.checkFunction(possibility, conditions)) {
            score.yakuScored.push(yakuman);
          }
        });
        if (score.yakuScored.length > 0) return;
        let testYaku = [
          yakuList.ryan,
          yakuList.tsumo,
          yakuList.riichi,
          yakuList.wriichi,
          yakuList.oneshot,
          yakuList.simples,
          yakuList.termnhon,
          //yakuList.halfout,
          //yakuList.outside,
          yakuList.halfflush,
          yakuList.fullflush,
          yakuList.rinshan,
          yakuList.undersea,
          yakuList.riverbed
        ];
        testYaku.forEach(function(yaku) {
          if (yaku.checkFunction(possibility, conditions)) {
            score.yakuScored.push(yaku);
          }
        });
        if (!score.yakuScored.includes(yakuList.ryan)) {
          score.yakuScored.push(yakuList.chiitoi);
        }
      } else {
        let testYakuman = [
          yakuList.tenhou,
          yakuList.chihou,
          //yakuList.dsg,
          //yakuList.suuankoutanki,
          //yakuList.bigwind,
          //yakuList.smallwind,
          //yakuList.honors,
          //yakuList.green,
          //yakuList.terminals,
          //yakuList.puregates
        ];
        testYakuman.forEach(function(yaku) {
          if (yaku.checkFunction(possibility, conditions)) {
            score.yakuScored.push(yaku);
          }
        });
        //if (!score.yakuScored.includes(yakuList.suuankoutanki)) {
        //  if (yakuList.suuankou.checkFunction(possibility, conditions)) {
        //    score.yakuScored.push(yakuList.suuankou);
        //  }
        //}
        //if (!score.yakuScored.includes(yakuList.puregates)) {
        //  if (yakuList.gates.checkFunction(possibility, conditions)) {
        //    score.yakuScored.push(yakuList.gates);
        //  }
        //}
        let testYaku = [
          yakuList.tsumo,
          yakuList.riichi,
          yakuList.wriichi,
          yakuList.oneshot,
          yakuList.simples,
          //yakuList.pinfu,
          //yakuList.iipeikou,
          //yakuList.straight,
          //yakuList.seatWind,
          //yakuList.roundWind,
          //yakuList.hatsu,
          //yakuList.haku,
          //yakuList.chun,
          //yakuList.mixseq,
          //yakuList.mixtri,
          //yakuList.triplets,
          //yakuList.sanankou,
          //yakuList.halfout,
          //yakuList.outside,
          //yakuList.ssg,
          yakuList.termnhon,
          yakuList.halfflush,
          yakuList.fullflush,
          yakuList.rinshan,
          yakuList.undersea,
          yakuList.riverbed
        ];
        testYaku.forEach(function(yaku) {
          if (yaku.checkFunction(possibility, conditions)) {
            score.yakuScored.push(yaku);
          }
        });
      }
      if (score.yakuScored.length > 0) {
        score.han = score.yakuScored.reduce(function(hn, yaku) {
          return hn + yaku.closedHan;
        }, 0);
        if (score.yakuScored.some(function(yaku) {
          return yaku.tags.includes('yakuman');
        })) {
          score.name = `${han/13 > 1 ? han/13 + 'x ' : ''}Yakuman`;
        } else {
          //get fu and han
          score.fu = this.getFu(score);

          let basePoints = fu * 2 ^ (2 + han);
          //cap the base points
          //13 han or more is a Composite Yakuman
          if (han > 12) {
            basePoints = 8000;
            score.name = "Composite Yakuman";
          //11 or 12 han is a Sanbaiman (3x mangan)
          } else if (han > 10) {
            basePoints = 6000;
            score.name = "Sanbaiman";
          //8-10 han is a Baiman (2x mangan)
          } else if (han > 7) {
            basePoints = 4000;
            score.name = "Baiman";
          //6-7 han is a Haneman (1.5x mangan)
          } else if (han > 5) {
            basePoints = 3000;
            score.name = "Haneman";
          //5 han, or a hand with less than 5 han but a lot of fu, is Mangan
          } else if (han === 5 || basePoints > 2000) {
            basePoints = 2000;
            score.name = "Mangan";
          //otherwise, score it normally
          } else {
            score.name = "";
          }
        //determine the final score from the conditions
          if (conditions['seat'] === 'east') {
            //Dealer Wins
            finalScore = basePoints * 6;
          } else {
            finalScore = basePoints * 4;
          }
        }
      } else {
        //No-Yaku hand can't score
      }
    }, defaultScore);
  }

  getFu(score) {
    console.log(score);
  }

  animateDora() {
    //Causes a shine animation to play over dora tiles.
    let dora = new Set(['5sr', '5mr', '5pr']);
    let windDoraOrder = ['E', 'S', 'W', 'N'];
    let dragonDoraOrder = ['H', 'G', 'R'];
    let allDora = this.doraInds.topDora.concat(this.doraInds.uraDora);
    //The dora indicators, confusingly, indicate that the next tile up
    //is the dora, not that tile itself.
    allDora.forEach((item, i) => {
      if (item.visibility !== 'open') {
        return;
      }
      if (item.suit === 'h') {
        //Winds go in play order, so an East indicator means South is dora, etc.
        if (windDoraOrder.includes(item.number)) {
          while (windDoraOrder[0] !== item.number) {
            windDoraOrder.push(windDoraOrder.shift());
          }
          dora.add(`${windDoraOrder[1]}h`);
        } else {
          //Dragons go in... whichever order this is. I'm not sure why.
          while (dragonDoraOrder[0] !== item.number) {
            dragonDoraOrder.push(dragonDoraOrder.shift());
          }
          dora.add(`${dragonDoraOrder[1]}h`);
        }
      } else {
        //Meanwhile, numbers just add one or loop around.
        dora.add(`${item.number+1 > 9 ? 1 : item.number+1}${item.suit}`);
      }
    });
    this.hand.closed.forEach((item, i) => {
      if (dora.has(item.type)) {
        item.tiWrapper.classList.add('dora');
      } else {
        item.tiWrapper.classList.remove('dora');
      }
    });
    //melds later
    if (dora.has(this.hand.agari.type)) {
      this.hand.agari.tiWrapper.classList.add('dora');
    } else {
      this.hand.agari.tiWrapper.classList.remove('dora');
    }
  }

  checkTileCount(tileCode) {
    let rlvTileCount = this.tileCounts[tileCode];
    if (!rlvTileCount) {
      this.tileCounts[tileCode] = 0;
      return false;
    }
    return (rlvTileCount >= 4 ||
      (tileCode[-1] === 'r' && rlvTileCount >= 1) ||
      (tileCode[-1] !== 'r' && tileCode[0] === 5 && rlvTileCount >= 3));
  }

  alterCurrentlySelectedTile(newSuit = false, newNum = false, newVar = false) {
    this.changeNumberSelectView((newSuit === 'h' ||
     (!newSuit && this.selectedTile.suit === 'h')) ?
      this.honorSelector : this.numberSelector);
    if (!this.selectedTile) {
      return;
    }
    let selTile = this.selectedTile;
    newSuit = newSuit ? newSuit : selTile.suit;
    newNum = newNum ? newNum : selTile.number;
    if (!Number.isNaN(parseInt(newNum))) {
      newNum = parseInt(newNum);
    }
    newVar = newVar ? newVar : (newNum === 5 ? selTile.variant : '');

    if (newSuit === 'h' && selTile.suit !== 'h') {
      newNum = possibleHonors.find(honor => {
        return !this.checkTileCount(`${honor}h`);
      });
    } else if (newSuit !== 'h' && selTile.suit === 'h') {
      newNum = Array.from({length: 9}, (_, i) => i + 1).find(num => {
        return !this.checkTileCount(`${num}${newSuit}`) || (num === 5 && !this.checkTileCount(`${num}${newSuit}r`));
      });
    }
    let desiredTileCode = `${newNum ? newNum : selTile.number}${newSuit ? newSuit : selTile.suit}${newVar ? newVar : selTile.variant}`
    if (this.checkTileCount(desiredTileCode)) {
      throw new Error('Too many of this kind of tile are in play');
    } else {
      this.tileCounts[selTile.type]--;
      this.tileCounts[desiredTileCode]++;
      selTile.suit = newSuit;
      selTile.number = newNum;
      selTile.variant = newVar;
    }
    document.querySelector(`#ss-${selTile.suit}`).checked = true;
    document.querySelector(`#ns-${selTile.number}${selTile.variant}`).checked = true;
    this.reSortHand();
    this.selectedTile.display();
    this.animateDora();
  }

  reSortHand() {
    let scorer = this;
    this.hand.sortTiles();
    document.querySelector('.closed-tiles').replaceChildren([]);
    this.hand.closed.forEach(function(tile, index) {
      tile.container = null;
      tile.display(document.querySelector('.closed-tiles'));
      tile.hint.addEventListener('click', function(e) {
        scorer.changeSelectedTileTo(tile);
        document.querySelector(`#ss-${tile.suit}`).checked = true;
        document.querySelector(`#ns-${tile.number}${tile.variant}`).checked = true;
      });
    });
  }

  changeNumberSelectView(to) {
    document.querySelector('.number-select').replaceChildren([]);
    document.querySelector('.number-select').appendChild(to);
  }

  changeSelectedTileTo(tile) {
    if (this.selectedTile) {
      this.selectedTile.hint.classList.remove('selected-tile');
    }
    this.changeNumberSelectView(tile.suit === 'h' ? this.honorSelector : this.numberSelector);
    tile.hint.classList.add('selected-tile');
    document.querySelector(`#ss-${tile.suit}`).checked = true;
    document.querySelector(`#ns-${tile.number}${tile.variant}`).checked = true;
    this.selectedTile = tile;
  }

  resetTiming(callback) {
    document.querySelector('#normal').checked = true;
    callback();
  }
}
