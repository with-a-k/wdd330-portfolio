function arrayToQuantities(array) {
  console.log(array);
  let quantities = {}
  array.forEach(function(item) {
    if (quantities[item] > 0) {
      quantities[item]++;
    } else {
      quantities[item] = 1;
    }
  });
  return quantities;
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function allCondition(array, callback) {
  return array.reduce(function(result, item) {
    return result && callback(item);
  }, true);
};

function isTileSimple(tile) {
  return tile.number > 1 && tile.number < 9;
}

function isTileTerminal(tile) {
  return tile.number === 1 || tile.number === 9;
}

let possibleSuits = ['s','m','p','h'];
let possibleHonors = ['E', 'S', 'W', 'N', 'H', 'G', 'R'];

function realDora(indicator) {

}

export {
  arrayToQuantities,
  possibleSuits,
  possibleHonors,
  groupBy,
  allCondition,
  isTileSimple,
  isTileTerminal
}
