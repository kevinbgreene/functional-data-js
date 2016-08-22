# Function Data Structures in JavaScript


## Once Upon a Time

When I was in college I had no interest in thinking about the future, so I was an art major. I did however have an interest in computers and technology so for an elective I took an intro to computer science course. I honestly don't remember much about the course. It was years later that I returned to programming. You know, gave up on my hopes and dreams and got a real job. The thing that stuck with me from the course was recursion. It was early in the semester and the instructor was demonstrating loops by finding the nth Fibonacci number (cringe). He then showed the recursive solution.

```
function fibonacci(n) {
  if (n < 2) {
    return 1;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}
```

Nothing special, but nice. To my young art-student brain the elegance of recursion was very pleasing and this idea stuck with me. So, years later, when I returned to programming I was very interested in this idea that had stuck with me. That recursion thing was nice. I want to know more about what can be done with that. How do I break large problems down into small problems so I can solve them with recursion?

A lot of the beauty of recursion comes from how each function call maintains its own state, eliminating the need for temporary variables. If we look at an iterative solution to the same problem we find the need for multiple variable assignments.

```
function fibonacci(n) {
  var a = 0;
  var b = 1;
  var f = 1;
  while (n > 0) {
    f = a + b;
    a = b;
    b = f;
    n -= 1;
  }
  return f;
}
```

This could be reduced, but this illustrates my point. In order to maintain the state of our computation we have to create additional variables. The recursive solution just used the arguments passed into the function. This is the beginning of how we can persist data using only functions.

When we think about functional programming languages immutable data is one of the things we associate with them. What makes functional data structures immutable? Does the data have to be immutable? How are they different than the data structures we are used to using? A lot of these questions really don't matter practically when you're writing programs. It matters if data is mutable or not. It doesn't matter how it gets that way. In JavaScript we have Object.freeze. We can make immutable data if we want. All data in our programs is really just the location of some bits in memory. Those bits can always be changed. The lower level the programming language you're using, the more you have to be concerned with the specifics of managing those bits and their location. What we will be exploring here is storing data in functions.

This is a good subject for a book. Actually, the inspiration for this post was translating the Standard ML examples from Chris Okasaki's book Purely Function Data Structures to JavaScript. We'll see how far I want to take this post. I'll probably cover some basic structures, then next week or next month write another post about more complex structures. For now we'll cover numbers, booleans, tuples, lists and binary search trees.



## Numbers

A lot of the ideas that form the basis of functional programming languages are derived from lambda calculus. The lambda calculus is a model for computation. If you are interested in functional programming but unfamiliar with lambda calculus I suggest to check it out. I'll include some links to articles and books later. The key idea (specifically in untyped lambda calculus) is that the only data structure we have is a function. Actually, the only piece of syntax we have is a function and the argument bindings to that function. No numbers, strings, lists, conditionals, loops... etc. We're going to loosen these restrictions a bit as we go, specifically we are going to use conditionals, but for now let's look at how we might do useful things with only functions.

How can we do things in an environment that doesn't even have numbers? When we talk about the existence of numbers what we are really talking about is the ability to count some occurrences of a thing. With our given limitations the thing we have to count are functions. Specifically what we are going to count is the number of applications of a function. If a given function isn't applied at all that is 0. If it is applied once that is one. For any number n the equivalent number to us is the nth composition of some function fn with itself.

```
function One(fn, x) {
  return fn(x);
}
```

This function takes a function "fn" and some argument "x". The function is applied to x once, thus One. Numbers expressed in this fashion are called Church numerals after Alonzo Church, who introduced the lambda calculus. If this is one what then is Zero?

```
function Zero(fn, x) {
  return x;
}
```

The same signature, but the function isn't applied. Moving along we come to Two.

```
function Two(fn, x) {
  return fn(fn(x));
}
```

Or we call the function fn one extra time on One:

```
function Two(fn, x) {
  return fn(One(fn, x));
}
```

This leads us to a function to increment any Church numeral:

```
// Find the successor of num
function succ(num) {
  return function(fn, x) {
    return fn(num(fn, x));
  };
}
```

Now we can write numbers in terms of the number that came before them.

```
const Zero = (fn, x) => x;

const One = succ(Zero);

const Two = succ(One);

const Three = succ(Two);

const Four = succ(Three);
```

We're placing artificial limitations on ourselves by using only functions to express data. It would be nice to at least have a way to check our work, maintain our sanity and see these things as the Arabic numerals we are used to.

```
function toNumber(num) {
  return num(function(acc) {
    return acc + 1;
  }, 0);
}
```

One of our numbers is just a function that takes two arguments. If we apply these functions correctly we can retrieve the corresponding Arabic numeral. By using 0 as the initial argument for the function we can keep track of how many times one of our numbers call its function. The function we then pass in as the first argument is an accumulator that just needs to increment the number it receives and pass it to the next function invocation.

If some number n is just a function representing the nth composition of some function fn, how do we express addition?

```
function add(m, n) {
  return function(fn, x) {
    return m(fn, n(fn, x));
  };
}
```

When this function is applied n calls fn n times and m an additional m times resulting in the addition of m and n.

```
toNumber(add(Five, Four)); // -> 9
toNumber(add(Ten, Two)); // -> 12
```

We will return to numbers shortly and learn how to perform more operations on Church numerals. It will help to introduce a few more concepts first.



## Booleans

Booleans are where things start to get a little interesting to me. The patterns we start exploring with booleans are going to be the patterns we use to express the rest of the data structures we're going to look at. They also start representing patterns that could actually be used to build useful data structures.

We have two potential values for booleans. That's it. We know what they are ahead of time. We know logically what they represent. A boolean is really just a fork in the road. Either one thing or another.

```
function True(trueValue, _) {
  return trueValue;
}

function False(_, falseValue) {
  return falseValue;
}
```

An operation that was consuming one of these booleans would call the function with two values and would know wether the boolean was True or False based on the value returned.

```
function toBoolean(bool) {
  return bool(true, false);
}

toBoolean(True); // -> true
toBoolean(False); // -> false
```

In essence our boolean is its own if/else. If it's true the first argument is used, else the second argument.

We could perform a logical NOT, reverse the value, simply enough.

```
function not(bool) {
  return bool(False, True);
}

toBoolean(not(False)); // -> true
toBoolean(not(True)); // -> false
```

If this function is given a True it will return the left value of False and if given a False will return the right value of True. We can follow this up with logical AND.

```
function and(leftBool, rightBool) {
  return leftBool(rightBool, leftBool);
}

toBoolean(and(True, False)); // -> false
toBoolean(and(True, True)); // -> true
```

If the leftBool is a True the value of rightBool will be returned as the value of this function. It will evaluate to true only if both are true. If leftBool is False the value of leftBool will be returned as the value of this function.

Logical OR follows very quickly from this.

```
function or(leftBool, rightBool) {
  return leftBool(leftBool, rightBool);
}

toBoolean(and(True, False)); // -> true
toBoolean(and(False, False)); // -> false
```

If leftBool is True leftBool is returned, otherwise we return rightBool. This function returns True if either value is True.



## Pairs

Let's start persisting arbitrary data into functions. If I wanted to persist two values in a pair I would expect that to look something like this:

```
const pair = Pair(1, 2);
```

We know we are only persisting data as functions. Here we can assume 'pair' to be a function. This function will take a function as an argument. It will call the argument function with the two values of the Pair, allowing us to retrieve the values.

```
function Pair(left, right) {
  return function(destructurePair) {
    return destructurePair(left, right);
  };
}
```

We say that the function destructures the Pair because it pulls it apart into its component values. This is somewhat similar to how destructuring assignment works in JavaScript.

```
// Pull the object apart and assign its component values to the variables x, y, z.
const { x, y, z } = { x : 'x', y : 'y', z : 'z' };
```

We can use destructuring to create functions to retrieve the first and second values of the Pair.

```
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

first(Pair(3, 9)); // -> 3
second(Pair(1, 49)); // -> 49
```


## Lists

Lists follow naturally from Pairs. In our implementation of Pairs we knew exactly how many values our data structure would handle. It would hold two, no more, no less. With Lists we need to handle an arbitrary number of values. The data structure we are actually going to implement is a linked list where a node in our list holds two things the value at that position and some representation of the remainder of the list.

```
function List(head, tail) {
  return function(destructureNode) {
    return destructureNode(head, tail);
  };
}
```

Hmm, this is identical to our implementation of Pair. This isn't quite going to be good enough. What do we do when we do when we get to the end of a list? How do we represent there is no more list, or that we have an empty list? Do we just let the destructureNode function fail? No. We add a special value to represent the empty list. This is typically called Nil.

```
function List(head, tail) {
  return function(destructureNode, _) {
    return destructureNode(head, tail);
  };
}

function Nil(_, destructureNil) {
  return destructureNil();
}
```

Now we can also represent the end of a List as Nil. If we're looping through a List we can make a recursive call in the destructureNode function and short-circuit the recursion when we hit the end of the List in our destructureNil function.

The key thing to remember here is head is a value our list is holding and tail is another List, specifically the remaining List after this node.

It's easy enough to build on this and write functions to retrieve the head and tail of our Lists. This is almost identical to the first and second functions for Pairs. The only difference is we need to handle the special case of Nil.

```
function head(list) {
  return list(function(h, _) {
    return h;
  }, function() {
    throw new Error('Empty List has no head');
  })
}

function tail(list) {
  return list(function(_, t) {
    return t;
  }, function() {
    throw new Error('Empty List has no tail');
  });
}
```

Before moving on, let's write a function to transform one of these Lists into a JavaScript array to make it easier to check our work.

```
function toArray(list) {
  return list(function(head, tail) {
    return [head].concat(toArray(tail));
  }, function() {
    return [];
  })
}

const list = List(1, List(2, List(3, Nil)));
toArray(list); // -> [1, 2, 3];
```

Let's do something more interesting. Let's concatenate two lists. Our data structures are immutable, so we won't be modifying either List in order to perform the concatenation. What we will do is copy the first List and use the second List as the tail of our copy. This will leave our second List in tact, but we will save ourselves from unnecessary copying if the two Lists just share those nodes.

```
function concat(first, second) {
  return first(function(head, tail) {
    return List(head, concat(tail, second));
  }, function() {
    return second;
  })
}
```

When our recursion reaches the end of the first List the destructureNil function is used which just returns the second List which is then used as the tail of the last node in our copy.

I'll take a moment to point out something obvious here. The List constructor is a prepend function.

```
const newList = List(5, Nil);
```

The prepend operation is performed in constant O(1) time. Our concat operation however must recurse through every node in the first List, meaning concatenation takes time proportional to the size of the first List O(n). In many functional languages this operation is referred to as 'cons'. There really is no List constructor. Every List is just created by prepending to the Nil value.

How about appending to a List? Appending to a List is going to be another O(n) operation. We are going to copy the List and just add one extra node to the end.

```
function append(val, list) {
  return list(function(head, tail) {
    return List(head, append(val, tail));
  }, function() {
    return List(val, Nil);
  })
}
```

To make a copy of a List we were using a prepend operation. Could we then use our new append operation to make a reverse copy?

```
function reverse(list) {
  return list(function(head, tail) {
    return append(head, reverse(tail));
  }, function() {
    return Nil;
  });
}

const list = List(1, List(2, List(3, List(4, Nil))));
const reversed = reverse(list);

toArray(list); // -> [1, 2, 3, 4]
toArray(reverse); // -> [4, 3, 2, 1]
```

What other operations to we commonly want to perform on lists? Getting the nth value of a List is pretty common.

```
function get(n, list) {
  return list(function(head, tail) {
    if (n === 0) {
      return head;
    } else {
      return get((n - 1), tail);
    }
  }, function() {
    throw new Error('Index requested is outside the bounds of this List');
  });
}
```

I told you, we would eventually get around to using conditionals. We've been able to do a lot with only functions. We could certainly do more, but I'm not that masochistic. Simple enough, we just keep decrementing n until it reaches 0 then we know we're at the correct node.

What follows quickly from this is updating the node at the nth index. Because we are again non-destructively updating our Lists, we are creating a new List with the given node updated. We accomplish this by copying every node until we reach the given index and then use any remaining nodes as the tail of our new List, similar to how we performed concatenation.

```
function update(list, i, val) {
  return list(function(head, tail) {
    if (i === 0) {
      return List(val, tail);
    } else {
      return List(head, update(tail, (i - 1), val));
    }
  }, function() {
    throw new Error('Index requested is outside the bounds of this List');
  });
}
```

We could obviously fill out all of the common functions for Lists. However, I think we get the idea. All the operations follow the same patterns. In the included source code I have implementations for map, filter, foldl and foldr if you want to take a look.



## Binary Search Trees

Binary Search Trees are going to be the last data structure we look at in this post. Following on from Pairs and Lists we are just going to be adding a little bit of complexity to what we have already seen. A node in a List is singly-linked to the rest of the List. A node in a binary tree is doubly-linked. All nodes in the left sub tree have values less than the current node and all values in the right sub tree have values greater than the current node. For this implementation we are going to say all values in the left sub tree are less than or equal to the value of the current node. As with Lists we are going to have a special type to represent an empty tree.

```
function Tree(val, left, right) {
  return function(destructureTree, _) {
    return destructureTree(val, left, right);
  };
}

function Empty(_, destructureEmpty) {
  return destructureEmpty();
}
```

As usual, we are going to make a function to turn our Tree into a more easily inspectable JavaScript object.

```
function toObject(tree) {
  return tree(function(val, left, right) {
    return {
      key : val,
      left : toObject(left),
      right : toObject(right)
    };
  }, function() {
    return 'Empty';
  });
}
```

The first thing we are going to want to do with our Tree is to insert values into it. Like Lists, Trees are built by inserting elements into the empty Tree. With binary search trees new elements are inserted as a new leaf. We just need to find the correct place to insert the new leaf. We compare the value of the new value to the value of the current node and move left or right depending on if it is smaller or larger. Once we find an Empty node we have a place to insert the new node.

```
function insert(toInsert, tree) {
  return tree(function(val, left, right) {
    if (toInsert <= val) {
      return Tree(val, insert(toInsert, left), right);
    } else {
      return Tree(val, left, insert(toInsert, right));
    }
  }, function() {
    return Tree(toInsert, Empty, Empty);
  });
}

const tree = insert(4, Empty);
toObject(tree); // -> { key : 4, left : 'Empty', right : 'Empty' }
```

You will notice this code copies nodes on the path to the new node. Nodes that are not on the insertion path are shared with the new Tree, returned as a result of this insertion, an the old Tree.

Find min

```
function min(tree) {
  return tree(function(val, left, right) {
    return left(function(_val, _left, _right) {
      return min(left);
    }, function() {
      return tree;
    });
  }, function() {
    throw new Error('No min node in empty tree');
  });
}
```

Searching

```
function search(toFind, tree) {
  return tree(function(val, left, right) {
    if (toFind === val) {
      return true;
    } else if (toFind < val) {
      return search(toFind, left);
    } else {
      return search(toFind, right);
    }
  }, function() {
    return false;
  });
}
```

remove min

```
function removeMin(tree) {
  return tree(function(val, left, right) {
    return left(function(_val, _left, _right) {
      return Tree(val, removeMin(left), right);
    }, function() {
      return right;
    });
  }, function() {
    return Empty;
  });
}
```

remove

```
function replaceRemoved(tree, left, right) {
  return tree(function(val, _left, _right) {
    return Tree(val, left, removeMin(right));
  }, function() {
    return left;
  });
}

function remove(toRemove, tree) {
  return tree(function(val, left, right) {
    if (toRemove === val) {
      return replaceRemoved(min(right), left, right);
    } else if (toRemove < val) {
      return Tree(val, remove(toRemove, left), right);
    } else {
      return Tree(val, left, remove(toRemove, right));
    }
  }, function() {
    return tree;
  });
}
```
