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

export {
  arrayToQuantities
}
