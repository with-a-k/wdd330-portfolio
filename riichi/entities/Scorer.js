import Hand from './Hand.js';
import Meld from './Meld.js';
import Tile from './Tile.js';
import utilis from '../utility.js';

export default class Scorer {
   constructor() {
     //Draws one random dora tile. Riichi starts disabled.
     this.dora = this.startingDora();
     //Generates a hand of random tiles (which start closed).
     this.hand = new Hand();
     this.melds = [];
   };
}
