---
order: 1
title: "Static Scoping"
subtitle: "How Scopes work in JavaScript."
tags:
  - "JavaScript"
  - "Studies"
date: "Mar 2026"
---

## Introduction

It’s been a few months since I decided to deep dive into JavaScript. I had wanted to do that for a while, but I just never prioritized it.

AI is growing by leaps and bounds, and we’re adding more layers of abstraction in programming knowledge than ever. Most software engineers
probably wouldn’t agree on the importance of learning fundamental concepts like Scopes (I am referring specifically to JavaScript, but it
applies to any other programming language).

I was searching for official GitHub certifications, and ended up on the [GitHub Student Pack](https://education.github.com/pack) page, from
where I was already using Copilot. They offer many benefits like AWS Credits, free domains, GitHub Actions, and more. I was looking at the
perks again, and one caught my attention. I did know about them, but not that they had a partnership with GitHub. I am talking about
[FrontendMasters](https://frontendmasters.com/).

Personally, I don’t think there’s a better place to learn frontend engineering than FrontendMasters. It’s a **FREE** benefit for any student
enrolled in the Student Pack for 6 months. I would say that every student or frontend engineer should learn from their content.

I made this tangent because I learned Scopes with one of the best instructors on the platform, **Kyle Simpson**, at the
[Deep JavaScript Foundations](https://frontendmasters.com/courses/deep-javascript-v3/) workshop. He has an amazing teaching style, and this
study will be based on his teachings, with my perspective and considerations. Besides Deep Foundations, he has other great workshops like
[Rethinking Asynchronous JavaScript](https://frontendmasters.com/courses/rethinking-async-js/) and
[Functional-Light JavaScript](https://frontendmasters.com/courses/functional-javascript-v3/).

That said, I’ll separate this topic into two: **Static Scoping** and **Dynamic Scoping**. There’s no such thing as dynamic scoping in
JavaScript, but I’ll structure this way since the `this` keyword introduces dynamicism in the language and deserves a separate topic.

I’ll explain without getting into concepts like Abstract Syntax Tree and other Compiler fundamentals, which I haven’t deep-dived into. I
prefer to avoid subjects that are not a priority in the current study. It’s like what Carl Sagan said:

_"If you wish to make an apple pie from scratch, you must first invent the universe."_

I had already fallen into this trap because I like to understand things in depth. The problem is that we end up falling into a rabbit hole,
not knowing when to stop, and this is demotivating. We feel we cannot understand the whole thing. It’s basically fueling the Impostor
Syndrome.

## Disclaimer

This study is a personal way to consolidate my knowledge of a specific subject, and the content shared here reflects my perceptions and
perspectives. I believe that explaining is one of the best ways to learn. I do not intend to act as a teacher, and I’ll probably make
mistakes. Feedback is always welcome.

About AI, I do use it to complement my studies. AI is a great tool to check information, even if it gets it wrong. Fixing its mistakes is
already a good way to consolidate knowledge. But I do not use to write my articles. If the goal is to study, I believe I should do it on my
own.

As a personal study, it’s based on my personal opinions, and not everyone will agree; that’s completely natural. I used to be a
fence-sitter, but it’s impossible to please everyone. Not wanting to please everyone is a sign of maturity, but that doesn’t mean we
shouldn’t be humble and admit our mistakes.

## How Scopes Work

Most software engineers think that JavaScript is an interpreted language. But how does it throw errors before code execution?

If you try to execute this simple function, an error will be thrown and `"Hello, World"` will not be printed, even if it was written before
`bar` declaration.

```javascript
function foo() {
  console.log("Hello, World");

  var bar = ;
}

foo();

// SyntaxError: Unexpected token ';'
```

Why?

The **Compiler** throws a `SyntaxError` before achieving **Runtime**.

JavaScript is a **two-pass** language. Simply speaking, it has two phases:

1. Compilation Phase
2. Execution Phase (Runtime)

## Compilation Phase

The Compile Pass maps scopes and identifiers (functions, variables, properties). This is possible because they’re predictable and static.
Scopes cannot move “physically” from one place to another, and identifiers once declared will have their space allocated in memory, even if
they are not used later and freed by the **Garbage Collector**. We’re using this fact to optimize the code for the Runtime.

### Buckets and Marbles

In the workshop, Kyle explains using the **Buckets and Marbles** metaphor. Buckets are scopes, and Marbles are identifiers. Each scope is a
Bucket, and each identifier is a Marble placed on its corresponding Bucket. Scopes are, metaphorically speaking, Buckets inside Buckets.

Each Bucket has its own color:

```javascript
// Global Scope: Red Bucket 🟥

// foo: Red Marble 🔴
function foo() {
  // foo scope: Blue Bucket 🟦

  var bar; // bar: Blue Marble 🔵
}
```

1. The Red Bucket 🟥 represents the global scope.
2. `foo` is placed on the Red Bucket 🟥 as a Red Marble 🔴.
3. The Blue Bucket 🟦 represents the `foo` scope.
4. `bar` is placed on the Blue Bucket 🟦 as a Blue Marble 🔵.

The mapping is made by the **Scope Manager** and the **Compiler**. Kyle explains this communication like two people talking to each other.

Using the example above:

**Compiler**: “Hey, Scope Manager. I have a formal declaration of `foo` on the Red Bucket. Have you heard of this before?"

**Scope Manager**: “Never heard before, but here’s your marble.”

_The Red Marble foo is placed on the Red Bucket._

**Compiler**: “Hey, Scope Manager. `foo` is actually a function; we’ll need another bucket.”

_The Blue Bucket (foo scope) is placed inside the Red Bucket (global scope)._

You can think of it like Matryoshka dolls, the ones that fit inside one another. Or you can make a parallel with the boxing system from
CSS/HTML. It’s not a coincidence because they’re probably using Trees as a data structure.

#### Duplication on different scopes

Let’s take two identifiers with the same label, but in different scopes:

```javascript
// Red Bucket
var foo; // Red Marble

function bar() {
  // Blue Bucket
  var foo; // Blue Marble
}
```

Even though they have the same label, we’re talking about completely different scopes.

An identifier with the same label `foo` is placed as a Blue Marble inside the Blue Bucket. Although the `foo` from the Red Bucket cannot be
referenced anymore on the Blue Bucket. This is known as **Shadowing**.

#### Duplication on the same scope

In case of identifiers with the same label, on the same scope:

```javascript
// Red Bucket

var foo; // Red Marble

var foo; // Red Marble?
```

Both are read, but they won't coexist. They’ll behave differently based on their declaration type.

On the second declaration of `foo`:

**Compiler**: “Hey, Scope Manager. I have a formal declaration of `foo` on the Red Bucket. Have you heard of this before?”

**Scope Manager**: “Yes”.

_Then nothing happens._

Function declarations, function expressions, and declarations with `let` or `const` work differently:

- **Function declarations**: the function will be overridden.
- **let, const**: cannot be redeclared since they act strictly. I’ll explain more about ”strict mode” later.

#### Function declarations x function expressions

The Compiler maps function declarations and function expressions differently:

```javascript
// Red Bucket

function foo() {} // Red Marble

var bar = function apple() {
  // Blue Marble
  // Blue Bucket
};

bar();
```

The first one is a function declaration, the standard way to write functions. The other one is a function expression. A function is only a
function expression if the keyword `function` is not the first expression in the code line. I’ll not go into depth about it because I’ll
write a dedicated study for functions in general.

What matters in our case is that any function expression has its Marble placed on its own Bucket, and can only be called in its own scope.
It’s also read-only.

In the example above, `bar` holds a reference to `apple`. So, calling `bar` in the global scope will work.

```javascript
// Red Bucket
(function foo() {
  // Blue Marble
  // Blue Bucket
});

foo(); // ReferenceError
```

But in this example, `foo` is a function expression, and it’s not accessible on the Red Bucket since its Marble belongs to its own Bucket.
This pattern is useful to create IIFEs (Immediate Invoked Function Expression), which are present in any bundling library like Webpack or
Vite. As mentioned earlier, I’ll discuss IIFEs in a dedicated study on functions.

---

### Scope Units

Based on its declaration type, the identifier will attach to different Scope Units.

#### Block Scope

Only accessible inside brackets `{ }`. `let` and `const` variables are block-scoped.

```javascript
function foo() {
  {
    let bar = "bar";
  }

  console.log(bar); // Reference Error
}

foo();
```

I have never used this syntax with brackets before, but it is still a good visual example. Any access outside `bar` scope throws a
`ReferenceError`.

Block Scoping is useful when you need temporary variables that don’t need to be accessible to the entire function scope. Some cases will be
conditionals, try/catch, and while expressions. Block Scoping is also an alternative for IIFEs.

#### Function Scope

Accessible across the entire function scope. `var` variables are function-scoped.

```javascript
function foo() {
  {
    var bar = "bar";
  }

  console.log(bar); // prints bar
}

foo();
```

Even inside the Block Scope, the variable stays accessible to the `foo` scope.

#### Hybrid Scope

Functions are Hybrid Scoped, meaning they work in both Block Scope and Function Scope.

```javascript
function foo() {
  // bar();

  {
    // ou bar();

    function bar() {
      console.log("Hello, world");
    }
  }
}

foo();
```

#### let x var

I’m going to open a big parenthesis here:

In the workshop, Kyle explains that `let` is not a replacement for `var`. There are many Reddit posts talking about this. This discussion
might seem a waste of time, but the subject goes beyond that.

In my day-to-day, I haven’t been using `var`, not because I don’t agree with its usage, but simply because I have adopted `let` and `const`
as a habit. I saw relevant people on the internet saying that you shouldn’t use `var` in any case, without any real explanation about it. In
fact, I saw some saying it still exists due to backward compatibility, especially in legacy projects.

In any case, `let` can be considered a replacement for `var`. If you decide to do a search and replace on your project, the chances of you
breaking your application are very high. As explained above, `var` is function-scoped. In the example above, if you replace `var` with
`let`, a `ReferenceError` will be thrown, and the variable will be block-scoped.

> So I’ll move the variable declaration to the function level and assign its value in the block scope.

```javascript
function foo() {
  let bar;

  {
    bar = "bar";
  }

  console.log(bar); // prints bar
}

foo();
```

Why not simply use `var`?

`var` and `let` have different usages. It is true that in some cases they work similarly. If a `let` variable is in the function scope,
it’ll work like `var`. But why not use `var`? Using `let` indicates incorrect semantic usage of the keyword.

Use `let` for block-scoping and `var` for function-scoping; one does not replace the other.

Honestly, I didn’t know about this before, and I didn’t take `var` as an option. When I learned it, I started using it more frequently in my
projects. The problem is that most software engineers will not even try to use `var` since it’s become common practice. The same goes for
arrow functions. Arrow functions have become the standard way to declare functions and have lost their purpose. They were implemented to
resolve `this` lexically, not to replace any function. Even I was using it as a habit.

Kyle reinforces this by saying that software engineers should know their tools better. I am not saying to adopt `var`, but that we should at
least understand before discarding it, and I agree with this. What I do not agree with is spreading misinformation as an absolute truth. I
doubt that, if questioned, developers who abominate its usage could explain the real reason why they do not use it.

I agree that JavaScript has many problems, like any other popular programming language, but cases like this sound more like ignorance to me.

There are indeed several arguments against using `var`, for example, unexpected behavior. `var` allows you to redeclare variables. If
someone uses the same label to assign another value, the variable will be overwritten. On the other hand, `let` and `const` won’t even
compile if you try to redeclare the variable. Maybe redeclaring a variable might be useful in your case.

If you try to access a `var` variable before its declaration, it will return `undefined` (this is **Hoisting**, which I’ll cover in the next
topic). `let` and `const` will throw a **Temporal Dead Zone** Error (also covered in the next topic).

Besides that, tools like TypeScript and ESLint will warn about these errors in IDEs like VS Code or Neovim, making it easier to prevent them
situations.

I still have my caveats with `var` because popular frameworks like React impose their own standards, and using `var` may confuse other
developers even more.

Anyway, this section has already gotten huge, but I thought it would be worth discussing further.

---

### Hoisting

**Hoisting** briefly explains most of what I explained before. It is not a term in the JavaScript specification.

`var`, `let`, `const`, and functions are hoisted differently. There’s a common misunderstanding that `const` and `let` are not hoisted.

To simplify, hoisting is more about accessing identifiers before their declarations.

- **Function Declarations**: they are initialized.

```javascript
console.log(func()); // Hello, World

function func() {
  return "Hello, World";
}
```

- **var**: initialized as `undefined`.

```javascript
console.log(foo); // undefined

var foo = "bar";
```

- **const, let**: They are kept uninitialized and stay in the **Temporal Dead Zone** (TDZ).

```javascript
console.log(foo);

const foo = "bar";

// ReferenceError: Cannot access 'foo' before initialization
```

Any access to `let` or `const` before its declaration will throw a `ReferenceError`.

#### Temporal Dead Zone

TDZ was introduced with the implementation of the `const` and `let` keywords in ES5.

The fact that explains why `const` stays on TDZ is that it wouldn’t make sense to read a constant as `undefined` before its declaration.
Theoretically, its value would be reassigned at Runtime, which could be illogical for a constant. They thought it would be a good idea to
apply the same rule to `let`.

## Execution Phase (Runtime)

Finally, after the Compile Pass, the Runtime takes over. JavaScript is Single-Threaded, so the code will be executed line by line, one after
the other.

The same communication with the Scope Manager made on the Compile Pass will be made on Runtime. The communication is based on the identifier
reference:

#### Target Reference (Left-hand side)

Basically, it’s a Target Reference when the identifier receives a value:

```javascript
function bar() {
  foo = "bar"; // left-hand side

  console.log(foo); // right-hand side
}

bar(); // right-hand side
```

#### Source Reference (Right-hand side)

Any read operation of the identifier:

```javascript
function bar() {
  foo = "bar"; // left-hand side

  console.log(foo); // right-hand side
}

bar(); // right-hand side
```

Example using the metaphor:

**Runtime**: “Hey, Scope Manager. I have `foo` in a target reference position. Do you have its reference?”

**Scope Manager**: “Yes, here’s your Marble”.

_The string `bar` is assigned to `foo`._

---

**Runtime**: “Hey, Scope Manager. I have `foo` in a source reference position. Do you have its reference?”

**Scope Manager**: “Yes, here’s your Marble”.

_`console.log` is called with the argument `foo`._

---

**Runtime**: “Hey, Scope Manager. I have `bar` in a source reference position. Do you have its reference?”

**Scope Manager**: “Yes, here’s your Marble”.

_The function `bar` is called._

### Lexical Behavior

The Lexical Behavior explains how the Runtime searches for the identifiers outside of the current scope.

Kyle explains using an analogy of searching for an apartment with number X in a building. If the building does not have a numbering based on
the floor, you’ll first search on the first floor for the apartment number. If you can’t find it there, you’ll go up one floor. With this
example, it becomes easier to understand the lexical behavior:

```javascript
var foo = "Hello, World";

function bar() {
  console.log(foo);
}

bar();
```

Same communication:

**Runtime**: “Hey, Scope Manager. I have `foo` in a source reference position. Do you have its reference?”

**Scope Manager**:“No”.

_Leaves the current floor (current floor) and goes up to the next floor (outer scope). In this case, it is the global scope._

If the reference was not found in any floor (accessible scope), a `ReferenceError` will be thrown, and an identifier will be created on the
global scope, if the "strict mode" is not enabled.

Objects like `console`, `document` are globals, and they are also searched as a reference through the communication between the Runtime x
Scope Manager, except if you override them. These objects enable communication with Web APIs via WebIDL.

##### strict mode

Speaking of `"strict mode"`, it enforces rules to prevent unexpected behavior in JavaScript. What matters in our case is that
`"strict mode"` will prevent these auto variables from being created on the global scope, and you probably want that.

## Conclusion

#### About Closures

I was thinking of writing about Closures in this study to show their relation with lexical behavior. But Closures are a huge topic that
deserves a separate study.

By and large, JavaScript is not JavaScript without Closures. Any functionality that you use that might seem “Magic” probably is using
Closures under the hood. Personally, one of the topics that most caught my attention about Closures was its usage with Asynchronicity, also
addressed on the Rethinking Asynchronous Javascript workshop from Kyle, so there’s a lot to discuss about it.

#### Dynamic Scoping

This was already a huge study, only explaining about Scopes in general, so as I mentioned in the beginning, the next study is about Dynamic
Scoping using `this`.
