import Hand from './entities/Hand.js';
import Meld from './entities/Meld.js';
import Tile from './entities/Tile.js';
import { arrayToQuantities } from './utility.js';

function resetTiming(callback) {
  document.querySelector('#normal').checked = true;
  callback();
}

function enableTimingTsumo() {
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

function enableTimingRon() {
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

window.onload = function() {
  //set defaults. The first round is always East, and the East player plays first.
  document.querySelector('#round-east').checked = true;
  document.querySelector('#seat-east').checked = true;
  document.querySelector('#tsumo').checked = true;
  resetTiming(enableTimingTsumo);

  document.querySelector('#tsumo').addEventListener('click', function(e) {
    resetTiming(enableTimingTsumo);
  });

  document.querySelector('#ron').addEventListener('click', function(e) {
    resetTiming(enableTimingRon);
  });

}()
