import Tile from './Tile.js';
import Meld from './Meld.js';
import { arrayToQuantities, groupBy, allCondition,
  isTileSimple, isTileTerminal } from '../utility.js';

export default class Hand {
  constructor(closed, melds, agari) {
    this.agari = agari;
    this.closed = closed;
    this.melds = melds;
    this.sortTiles();
    Object.defineProperty(this, 'nonMeldTiles', {
      get() {return this.closed.concat([this.agari])}
    });
  }

  sortTiles() {
    let sortMapSuits = {
      'm': 1,
      'p': 2,
      's': 3,
      'h': 4
    }
    let sortMapHonors = {
      'E': 1, 'S': 2, 'W': 3, 'N': 4, 'H': 5, 'G': 6, 'R': 7
    }
    this.closed.sort(function(t1, t2) {
      if (sortMapSuits[t1.suit] !== sortMapSuits[t2.suit]) {
        return sortMapSuits[t1.suit] - sortMapSuits[t2.suit];
      } else if (t1.suit == 'h') {
        return sortMapHonors[t1.number] - sortMapHonors[t2.number];
      } else {
        return t1.number - t2.number;
      }
    });
  }

  isWellFormed() {
    //the pair will always be either in the closed part of the hand or include the agari
    //so it's easiest to isolate that first
    let pairs = this.findPairs();
    let nonMeld = this.nonMeldTiles;
    let unpairedTiles, groups;
    let finished = [];
    //determine whether the hand is orphans first
    //orphans is the major exception to well-formedness and has very specific requirements
    if (pairs.length === 1 &&
      //orphans has one pair and twelve other tiles; all are 1, 9, or an honor
      //if all the tiles are 1-, 9-, or -h but there are MULTIPLE pairs the hand is not complete
      allCondition(nonMeld, function(tile) {
        return !isTileSimple(tile);
      })) {
      //orphans, pairs, and normal are separate calculation modes
      return {
        pair: pairs[0],
        blocks: groupBy(nonMeld.filter(function(tile) {
          return !pairs[0].includes(tile);
        }), 'nvType'),
        double: groupBy(this.closed, 'type').length === 13,
        special: 'orphans'
      };
    } else if (pairs.length === 7) {
      //shortcut! we either have chiitoitsu or ryanpeikou and we know this hand is well-formed
      return {
        pair: [],
        blocks: pairs,
        agari: this.agari.type,
        special: 'pairs'
      };
    } else if (pairs.length === 0) {
      //a hand must have a pair to be well-formed
      return false;
    }
    pairs.forEach(function(pair) {
      //This allows us to get a "pair" of 3 back down to 2 tiles.
      while (pair.length > 2) {
        pair.shift();
      }
      unpairedTiles = nonMeld.filter(function(tile) {
        return !pair.includes(tile);
      });
      let blocks = [];
      let groups = groupBy(unpairedTiles, 'nvType');
      let groupNames = Object.keys(groups);
      groupNames.forEach(function(tileType) {
        let firstTileOfGroup = groups[tileType][0];
        if (groups[tileType].length >= 3) {
          let block = {
            tiles: [],
            type: 'ankou',
            fu: (isTileSimple(firstTileOfGroup) ? 4 : 8)
          };
          for (let t = 0; t < 3; t++) {
            //move the first 3 tiles in the group to the block
            //the fourth might be used in a sequence
            firstTileOfGroup = groups[tileType].shift();
            block.tiles.push(firstTileOfGroup);
          }
          firstTileOfGroup = groups[tileType][0];
          blocks.push(block);
        }
        //there might be two of a sequence.
        //however, if there are 3 copies of a sequence,
        //it's actually 3 triplets.
        while (firstTileOfGroup) {
          //A group of 3 would already have been filtered out,
          //and a group of 4 as a kan would need to be called.
          //The hand is unfinished.
          if (tileType.includes('h')) {
            return false;
          } else if (firstTileOfGroup.number < 8) {
            if (groups[`${firstTileOfGroup.number+1}${firstTileOfGroup.suit}`]
              && groups[`${firstTileOfGroup.number+2}${firstTileOfGroup.suit}`]) {
                let block = {
                  tiles: [
                    firstTileOfGroup,
                    groups[`${firstTileOfGroup.number+1}${firstTileOfGroup.suit}`].shift(),
                    groups[`${firstTileOfGroup.number+2}${firstTileOfGroup.suit}`].shift()
                  ],
                  type: 'shuntsu',
                  fu: 0
                };
                blocks.push(block);
                groups[tileType].shift();
                firstTileOfGroup = groups[tileType][0];
            } else {
              //No sequence. Hand is unfinished.
              return false;
            }
          } else {
            //8 and 9 can't start a sequence; return false;
            return false;
          }
        }
      });
      if (blocks.length === 4) {
        //well-formed!
        finished.push({
          pair: pair,
          blocks: blocks
        });
      } else {
        //not well-formed.
        return false;
      }
    });
    return finished;
  }

  findPairs() {
    let groups = groupBy(this.nonMeldTiles, 'nvType');
    return Object.values(groups).filter(function(group) {
      if (group[0].suit === 'h') {
        return group.length === 2;
      } else {
        return group.length >= 2;
      };
    });
  }
}
