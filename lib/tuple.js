// Pairs

function Pair(first, second) {
  return function(destructurePair) {
    return destructurePair(first, second);
  };
}

function first(pair) {
  return pair(function(f, _) {
    return f;
  });
}

function second(pair) {
  return pair(function(_, s) {
    return s;
  });
}

function swap(pair) {
  return pair(function(first, second) {
    return Pair(second, first);
  });
}

function toArray(pair) {
  return pair(function(first, second) {
    return [first, second];
  });
}

const pair = Pair(4, 9);
console.log('first: ', first(pair));
console.log('second: ', second(pair));
const swapped = swap(pair);
console.log('first: ', first(swapped));
console.log('second: ', second(swapped));
