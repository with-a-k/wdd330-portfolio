import Hand from './entities/Hand.js';
import Meld from './entities/Meld.js';
import Tile from './entities/Tile.js';
import Scorer from './entities/Scorer.js';
import { arrayToQuantities } from './utility.js';

window.onload = function() {
  //set defaults. The first round is always East, and the East player plays first.
  document.querySelector('#round-east').checked = true;
  document.querySelector('#seat-east').checked = true;
  document.querySelector('#dama').checked = true;
  document.querySelector('#tsumo').checked = true;

  let scorer = new Scorer();

  scorer.resetTiming(scorer.enableTimingTsumo);

  document.querySelector('#tsumo').addEventListener('click', function(e) {
    scorer.resetTiming(scorer.enableTimingTsumo);
  });

  document.querySelector('#ron').addEventListener('click', function(e) {
    scorer.resetTiming(scorer.enableTimingRon);
  });

  document.querySelector('#dama').addEventListener('click', function(e) {
    scorer.closeUraDora();
  });

  document.querySelector('#riichi').addEventListener('click', function(e) {
    scorer.openUraDora();
  });

  document.querySelector('#w-riichi').addEventListener('click', function(e) {
    scorer.openUraDora();
  });

}();
