import Hand from './Hand.js';
import Meld from './Meld.js';
import Tile from './Tile.js';
import { possibleSuits, possibleHonors } from '../utility.js';

export default class Scorer {

  constructor() {
    this.tileCounts = {};
    this.doraInds = this.startingDora();
    this.openDora = 1;
    this.hand = this.assignHand();
    this.melds = [];
    this.uraDoraEnabled = false;
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
    });
    this.doraInds.uraDora.forEach(function(tile, index) {
      tile.display(document.querySelector('.ura-dora'));
      tile.image.addEventListener('click', function(e) {
        scorer.openDora = index+1;
        scorer.manageKanDora();
      });
    });
    this.hand.closed.forEach(function(tile, index) {
      tile.display(document.querySelector('.closed-tiles'));
    });
    this.hand.agari.display(document.querySelector('.agari'));
    this.animateDora();
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
    tileCode = `${suit}${number}${variant}`;
    if (!this.tileCounts[tileCode]) {
      this.tileCounts[tileCode] = 1;
      destination.push(new Tile(suit, number, variant, vis));
    } else {
      rlvTileCount = this.tileCounts[tileCode];
      if (rlvTileCount >= 4 ||
        (variant === 'r' && rlvTileCount >= 1) ||
        (variant !== 'r' && number === 5 && rlvTileCount >= 3)) {
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
      if (dora.has(item.type())) {
        item.wrapper.classList.add('dora');
      } else {
        item.wrapper.classList.remove('dora');
      }
    });
    //melds later
    console.log(this.hand.agari);
    if (dora.has(this.hand.agari.type())) {
      this.hand.agari.wrapper.classList.add('dora');
    } else {
      this.hand.agari.wrapper.classList.remove('dora');
    }
  }

  resetTiming(callback) {
    document.querySelector('#normal').checked = true;
    callback();
  }
}
