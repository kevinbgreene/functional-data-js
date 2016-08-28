// Lists

function List(head, tail) {
  return function(destructureNode, _) {
    return destructureNode(head, tail);
  };
}

function Nil(_, destructureNil) {
  return destructureNil();
}

function findSize(current, list) {
  return list(function(head, tail) {
    return findSize((current + 1), tail);
  }, function() {
    return current;
  });
}

function size(list) {
  return findSize(0, list);
}

function last(list) {
  return head(reverse(list));
}

function head(list) {
  return list(function(h, _) {
    return h;
  }, function() {
    throw new Error('Empty list has no head');
  })
}

function tail(list) {
  return list(function(_, t) {
    return t;
  }, function() {
    throw new Error('Empty list has no tail');
  });
}

function concat(first, second) {
  return first(function(head, tail) {
    return List(head, concat(tail, second));
  }, function() {
    return second;
  });
}

function get(n, list) {
  return list(function(head, tail) {
    if (n === 0) {
      return head;
    } else {
      return get((n-1), tail);
    }
  }, function() {
    throw new Error('Index requested is outside the bounds of this List');
  });
}

function update(i, val, list) {
  return list(function(head, tail) {
    if (i === 0) {
      return List(val, tail);
    } else {
      return List(head, update((i - 1), val, tail));
    }
  }, function() {
    throw new Error('Index requested is outside the bounds of this List');
  });
}

function map(fn, list) {
  return list(function(head, tail) {
    return List(fn(head), map(fn, tail));
  }, function() {
    return Nil;
  });
}

function filter(predicate, list) {
  return list(function(head, tail) {
    if (predicate(head)) {
      return List(head, filter(predicate, tail));
    } else {
      return filter(predicate, tail);
    }
  }, function() {
    return Nil;
  });
}

function foldl(fn, acc, list) {
  return list(function(head, tail) {
    return foldl(fn, fn(acc, head), tail);
  }, function() {
    return acc;
  });
}

function foldr(fn, acc, list) {
  return foldl(fn, acc, reverse(list));
}

function append(val, list) {
  return list(function(head, tail) {
    return List(head, append(val, tail));
  }, function() {
    return List(val, Nil);
  });
}

function reverse(list) {
  return list(function(head, tail) {
    return append(head, reverse(tail));
  }, function() {
    return Nil;
  });
}

function toArray(list) {
  return list(function(head, tail) {
    return [head].concat(toArray(tail));
  }, function() {
    return [];
  });
}
