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
