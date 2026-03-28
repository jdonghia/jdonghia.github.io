---
title: "Javascript"
subtitle: ""
date: "Oct 2025"
---

## Principles & Fundamentals

Upon executing a JavaScript file, the engine creates a Global Execution Context and initializes the Call Stack. An Execution Context is
comprised of two fundamental components:

1. **Thread of Execution**: Goes through the code line-by-line and executes it.
2. **Memory**: A storage space (often called the Variable Environment) for saving data and function code.

JavaScript is a single-threaded language. It executes code synchronously, meaning it processes one command at a time and must complete the
current line before moving to the next.

The Memory stores any assigned constant, variable, or function definition (identifier and code).

When a function is invoked (called), it is pushed onto the Call Stack. Simultaneously, a new Execution Context is created specifically for
that function's execution. The Thread of Execution weaves into this new context, utilizing Local Memory to store data defined within the
function scope. The arguments passed during the function call are assigned to their respective parameters within this local memory.

Upon completion of the function's execution (when it hits a return statement), the function is popped off the Call Stack, and its Execution
Context is deleted, except for the evaluated return value.

Execution Analysis

Consider the following implementation:

```javascript
function sum(num1, num2) {
  const result = num1 + num2;
  return result;
}

const data = sum(5, 10);
```

The program initiates execution, establishing the Global Execution Context.

A new function identifier, sum, and its associated code are stored in Global Memory.

A constant identifier, data, is declared in Global Memory. It remains uninitialized prior to the evaluation of the function call.

The Thread of Execution encounters the sum function call, passing 5 and 10 as arguments.

A new Execution Context is created, and the sum call is pushed to the top of the Call Stack.

Inside the function's Local Memory, the arguments 5 and 10 are assigned to the parameters num1 and num2, respectively.

The constant result is stored in Local Memory.

The Thread of Execution evaluates the expression num1 + num2, assigning the value 15 to result.

The value of result is returned to the global data constant. The function's Execution Context is deleted, and the call is popped off the
Call Stack, returning control to the global scope.

![](/imgs/execution-context.png)

## Higher-Order Functions & Callbacks

In JavaScript, functions are treated as First-Class Objects. This classification implies that functions possess all the capabilities of
standard objects, such as being assigned to variables, stored in data structures, passed as arguments to other functions, and returned as
values from other functions .

This flexibility allows for the creation of Higher-Order Functions. A Higher-Order Function is defined as any function that meets at least
one of the following criteria:

    It accepts a function (or functions) as an argument.

    It returns a function as its output.

the function that is passed as an argument is technically referred to as a callback function.

the generalization of functionality

the primary architectural benefit of higher-order functions is the adherence to the dry (don't repeat yourself) principle. without them,
developers often find themselves rewriting the same logic (such as iterating through an array) while only changing a small part of the
functionality (the operation performed on each element) .

consider the following imperative approach, which violates dry by coupling the iteration logic with the specific operation:

```javascript
const foo = [10, 5, 20];

function multiplyby5(num) {
  return num * 5;
}

// we are manually writing the iteration logic here
const result = [];
for (let i = 0; i < foo.length; i++) {
  result.push(multiplyby5(foo[i]));
}
```

if we wanted to divide by 2, we would have to rewrite the entire for loop. we can solve this by generalizing the function. we abstract the
iteration logic into a higher-order function and pass the specific operation (the functionality) as a callback .

below is an implementation of a higher-order function (conceptually similar to the native .map method):

```javascript
const foo = [10, 5, 20];

// the callback function: specific functionality to be applied
function multiplyby5(num) {
  return num * 5;
}

// the higher-order function: generalized iteration logic
function map(array, instructions) {
  const output = [];
  for (let i = 0; i < array.length; i++) {
    // we execute the callback (instructions) on the specific data element
    output.push(instructions(array[i]));
  }
  return output;
}

// usage: we pass the functionality (multiplyby5) into the hof (map)
const bar = map(foo, multiplyby5); // result: [50, 25, 100]
```

arrow functions and legibility

es2015 introduced arrow functions, a syntactical shorthand that improves the legibility of higher-order functions when passing anonymous
callbacks.

while this acts as "syntactic sugar," it allows for a more declarative style where the code describes the mapping relationship concisely:

```javascript
const foo = [10, 5, 20];

// we inline the functionality directly using an arrow function
const bar = foo.map((num) => num * 5);
```

this approach results in more declarative and readable code, focusing on what is happening (mapping data by a multiplier) rather than how
the iteration is implemented .

---

## Closure & Persistent Lexical Scope

The concept of Closure is inextricably linked to the paradigm of Higher-Order Functions. [cite\_start]While standard function execution
involves the volatile creation and subsequent deletion of local memory (Variable Environments), Closure provides a mechanism for functions
to retain state—colloquially described as "remembering"—across distinct executions [cite: 707-712].

### The Architectural Mechanism

Upon the definition of a function within an enclosing scope, the JavaScript engine does not merely serialize the code. [cite\_start]It
simultaneously instantiates a hidden internal property, denoted as `[[scope]]`, which establishes a persistent reference to the surrounding
**Variable Environment** (Local Memory) at the moment of definition [cite: 1054-1055].

When an inner function is returned from its enclosing context, it retains this lexical linkage. Consequently, the state surrounding the
function is "closed over," exempting it from the standard garbage collection process that typically clears execution contexts upon
completion.

### Nomenclature

The persistent data store associated with a closure is described using several technical terms:

- **C.O.V.E.:** Closed Over Variable Environment.
- [cite\_start]**P.L.S.R.D.:** Persistent Lexical Scope Referenced Data [cite: 1187-1190].
- [cite\_start]**The Backpack:** A pedagogical term used to visualize the persistent state attached to the function definition via the
  `[[scope]]` property [cite: 1006-1008].

### Identifier Resolution & Execution Flow

When a function utilizing closure is invoked, the JavaScript engine adheres to a strict identifier resolution hierarchy:

1.  **Local Scope:** The engine first interrogates the active Execution Context.
2.  [cite\_start]**The Backpack (Closure):** If the identifier is not resolved locally, the engine inspects the persistent lexical data
    attached via the `[[scope]]` property [cite: 1064-1065].
3.  **Global Scope:** Finally, if the identifier remains unresolved, the engine queries the Global Execution Context.

This architecture effectively implements **Data Encapsulation**, rendering specific state variables private. [cite\_start]These variables
are inaccessible to the global scope and can only be mutated through the execution of the privileged function [cite: 1068-1071].

#### Fundamental Example: State Encapsulation

The following example demonstrates the fundamental execution flow. The `outer` function returns `checkCall`, which retains access to
`callCount` via its Backpack. This pattern effectively creates a function that can enforce a "run once" constraint.

```javascript
function outer() {
  let callCount = 0;

  function checkCall() {
    // 1. Check Local Memory (callCount? No)
    // 2. Check Backpack (callCount? Yes)
    if (callCount > 0) return "I was already called";

    callCount++; // Mutation of persistent state
    return "Calling for the first time";
  }

  // Return the function definition, creating the closure
  return checkCall;
}

const output = outer();

// 1st Invocation: Backpack hit (callCount is 0) -> Increments state
output(); // Returns: "Calling for the first time"

// 2nd Invocation: Backpack hit (callCount is 1) -> Execution guarded
output(); // Returns: "I was already called"
```

### The Hierarchical Scope Chain

Closure facilitates a hierarchical chain of access. An inner function retains access to the scope of its immediate parent, as well as its
progenitors, creating a **Lexical Scope Chain**.

**Case Study: The Blackjack Chain** In this implementation, the `player` function maintains access to state variables defined in its
immediate parent scope (`dealer`, accessing `playerSum`) and its grandparent scope (`blackjack`, accessing `index`, `array`).

```javascript
function blackjack(array) {
  let index = 0; // Persists via the scope chain for all subsequent executions

  function dealer(num1, num2) {
    let playerSum;
    let busted = false;

    function player() {
      if (busted) return "you are done!";

      if (!playerSum) {
        // Accessing the immediate parent (dealer) scope
        playerSum = num1 + num2;
        return playerSum;
      }

      // Accessing grandparent (blackjack) and parent (dealer) scopes simultaneously
      if (playerSum + array[index % array.length] <= 21) {
        playerSum += array[index % array.length];
        index++;
        return playerSum;
      }

      busted = true;
      index++;
      return "bust";
    }

    return player;
  }

  return dealer;
}
```

### Discrete State & Memory Optimization

It is imperative to note that the "Backpack" is bound to the specific **Execution Context** in which the function was created. If a factory
function is invoked multiple times, each invocation instantiates a discrete Execution Context. [cite\_start]Consequently, every returned
function instance possesses a completely independent and isolated Backpack [cite: 1299-1301].

Furthermore, modern JavaScript engines implement rigorous memory optimization strategies. During the creation of a closure, the engine
analyzes the function definition to determine which variables are explicitly referenced. [cite\_start]Variables present in the lexical scope
but **unreferenced** by the inner function are excluded from the Backpack to mitigate potential memory leaks [cite: 1123-1129].

### Applied Patterns

**1. Algorithmic Optimization via Memoization** Memoization leverages closure to cache the results of computationally expensive operations.
The cache object persists within the closure, allowing subsequent calls with identical arguments to return in $O(1)$ time.

```javascript
function factorialMemoized() {
  const cache = {};

  function factorial(n) {
    // Lookup: Check if the result exists in the persistent cache
    if (cache[n]) return cache[n];

    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }

    // Write: Store result in the persistent cache prior to returning
    cache[n] = result;
    return result;
  }

  return factorial; // Returns the function with the attached cache context
}

const factorial = factorialMemoized();

factorial(100); // Computes and stores in persistent cache
factorial(100); // Retrieves immediately from persistent cache (Closure)
```

**2. Frameworks and Event Management** Closure serves as the foundational logic for sophisticated web development patterns:

- **Rate Limiting (Debouncing & Throttling):** These techniques utilize closure to persist timers or state flags, regulating the frequency
  of function execution in response to high-velocity events (e.g., scrolling, keystrokes).
- **React Hooks (Discrete State Instances):** React Hooks (e.g., `useMemo`, `useState`, `useCallback`) rely heavily on the principle of
  independent closure instances described above. [cite\_start]When a hook is called within distinct components (or different files), it
  operates analogously to calling the `outer` factory function multiple times [cite: 1283-1285]. Each hook invocation establishes a unique
  Execution Context, generating a discrete Backpack for that specific component instance. [cite\_start]This ensures that state variables
  remain isolated and do not leak across different components, effectively creating private state containers for every component instance
  [cite: 1299-1301].

> **Further Reading:** For an expanded analysis of applied patterns, refer to
> _[10 Use Cases of Closures in JavaScript](https://medium.com/deno-the-complete-reference/10-use-cases-of-closures-in-javascript-98fe0eab36db)_.

## Asynchronous Operations

setTimeout order Event Loop checking if the call stack is empty Microtask Queue, Promises. Still running while is being filled up, callback
hell Web browser Web browser features written in C++

Timer - setTimeout

fetch, two pronged facade function

Javascript is single thread

web browser is called, javascript is put on a queue

Microtask queue has priority

Promises allow us to have immediately feedback on javascript memory, to keep track of data

function like setTimeout() cannot be tracked

fetch.then it will put the callback function inside the onFullfilled array property on the promise

setTimeout will put the callback function on the queue when its timeout is completed

promise is a object with value and onFullfilled

features like this are facade functions, but it doesnt belong to JavaScript features. We tend to imagine that it is

<iframe
  src="https://link.excalidraw.com/readonly/1C55p9RrXsAohamxaBGj?darkMode=true"
  width="100%"
  height="500px"
></iframe>
