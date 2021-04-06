function arrayToQuantities(array) {
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

let possibleSuits = ['s','m','p','h'];
let possibleHonors = ['E', 'S', 'W', 'N', 'H', 'G', 'R'];

function realDora(indicator) {
  
}

export {
  arrayToQuantities, possibleSuits, possibleHonors
}
