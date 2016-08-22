// Church Numerals

// The successor to the given number
function succ(num) {
  return function(fn, x) {
    return fn(num(fn, x));
  };
}

// Helper for finding the previous number
function slide(pair) {
  return Pair(second(pair), succ(second(pair)));
}

// The predecessor to the given number
function pred(num) {
  return first(num(slide, Pair(Zero, Zero)));
}

// Add two Church numerals
function add(m, n) {
  return n(succ, m);
}

// Subtract two Church numerals
function sub(m, n) {
  return n(pred, m);
}

const Zero = (fn, x) => x;

const One = succ(Zero);

const Two = succ(One);

const Three = succ(Two);

const Four = succ(Three);

const Five = succ(Four);

const Six = succ(Five);

const Seven = succ(Six);

const Eight = succ(Seven);

const Nine = succ(Eight);

const Ten = succ(Nine);

function toNumber(num) {
  return num(function(x) {
    return x + 1;
  }, 0);
}
