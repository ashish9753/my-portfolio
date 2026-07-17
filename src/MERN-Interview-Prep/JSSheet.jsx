import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

// ─── JavaScript syntax highlighter (VS Code dark colors) ──────────────────────
const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'class', 'extends', 'super', 'typeof',
  'instanceof', 'in', 'of', 'async', 'await', 'yield', 'try', 'catch', 'finally',
  'throw', 'delete', 'void', 'import', 'export', 'from', 'default', 'static', 'get',
  'set', 'this',
]);
const JS_LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
const JS_BUILTINS = new Set([
  'console', 'Math', 'Object', 'Array', 'JSON', 'Promise', 'Map', 'Set', 'Symbol',
  'BigInt', 'Number', 'String', 'Boolean', 'Date', 'WeakMap', 'WeakSet', 'document',
  'window', 'Error', 'RegExp', 'Function', 'localStorage', 'sessionStorage', 'fetch',
  'setTimeout', 'setInterval', 'structuredClone',
]);

function highlightJSLine(line) {
  const tokens = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    const ch = line[i];

    // Line comment  // ...
    if (ch === '/' && line[i + 1] === '/') {
      tokens.push(<span key={i} style={{ color: '#6a9955' }}>{line.slice(i)}</span>);
      break;
    }

    // Strings  '...'  "..."  `...`
    if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1;
      while (j < n && line[j] !== ch) {
        if (line[j] === '\\') j++;
        j++;
      }
      tokens.push(<span key={i} style={{ color: '#ce9178' }}>{line.slice(i, Math.min(j + 1, n))}</span>);
      i = j + 1;
      continue;
    }

    // Identifiers / keywords
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[\w$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      // is it a function call?  word followed by (
      let k = j;
      while (k < n && line[k] === ' ') k++;
      const isCall = line[k] === '(';

      let color = '#9cdcfe'; // default identifier (light blue)
      if (JS_KEYWORDS.has(word)) color = '#569cd6';
      else if (JS_LITERALS.has(word)) color = '#569cd6';
      else if (JS_BUILTINS.has(word)) color = '#4ec9b0';
      else if (isCall) color = '#dcdcaa';
      tokens.push(<span key={i} style={{ color }}>{word}</span>);
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9._exXa-fA-F]/.test(line[j])) j++;
      tokens.push(<span key={i} style={{ color: '#b5cea8' }}>{line.slice(i, j)}</span>);
      i = j;
      continue;
    }

    // Everything else (punctuation, operators)
    tokens.push(<span key={i} style={{ color: '#d4d4d4' }}>{ch}</span>);
    i++;
  }
  return tokens.length ? tokens : <span style={{ color: '#d4d4d4' }}>{' '}</span>;
}

// ─── Answer renderer: splits ``` fenced blocks from prose ─────────────────────
// A block may start with a tag:  ```output  → plain output box (no highlight)
// Anything else is treated as highlighted JavaScript.
function renderJSAnswer(text) {
  const lines = text.split('\n');
  const segments = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('```')) {
      const tag = trimmed.slice(3).trim().toLowerCase();
      i++;
      const blockLines = [];
      while (i < lines.length && lines[i].trim() !== '```') {
        blockLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      segments.push({ type: 'code', tag, lines: blockLines });
    } else {
      const textLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        textLines.push(lines[i]);
        i++;
      }
      const content = textLines.join('\n').trim();
      if (content) segments.push({ type: 'text', content });
    }
  }

  return segments.map((seg, idx) => {
    if (seg.type === 'code') {
      const isOutput = seg.tag === 'output' || seg.tag === 'text';
      const label = isOutput ? 'OUTPUT' : 'EXAMPLE';
      return (
        <div key={idx} className="my-3 rounded-lg overflow-hidden border border-[#333] shadow-lg">
          <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{label}</span>
          </div>
          <pre className="bg-[#1e1e1e] px-5 py-3 overflow-x-auto font-mono text-[13px] leading-6 m-0 whitespace-pre">
            {seg.lines.map((line, li) => (
              <div key={li}>
                {isOutput ? <span style={{ color: '#9aa0a6' }}>{line || ' '}</span> : highlightJSLine(line)}
              </div>
            ))}
          </pre>
        </div>
      );
    }
    return (
      <div key={idx} className="text-[15px] text-yellow-300/80 leading-relaxed whitespace-pre-line">
        {seg.content}
      </div>
    );
  });
}

// ─── JavaScript Revision Content (detailed, example-driven) ───────────────────
const revisionSections = [
  {
    title: '🔹 1. Basics',
    questions: [
      {
        q: 'What is JavaScript?',
        a: `JavaScript is a high-level, interpreted programming language that makes web pages interactive.

Key points to remember:
• High-level → you don't manage memory manually.
• Interpreted → runs line by line (no separate compile step for you).
• Single-threaded → does one thing at a time, using an event loop for async work.
• Dynamically typed → a variable can hold any type, and can change type.
• Runs in the browser AND on the server (Node.js).

\`\`\`
let x = 10;        // number today...
x = "hello";       // ...string tomorrow. JS allows it.
console.log(typeof x);
\`\`\`
\`\`\`output
string
\`\`\`
Remember: JS controls behaviour (HTML = structure, CSS = style, JS = logic).`,
      },
      {
        q: 'What are the primitive data types?',
        a: `A primitive is a basic value that is NOT an object and has no methods of its own. JS has 7 primitives:

• string   → text, "hello"
• number   → any number, 10 or 3.14
• boolean  → true / false
• null     → intentional "empty"
• undefined→ "not assigned yet"
• symbol   → unique identifier
• bigint   → very large integers, 900n

Everything else (arrays, functions, objects) is an "object" (non-primitive).

\`\`\`
console.log(typeof "hi");      // string
console.log(typeof 42);        // number
console.log(typeof true);      // boolean
console.log(typeof undefined); // undefined
console.log(typeof 10n);       // bigint
console.log(typeof Symbol());  // symbol
\`\`\`
Remember: primitives are copied by VALUE, objects are copied by REFERENCE.`,
      },
      {
        q: 'var vs let vs const?',
        a: `All three declare variables, but they behave very differently.

• var   → function-scoped, can be re-declared & re-assigned, hoisted as undefined. (old, avoid)
• let   → block-scoped, can be re-assigned but NOT re-declared in same scope.
• const → block-scoped, CANNOT be re-assigned (but object contents can still change).

\`\`\`
function test() {
  if (true) {
    var a = 1;   // leaks OUT of the block
    let b = 2;   // stays INSIDE the block
  }
  console.log(a); // 1  ✅ var escaped
  console.log(b); // ❌ ReferenceError
}
\`\`\`
const with objects — the binding is fixed, the data is not:
\`\`\`
const user = { name: "Ashish" };
user.name = "Rahul";   // ✅ allowed (changing contents)
user = {};             // ❌ TypeError (re-assigning)
\`\`\`
Remember: use const by default, let when you must reassign, never var.`,
      },
      {
        q: 'What is hoisting?',
        a: `Hoisting means JavaScript moves declarations to the TOP of their scope before running the code.

• var declarations are hoisted and set to undefined.
• function declarations are hoisted COMPLETELY (you can call them before they appear).
• let & const are hoisted but NOT initialised → the "Temporal Dead Zone".

\`\`\`
console.log(a);   // undefined  (var is hoisted as undefined)
var a = 5;

greet();          // "Hi!"  ✅ function fully hoisted
function greet() { console.log("Hi!"); }

console.log(b);   // ❌ ReferenceError (TDZ)
let b = 10;
\`\`\`
Remember: only declarations move up, assignments stay in place.`,
      },
      {
        q: 'What is scope?',
        a: `Scope decides WHERE a variable can be accessed. There are 3 kinds:

• Global scope   → declared outside everything, accessible anywhere.
• Function scope → declared inside a function, only usable there.
• Block scope    → let/const inside { } , only usable in that block.

\`\`\`
let g = "global";

function outer() {
  let f = "function";
  if (true) {
    let b = "block";
    console.log(g, f, b); // all 3 visible here
  }
  console.log(b);         // ❌ error, b is block-scoped
}
\`\`\`
Remember: inner scopes can see outer variables, not the other way around.`,
      },
      {
        q: '== vs === ?',
        a: `Both compare values, but == is loose and === is strict.

• ==  compares AFTER converting types (type coercion). Risky.
• === compares value AND type. No conversion. Safe — always prefer this.

\`\`\`
console.log(5 == "5");    // true   (string "5" converted to number)
console.log(5 === "5");   // false  (number vs string)
console.log(0 == false);  // true   (false becomes 0)
console.log(0 === false); // false  (number vs boolean)
console.log(null == undefined);  // true
console.log(null === undefined); // false
\`\`\`
Remember: use === almost always to avoid surprise conversions.`,
      },
      {
        q: 'Truthy & falsy values?',
        a: `Every value in JS is either "truthy" or "falsy" when used in a condition.

There are exactly 8 FALSY values — memorise these:
• false
• 0  and  -0
• ""  (empty string)
• null
• undefined
• NaN
• 0n  (bigint zero)

EVERYTHING else is truthy — including "0" (string), [], {}, "false".

\`\`\`
if ("")        console.log("no");   // skipped (falsy)
if ([])        console.log("yes");  // runs  (empty array is truthy!)
if ("0")       console.log("yes");  // runs  (non-empty string)
if (0)         console.log("no");   // skipped
\`\`\`
Remember: [] and {} are TRUTHY even though they look "empty".`,
      },
      {
        q: 'What is type coercion?',
        a: `Type coercion is JavaScript automatically converting one type into another.

Two kinds:
• Implicit → JS does it for you (often during + or ==).
• Explicit → you do it on purpose (Number(), String(), Boolean()).

The + operator prefers strings; other math operators prefer numbers.

\`\`\`
console.log("5" + 1);   // "51"  (number → string, concatenation)
console.log("5" - 1);   // 4     (string → number, subtraction)
console.log("5" * 2);   // 10
console.log(true + 1);  // 2     (true → 1)
console.log([] + {});   // "[object Object]"
\`\`\`
Explicit is clearer:
\`\`\`
console.log(Number("5") + 1); // 6
\`\`\`
Remember: "+" with a string = glue; other operators = math.`,
      },
      {
        q: 'What is NaN?',
        a: `NaN means "Not a Number" — the result of an invalid or impossible number operation.

Strange but important: NaN is the only value in JS that is NOT equal to itself.

\`\`\`
console.log(0 / 0);          // NaN
console.log("abc" * 3);      // NaN
console.log(Number("hello"));// NaN

console.log(NaN === NaN);    // false !!
console.log(isNaN(NaN));     // true
console.log(Number.isNaN(NaN)); // true (safer check)
\`\`\`
Remember: to test for NaN use Number.isNaN(x), never x === NaN.`,
      },
      {
        q: 'undefined vs null?',
        a: `Both represent "no value", but the intent is different.

• undefined → JS's default: a variable declared but not assigned, or a missing value.
• null      → YOUR choice: you deliberately set something to "empty".

\`\`\`
let a;
console.log(a);           // undefined  (JS set it)

let b = null;
console.log(b);           // null       (you set it)

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object"  (famous JS bug!)

console.log(null == undefined);  // true  (loose)
console.log(null === undefined); // false (strict)
\`\`\`
Remember: undefined = "not set by JS", null = "emptied on purpose".`,
      },
      {
        q: 'What is a template literal?',
        a: `A template literal is a string written with backticks instead of quotes. It lets you:
• Insert variables/expressions with a dollar sign and braces
• Write multi-line strings easily

\`\`\`
const name = "Ashish";
const age = 22;

// Old way (concatenation)
const s1 = "Hi " + name + ", age " + age;

// Template literal
const s2 = \`Hi \${name}, age \${age}\`;

// Multi-line string
const s3 = \`Line 1
Line 2\`;

console.log(s2); // Hi Ashish, age 22
\`\`\`
You can even run expressions inside the braces:
\`\`\`
console.log(\`Next year: \${age + 1}\`); // Next year: 23
\`\`\`
Remember: backticks + \${} = clean string building.`,
      },
      {
        q: 'What is destructuring?',
        a: `Destructuring unpacks values from arrays or objects into separate variables in one line.

\`\`\`
// Array destructuring — by position
const [a, b] = [10, 20];
console.log(a, b); // 10 20

// Object destructuring — by key name
const user = { name: "Ashish", city: "Delhi" };
const { name, city } = user;
console.log(name, city); // Ashish Delhi

// Rename + default value
const { name: n, age = 18 } = user;
console.log(n, age); // Ashish 18  (age missing → default)

// Swap variables easily
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1
\`\`\`
Remember: arrays destructure by position, objects by key name.`,
      },
      {
        q: 'What is the spread operator?',
        a: `The spread operator ( ... ) expands / spreads out the elements of an array or object.

Common uses: copying, merging, and passing arrays as arguments.

\`\`\`
// Copy an array (shallow)
const nums = [1, 2, 3];
const copy = [...nums];

// Merge arrays
const merged = [...nums, 4, 5]; // [1,2,3,4,5]

// Merge / clone objects
const a = { x: 1 };
const b = { ...a, y: 2 };       // { x:1, y:2 }

// Spread into a function
console.log(Math.max(...nums)); // 3
\`\`\`
Remember: spread "unpacks" values OUT; rest (below) "packs" values IN.`,
      },
      {
        q: 'What is the rest operator?',
        a: `The rest operator ( ... ) collects multiple remaining values into a single array. Same symbol as spread, opposite job.

\`\`\`
// Collect all arguments into one array
function sum(...nums) {
  return nums.reduce((t, n) => t + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Rest in destructuring — grab "the rest"
const [first, ...others] = [10, 20, 30, 40];
console.log(first);  // 10
console.log(others); // [20, 30, 40]
\`\`\`
Remember: rest must be the LAST parameter. Spread unpacks, rest gathers.`,
      },
      {
        q: 'map() vs forEach()?',
        a: `Both loop over an array, but they differ in what they return.

• map()     → RETURNS a brand-new array (transforms each item). Chainable.
• forEach() → returns undefined (just runs code for side-effects).

\`\`\`
const nums = [1, 2, 3];

const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6]  ✅ new array

const result = nums.forEach(n => n * 2);
console.log(result);  // undefined  ❌ nothing returned
\`\`\`
Rule of thumb:
• Need a new array → use map().
• Just doing something (logging, saving) → use forEach().
Remember: map transforms, forEach just visits.`,
      },
      {
        q: 'What is an object?',
        a: `An object is a collection of related data stored as key–value pairs (also called properties).

Keys are strings (or symbols); values can be anything, even functions (then called "methods").

\`\`\`
const user = {
  name: "Ashish",
  age: 22,
  greet() {                 // method
    return "Hi " + this.name;
  }
};

console.log(user.name);     // dot notation → "Ashish"
console.log(user["age"]);   // bracket notation → 22
console.log(user.greet());  // "Hi Ashish"

user.city = "Delhi";        // add a new property
delete user.age;            // remove a property
\`\`\`
Remember: use bracket notation when the key is dynamic or has spaces.`,
      },
      {
        q: 'What is optional chaining ( ?. )?',
        a: `Optional chaining ( ?. ) safely reads deep properties. If something is null/undefined, it stops and returns undefined instead of throwing an error.

\`\`\`
const user = { name: "Ashish" };

// Without ?.  → crashes
console.log(user.address.city); // ❌ TypeError

// With ?.  → safe
console.log(user.address?.city); // undefined ✅ no crash

// Works on methods and arrays too
console.log(user.greet?.());     // undefined (no error)
console.log(user.friends?.[0]);  // undefined
\`\`\`
Combine with ?? for a fallback:
\`\`\`
const city = user.address?.city ?? "Unknown";
console.log(city); // "Unknown"
\`\`\`
Remember: ?. = "check exists before going deeper".`,
      },
      {
        q: 'What is typeof?',
        a: `typeof is an operator that tells you the data type of a value, as a string.

\`\`\`
console.log(typeof "hi");      // "string"
console.log(typeof 10);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof {});        // "object"
console.log(typeof []);        // "object"  (arrays are objects!)
console.log(typeof null);      // "object"  (historic bug)
console.log(typeof function(){}); // "function"
\`\`\`
To truly detect an array, use Array.isArray():
\`\`\`
console.log(Array.isArray([1,2])); // true
\`\`\`
Remember: typeof null === "object" is a famous JS quirk.`,
      },
      {
        q: 'What is isNaN()?',
        a: `isNaN() checks whether a value is (or becomes) NaN — "Not a Number".

Careful: the global isNaN() first coerces the value, which can mislead. Number.isNaN() is stricter and safer.

\`\`\`
console.log(isNaN(NaN));       // true
console.log(isNaN("hello"));   // true  ("hello" → NaN)
console.log(isNaN("123"));     // false ("123" → 123)
console.log(isNaN("12px"));    // true

// Safer, no coercion:
console.log(Number.isNaN("hello")); // false (it's a string, not NaN)
console.log(Number.isNaN(NaN));     // true
\`\`\`
Remember: prefer Number.isNaN() — it only says true for the actual NaN value.`,
      },
      {
        q: 'How to clone an object?',
        a: `Cloning makes a copy so changes to the copy don't affect the original.

Shallow clone (top level only):
\`\`\`
const user = { name: "Ashish", city: "Delhi" };

const c1 = { ...user };            // spread
const c2 = Object.assign({}, user);// Object.assign
\`\`\`
Problem — nested objects are still SHARED with a shallow clone:
\`\`\`
const a = { info: { age: 22 } };
const b = { ...a };
b.info.age = 99;
console.log(a.info.age); // 99  ❌ original changed!
\`\`\`
Deep clone (fully independent copy):
\`\`\`
const deep = structuredClone(a);   // modern & best
// older trick: JSON.parse(JSON.stringify(a))
\`\`\`
Remember: spread = shallow, structuredClone = deep.`,
      },
    ],
  },
  {
    title: '🔹 2. Functions',
    questions: [
      {
        q: 'Function declaration?',
        a: `A function declaration defines a named function using the function keyword. It is fully HOISTED, so you can call it before it is written.

\`\`\`
greet();  // ✅ works — declarations are hoisted

function greet() {
  console.log("Hello!");
}
\`\`\`
Remember: declaration = has a name + is hoisted completely.`,
      },
      {
        q: 'Function expression?',
        a: `A function expression stores a function inside a variable. It is NOT hoisted — you can only call it after the line runs.

\`\`\`
sayHi(); // ❌ TypeError: sayHi is not a function

const sayHi = function () {
  console.log("Hi!");
};

sayHi(); // ✅ works now
\`\`\`
It can be anonymous (no name) or named. Because it's assigned to a const/let, the TDZ rules apply.
Remember: expression = assigned to a variable + not usable before its line.`,
      },
      {
        q: 'Arrow function?',
        a: `An arrow function is a shorter syntax for writing functions, introduced in ES6.

\`\`\`
// Normal
const add = function (a, b) { return a + b; };

// Arrow (implicit return, one line)
const add2 = (a, b) => a + b;

// One parameter → parentheses optional
const square = x => x * x;

// No parameters → empty ()
const hi = () => console.log("hi");

// Returning an object → wrap in ()
const make = () => ({ id: 1 });
\`\`\`
Key difference: arrow functions do NOT have their own this (see next question).
Remember: arrows are short AND borrow this from where they are defined.`,
      },
      {
        q: 'Arrow vs normal function?',
        a: `The biggest difference is how they handle this.

• Normal function → gets its OWN this (depends on how it's called).
• Arrow function  → has NO own this; it uses the this of the surrounding scope (lexical this).

\`\`\`
const obj = {
  name: "Ashish",
  normal: function () {
    console.log(this.name); // "Ashish"  (this = obj)
  },
  arrow: () => {
    console.log(this.name); // undefined (this = outer scope)
  }
};
obj.normal();
obj.arrow();
\`\`\`
Other differences:
• Arrows have no arguments object.
• Arrows cannot be used as constructors (no new).
Remember: don't use arrow functions as object methods that need this.`,
      },
      {
        q: 'Callback function?',
        a: `A callback is a function passed INTO another function, to be called ("called back") later.

They power almost all async and array work in JS.

\`\`\`
function greet(name, callback) {
  console.log("Hi " + name);
  callback();               // call it back
}

greet("Ashish", function () {
  console.log("Callback ran!");
});
\`\`\`
Everyday example — array methods take callbacks:
\`\`\`
[1, 2, 3].forEach(function (n) {
  console.log(n);
});
\`\`\`
Remember: a callback is just "a function given to another function to run later".`,
      },
      {
        q: 'Higher-order function?',
        a: `A higher-order function (HOF) is a function that either:
• takes another function as an argument, OR
• returns a function.

map, filter, reduce, forEach are all HOFs.

\`\`\`
// Takes a function
[1, 2, 3].map(n => n * 2);

// Returns a function
function multiplier(factor) {
  return function (n) {
    return n * factor;
  };
}
const double = multiplier(2);
console.log(double(5)); // 10
\`\`\`
Remember: HOFs treat functions like normal values (pass them around, return them).`,
      },
      {
        q: 'Pure function?',
        a: `A pure function:
1. Always returns the SAME output for the same input.
2. Has NO side effects (doesn't change outside state, doesn't touch DOM/network/global vars).

Pure functions are predictable and easy to test.

\`\`\`
// ✅ Pure
function add(a, b) {
  return a + b;
}

// ❌ Impure — depends on & changes outside state
let total = 0;
function addToTotal(n) {
  total += n;     // side effect
  return total;
}
\`\`\`
Remember: same input → same output, and nothing outside changes.`,
      },
      {
        q: 'What is an IIFE?',
        a: `IIFE = Immediately Invoked Function Expression. A function that runs the moment it is defined. It was used to create a private scope and avoid polluting global variables.

\`\`\`
(function () {
  const secret = "hidden";
  console.log("Runs immediately!");
})();

// Arrow version
(() => {
  console.log("IIFE with arrow");
})();
\`\`\`
The wrapping ( ) turns the declaration into an expression, and the final () calls it.
Remember: IIFE = define + run instantly, keeps variables private.`,
      },
      {
        q: 'What is currying?',
        a: `Currying transforms a function that takes many arguments into a chain of functions that each take ONE argument.

\`\`\`
// Normal
function add(a, b, c) { return a + b + c; }

// Curried
function curryAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log(add(1, 2, 3));        // 6
console.log(curryAdd(1)(2)(3));   // 6
\`\`\`
Useful for reusing part of a function:
\`\`\`
const add5 = curryAdd(5);
console.log(add5(10)(20)); // 35
\`\`\`
Remember: currying = one argument at a time, returning functions.`,
      },
      {
        q: 'call(), apply(), bind()?',
        a: `All three let you control what this refers to inside a function.

• call  → calls the function now, arguments listed one by one.
• apply → calls the function now, arguments given as an ARRAY.
• bind  → returns a NEW function with this locked in (call it later).

\`\`\`
function intro(city, country) {
  console.log(this.name + " from " + city + ", " + country);
}
const user = { name: "Ashish" };

intro.call(user, "Delhi", "India");   // now, comma args
intro.apply(user, ["Delhi", "India"]);// now, array args

const bound = intro.bind(user, "Delhi");
bound("India");                        // later
\`\`\`
Remember: call = commas, Apply = Array, Bind = returns bound copy.`,
      },
      {
        q: 'Lexical scope?',
        a: `Lexical scope means a function's access to variables is decided by WHERE it is written in the code, not where it is called from.

Inner functions can read variables from their outer functions.

\`\`\`
function outer() {
  const msg = "hello";
  function inner() {
    console.log(msg); // ✅ can see outer's variable
  }
  inner();
}
outer(); // "hello"
\`\`\`
This is the foundation of closures.
Remember: "lexical" = based on the physical location in the source code.`,
      },
      {
        q: 'What is recursion?',
        a: `Recursion is when a function calls ITSELF to solve a smaller version of the same problem.

Every recursion needs a BASE CASE to stop, or it runs forever (stack overflow).

\`\`\`
function factorial(n) {
  if (n <= 1) return 1;        // base case (stop)
  return n * factorial(n - 1); // recursive case (smaller)
}
console.log(factorial(5)); // 120

// 5*4*3*2*1 = 120
\`\`\`
Remember: base case = the exit door; without it, infinite loop.`,
      },
      {
        q: 'Generator function?',
        a: `A generator is a special function that can PAUSE and RESUME. It is written with function* and uses yield to pause and hand back a value.

\`\`\`
function* count() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = count();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
console.log(gen.next().done);  // true
\`\`\`
Calling the generator does NOT run it — it returns an iterator you step through with .next().
Remember: function* + yield = pausable function producing values on demand.`,
      },
      {
        q: 'What is the arguments object?',
        a: `arguments is an array-LIKE object available inside normal functions that holds all the arguments passed in — even ones you didn't name.

\`\`\`
function total() {
  let sum = 0;
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}
console.log(total(1, 2, 3, 4)); // 10
\`\`\`
Warning: it is NOT a real array (no map/filter) and arrow functions don't have it. Modern code uses rest parameters instead:
\`\`\`
const total2 = (...nums) => nums.reduce((a, b) => a + b, 0);
\`\`\`
Remember: arguments = old way; rest (...nums) = modern, real array.`,
      },
      {
        q: 'Default parameters?',
        a: `Default parameters give a function argument a fallback value when the caller passes nothing (or undefined).

\`\`\`
function greet(name = "Guest") {
  console.log("Hi " + name);
}
greet("Ashish"); // Hi Ashish
greet();          // Hi Guest  (used default)

// Defaults can use earlier params or expressions
function price(amount, tax = amount * 0.1) {
  return amount + tax;
}
console.log(price(100)); // 110
\`\`\`
Note: only undefined triggers the default, not null.
Remember: default kicks in only when the argument is missing/undefined.`,
      },
    ],
  },
  {
    title: '🔹 3. Arrays & Objects',
    questions: [
      {
        q: 'slice() vs splice()?',
        a: `Easy to confuse — the key difference is whether the original array changes.

• slice()  → RETURNS a copy of a portion. Does NOT change original. (safe)
• splice() → CHANGES the original by removing/adding items. Returns removed items.

\`\`\`
const arr = [1, 2, 3, 4, 5];

// slice(start, end)  — end not included
console.log(arr.slice(1, 3)); // [2, 3]
console.log(arr);             // [1,2,3,4,5]  unchanged ✅

// splice(start, deleteCount, ...add)
const removed = arr.splice(1, 2, "a", "b");
console.log(removed);         // [2, 3]
console.log(arr);             // [1, "a", "b", 4, 5]  changed ❗
\`\`\`
Remember: sLice = copy (safe), sPlice = modify (mutates).`,
      },
      {
        q: 'What does reduce() do?',
        a: `reduce() boils an entire array down to a SINGLE value (a sum, a max, an object, etc).

It takes a callback (accumulator, current) and an initial value.

\`\`\`
const nums = [1, 2, 3, 4];

// Sum
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum); // 10

// How it flows (start acc = 0):
// 0+1=1 → 1+2=3 → 3+3=6 → 6+4=10
\`\`\`
Powerful example — count occurrences:
\`\`\`
const fruits = ["apple", "banana", "apple"];
const count = fruits.reduce((acc, f) => {
  acc[f] = (acc[f] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 2, banana: 1 }
\`\`\`
Remember: reduce = "fold many values into one".`,
      },
      {
        q: 'How to remove duplicates from an array?',
        a: `The cleanest way is a Set, which only stores unique values. Spread it back into an array.

\`\`\`
const nums = [1, 2, 2, 3, 3, 3, 4];

const unique = [...new Set(nums)];
console.log(unique); // [1, 2, 3, 4]
\`\`\`
Alternative with filter (keeps first occurrence):
\`\`\`
const u2 = nums.filter((n, i) => nums.indexOf(n) === i);
console.log(u2); // [1, 2, 3, 4]
\`\`\`
Remember: [...new Set(arr)] is the one-liner to memorise.`,
      },
      {
        q: 'Shallow copy vs deep copy?',
        a: `A shallow copy duplicates only the TOP level. Nested objects/arrays are still shared (same reference). A deep copy duplicates everything, fully independent.

\`\`\`
const original = { name: "Ashish", info: { age: 22 } };

// Shallow
const shallow = { ...original };
shallow.info.age = 99;
console.log(original.info.age); // 99 ❌ shared nested object

// Deep
const deep = structuredClone(original);
deep.info.age = 50;
console.log(original.info.age); // 99 ✅ untouched
\`\`\`
Remember: shallow = top level only; deep = every level copied.`,
      },
      {
        q: 'Object.keys() / values() / entries()?',
        a: `These three turn an object into arrays so you can loop over it.

\`\`\`
const user = { name: "Ashish", age: 22 };

console.log(Object.keys(user));    // ["name", "age"]
console.log(Object.values(user));  // ["Ashish", 22]
console.log(Object.entries(user)); // [["name","Ashish"], ["age",22]]
\`\`\`
Loop over an object nicely:
\`\`\`
for (const [key, value] of Object.entries(user)) {
  console.log(key + " = " + value);
}
// name = Ashish
// age = 22
\`\`\`
Remember: keys, values, entries → arrays you can map/loop.`,
      },
      {
        q: 'Object.freeze()?',
        a: `Object.freeze() locks an object so it cannot be changed — no adding, deleting, or editing properties.

\`\`\`
const config = { mode: "dark" };
Object.freeze(config);

config.mode = "light"; // ignored (silent, or error in strict mode)
config.size = 10;      // ignored
console.log(config);   // { mode: "dark" }

console.log(Object.isFrozen(config)); // true
\`\`\`
Note: it is SHALLOW — nested objects can still change unless you freeze them too.
Remember: freeze = read-only object (top level).`,
      },
      {
        q: 'JSON.stringify()?',
        a: `JSON.stringify() converts a JavaScript object/array into a JSON STRING — needed to send data over a network or save to localStorage.

\`\`\`
const user = { name: "Ashish", age: 22 };

const str = JSON.stringify(user);
console.log(str);        // '{"name":"Ashish","age":22}'
console.log(typeof str); // "string"

// Pretty print with 2-space indent
console.log(JSON.stringify(user, null, 2));
\`\`\`
Note: functions and undefined are dropped during conversion.
Remember: stringify = object → string (to store/send).`,
      },
      {
        q: 'JSON.parse()?',
        a: `JSON.parse() does the reverse of stringify — it turns a JSON STRING back into a real JavaScript object.

\`\`\`
const str = '{"name":"Ashish","age":22}';

const obj = JSON.parse(str);
console.log(obj.name);   // "Ashish"
console.log(typeof obj); // "object"
\`\`\`
Common pair — the "poor man's deep clone":
\`\`\`
const clone = JSON.parse(JSON.stringify(original));
\`\`\`
Warning: invalid JSON throws an error, so wrap in try/catch when unsure.
Remember: parse = string → object (to use it).`,
      },
      {
        q: 'What is a Map?',
        a: `A Map is a collection of key–value pairs where the key can be ANY type (object, function, number), not just strings. It also remembers insertion order.

\`\`\`
const m = new Map();
m.set("name", "Ashish");
m.set(1, "one");
const objKey = { id: 1 };
m.set(objKey, "object as key");

console.log(m.get("name"));  // "Ashish"
console.log(m.has(1));       // true
console.log(m.size);         // 3
m.delete(1);

for (const [k, v] of m) {
  console.log(k, v);
}
\`\`\`
Remember: Map = keys of any type + easy .size + ordered.`,
      },
      {
        q: 'What is a Set?',
        a: `A Set is a collection that stores only UNIQUE values — duplicates are automatically ignored.

\`\`\`
const s = new Set();
s.add(1);
s.add(2);
s.add(2);   // ignored (already exists)

console.log(s.size);      // 2
console.log(s.has(1));    // true
s.delete(1);

// Remove duplicates from an array
const unique = [...new Set([1, 1, 2, 3])];
console.log(unique); // [1, 2, 3]
\`\`\`
Remember: Set = a bag of unique values.`,
      },
      {
        q: 'Map vs Object?',
        a: `Both store key–value pairs, but they differ in capability.

\`\`\`
Feature          Map                 Object
Key types        ANY (obj, number)   strings / symbols only
Size             map.size            manual (Object.keys.length)
Order            insertion order     mostly, but not guaranteed
Iteration        directly iterable   need Object.entries()
Performance      better for frequent add/delete
\`\`\`
\`\`\`
const map = new Map([[1, "a"]]);
const obj = { 1: "a" };  // key becomes the string "1"

console.log(map.get(1)); // "a"
console.log(obj[1]);     // "a" (but key is really "1")
\`\`\`
Remember: use Object for simple records, Map for dynamic/any-type keys.`,
      },
      {
        q: 'Array.isArray()?',
        a: `Array.isArray() reliably checks whether a value is an array. You need it because typeof an array returns "object".

\`\`\`
console.log(typeof [1, 2]);        // "object"  ❌ not helpful

console.log(Array.isArray([1, 2])); // true  ✅
console.log(Array.isArray("hi"));   // false
console.log(Array.isArray({}));     // false
\`\`\`
Remember: typeof can't spot arrays — use Array.isArray().`,
      },
      {
        q: 'How does sort() work?',
        a: `sort() orders an array IN PLACE. By default it converts items to strings, which surprises people with numbers.

\`\`\`
// Default = string comparison
console.log([10, 2, 1].sort()); // [1, 10, 2]  ❌ wrong for numbers!
\`\`\`
Provide a compare function for correct numeric sorting:
\`\`\`
const nums = [10, 2, 1];
nums.sort((a, b) => a - b); // ascending
console.log(nums);          // [1, 2, 10]

nums.sort((a, b) => b - a); // descending → [10, 2, 1]
\`\`\`
The rule: return negative → a first, positive → b first, 0 → keep order.
Remember: always pass (a, b) => a - b for numbers.`,
      },
      {
        q: 'find() vs filter()?',
        a: `Both search an array with a condition, but return different things.

• find()   → returns the FIRST matching element (or undefined).
• filter() → returns a NEW ARRAY of ALL matching elements.

\`\`\`
const nums = [5, 12, 8, 20];

console.log(nums.find(n => n > 10));   // 12   (first match)
console.log(nums.filter(n => n > 10)); // [12, 20] (all matches)

console.log(nums.find(n => n > 100));  // undefined
console.log(nums.filter(n => n > 100));// []
\`\`\`
Remember: find = one item, filter = list of items.`,
      },
    ],
  },
  {
    title: '🔹 4. Asynchronous JavaScript',
    questions: [
      {
        q: 'Synchronous vs Asynchronous?',
        a: `• Synchronous  → code runs line by line; each line WAITS for the previous one. A slow task blocks everything.
• Asynchronous → slow tasks (network, timers) run in the background; the rest of the code keeps going and the result comes later.

\`\`\`
console.log("1");

setTimeout(() => console.log("2 (later)"), 1000);

console.log("3");
\`\`\`
\`\`\`output
1
3
2 (later)
\`\`\`
Notice "3" printed before "2" — the timer ran asynchronously without blocking.
Remember: sync = wait in line, async = keep moving, finish later.`,
      },
      {
        q: 'What is callback hell?',
        a: `Callback hell is when many async callbacks are nested inside each other, creating a "pyramid of doom" that is hard to read and maintain.

\`\`\`
getUser(1, (user) => {
  getOrders(user, (orders) => {
    getDetails(orders[0], (details) => {
      getPayment(details, (payment) => {
        console.log(payment); // deeply nested 😵
      });
    });
  });
});
\`\`\`
The fix: Promises (.then chains) and even cleaner, async/await.
Remember: callback hell = deep nesting; Promises/async-await flatten it.`,
      },
      {
        q: 'What is a Promise?',
        a: `A Promise is an object that represents a value that will be available in the FUTURE — the result of an async operation.

You attach .then() for success and .catch() for errors.

\`\`\`
const promise = new Promise((resolve, reject) => {
  const ok = true;
  if (ok) resolve("Success!");
  else    reject("Failed!");
});

promise
  .then(result => console.log(result)) // "Success!"
  .catch(error => console.log(error))
  .finally(() => console.log("Done"));
\`\`\`
Remember: a Promise is a placeholder for a future result (success or failure).`,
      },
      {
        q: 'What are the Promise states?',
        a: `A Promise is always in exactly one of three states:

• Pending   → initial state, still working.
• Fulfilled → completed successfully (resolve was called).
• Rejected  → failed (reject was called or an error occurred).

Once it becomes fulfilled or rejected it is "settled" and can never change again.

\`\`\`
const p = new Promise((resolve) => {
  setTimeout(() => resolve("done"), 1000);
});
// Right now: Pending
// After 1s:  Fulfilled with "done"
\`\`\`
Remember: Pending → Fulfilled or Rejected (settled, final).`,
      },
      {
        q: 'What is async/await?',
        a: `async/await is cleaner syntax for Promises — it lets you write asynchronous code that READS like synchronous code.

• async → marks a function that returns a Promise.
• await → pauses inside that function until a Promise settles.

\`\`\`
async function getUser() {
  try {
    const res  = await fetch("/api/user");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log("Error:", err);
  }
}
getUser();
\`\`\`
Same logic with .then() would be nested; await flattens it.
Remember: await = "wait here for the Promise", inside an async function.`,
      },
      {
        q: 'try/catch in async code?',
        a: `try/catch handles errors. In async/await it replaces the Promise .catch(), keeping success and error logic together.

\`\`\`
async function loadData() {
  try {
    const res  = await fetch("/api/data");
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Something failed:", err.message);
  } finally {
    console.log("Always runs (cleanup)");
  }
}
\`\`\`
Remember: wrap awaits in try/catch; finally runs no matter what.`,
      },
      {
        q: 'What is the event loop?',
        a: `The event loop is the mechanism that lets single-threaded JavaScript handle async tasks without blocking.

Simplified flow:
1. Run all synchronous code (the Call Stack).
2. When the stack is empty, run all Microtasks (Promises).
3. Then run one Macrotask (setTimeout, events), and repeat.

\`\`\`
console.log("1");                       // sync
setTimeout(() => console.log("2"), 0);  // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4");                       // sync
\`\`\`
\`\`\`output
1
4
3   (microtask runs before timers)
2
\`\`\`
Remember: sync first → microtasks (Promises) → macrotasks (timers).`,
      },
      {
        q: 'What is the call stack?',
        a: `The call stack tracks which function is currently running. It works LIFO (Last In, First Out) — the last function called is the first to finish.

\`\`\`
function a() { b(); }
function b() { c(); }
function c() { console.log("done"); }
a();

// Stack builds:  a → a,b → a,b,c
// Then unwinds:  c pops → b pops → a pops
\`\`\`
If it gets too deep (e.g. infinite recursion) you get "Maximum call stack size exceeded".
Remember: call stack = a to-do list of running functions, LIFO.`,
      },
      {
        q: 'Microtask vs Macrotask queue?',
        a: `Async callbacks wait in queues. Microtasks have HIGHER priority than macrotasks.

• Microtasks → Promise .then/.catch, queueMicrotask. Run FIRST, all of them.
• Macrotasks → setTimeout, setInterval, DOM events. Run AFTER microtasks.

\`\`\`
setTimeout(() => console.log("macro"), 0);
Promise.resolve().then(() => console.log("micro"));
\`\`\`
\`\`\`output
micro
macro
\`\`\`
Even with 0ms delay, the Promise wins because microtasks drain before the next macrotask.
Remember: microtasks (Promises) always beat macrotasks (timers).`,
      },
      {
        q: 'What is setTimeout?',
        a: `setTimeout runs a function ONCE after a delay (in milliseconds). It is asynchronous — it does not block other code.

\`\`\`
console.log("start");

setTimeout(() => {
  console.log("runs after 2 seconds");
}, 2000);

console.log("end");
\`\`\`
\`\`\`output
start
end
runs after 2 seconds
\`\`\`
The delay is a MINIMUM, not a guarantee. Use clearTimeout(id) to cancel. For repeating, use setInterval.
Remember: setTimeout = do this later, once.`,
      },
      {
        q: 'Promise.all()?',
        a: `Promise.all() runs several promises in PARALLEL and waits for ALL of them to succeed. It returns one array of results.

If ANY promise rejects, the whole thing rejects immediately.

\`\`\`
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(results => console.log(results)); // [1, 2, 3]
\`\`\`
Real use — fetch multiple APIs at once:
\`\`\`
const [users, posts] = await Promise.all([
  fetch("/users").then(r => r.json()),
  fetch("/posts").then(r => r.json()),
]);
\`\`\`
Remember: all = wait for everyone; one failure fails all. (Use Promise.allSettled to ignore failures.)`,
      },
      {
        q: 'Promise.race()?',
        a: `Promise.race() returns as soon as the FIRST promise settles (resolves OR rejects) — whichever finishes first wins.

\`\`\`
const fast = new Promise(res => setTimeout(() => res("fast"), 100));
const slow = new Promise(res => setTimeout(() => res("slow"), 500));

Promise.race([fast, slow])
  .then(result => console.log(result)); // "fast"
\`\`\`
Common use — add a timeout to a request:
\`\`\`
Promise.race([fetchData(), timeout(5000)]);
\`\`\`
Remember: race = first one to finish wins (success or error).`,
      },
      {
        q: 'What is fetch()?',
        a: `fetch() is the built-in browser function to make HTTP requests (call APIs). It returns a Promise.

Two-step process: get the response, then read the body (e.g. .json()).

\`\`\`
fetch("https://api.example.com/user")
  .then(res => {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();      // parse body
  })
  .then(data => console.log(data))
  .catch(err => console.log(err));
\`\`\`
With async/await:
\`\`\`
const res  = await fetch(url);
const data = await res.json();
\`\`\`
Note: fetch does NOT reject on 404/500 — you must check res.ok yourself.
Remember: fetch → response → .json(); check res.ok for errors.`,
      },
      {
        q: 'What is an API?',
        a: `API = Application Programming Interface. It is a set of rules that lets two pieces of software talk to each other.

On the web, it usually means a URL (endpoint) you send a request to and get data back (often JSON).

\`\`\`
// Request to a weather API endpoint
GET https://api.weather.com/city/delhi

// Response (JSON)
{ "city": "Delhi", "temp": 34, "unit": "C" }
\`\`\`
Common HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove).
Remember: API = a contract/menu for requesting data or actions from another system.`,
      },
      {
        q: 'Axios vs fetch?',
        a: `Both make HTTP requests. Axios is a popular library; fetch is built-in.

\`\`\`
Feature            fetch                 Axios
Built-in           yes                   no (install)
JSON parsing       manual res.json()     automatic (res.data)
Error on 404/500   no (check res.ok)     yes (throws)
Request timeout    manual                built-in option
Older browsers     needs polyfill        supported
\`\`\`
\`\`\`
// fetch
const data = await (await fetch(url)).json();

// axios
const { data } = await axios.get(url);
\`\`\`
Remember: fetch = built-in but manual; Axios = extra features, auto JSON, throws on errors.`,
      },
      {
        q: 'Blocking vs non-blocking code?',
        a: `• Blocking code     → stops everything until it finishes. The page freezes.
• Non-blocking code → starts a task and lets the rest continue; result handled later.

\`\`\`
// ❌ Blocking (imaginary sync request) — UI frozen while waiting
const data = syncHttpRequest(url);
console.log(data);

// ✅ Non-blocking — UI stays responsive
fetch(url).then(res => res.json()).then(data => console.log(data));
console.log("this runs immediately");
\`\`\`
JavaScript prefers non-blocking (async) so the single thread never gets stuck.
Remember: blocking = freeze & wait; non-blocking = continue & handle later.`,
      },
    ],
  },
  {
    title: '🔹 5. DOM & Browser',
    questions: [
      {
        q: 'What is the DOM?',
        a: `DOM = Document Object Model. It is the browser's representation of your HTML page as a TREE of objects that JavaScript can read and change.

Each HTML tag becomes a "node" you can select, edit, add, or remove.

\`\`\`
<body>            →  document.body
  <h1>Hi</h1>     →  a node inside body
</body>
\`\`\`
\`\`\`
// Change the page with JS
document.querySelector("h1").textContent = "Changed!";
document.body.style.background = "black";
\`\`\`
Remember: DOM = HTML turned into a JS object tree you can manipulate.`,
      },
      {
        q: 'querySelector() vs getElementById()?',
        a: `Both grab elements from the page.

• getElementById("id")     → fast, finds one element by its id only.
• querySelector("css")     → flexible, uses ANY CSS selector, returns the FIRST match.
• querySelectorAll("css")  → returns ALL matches (a NodeList).

\`\`\`
document.getElementById("title");        // by id

document.querySelector("#title");        // by id (CSS)
document.querySelector(".btn");          // first .btn class
document.querySelector("ul li");         // first li inside ul

const items = document.querySelectorAll(".item"); // all
items.forEach(el => console.log(el.textContent));
\`\`\`
Remember: querySelector uses CSS selectors and is the most flexible.`,
      },
      {
        q: 'Event bubbling?',
        a: `Event bubbling is the DEFAULT: when you click an element, the event fires on that element, then travels UP to its parents one by one.

\`\`\`
<div id="parent">
  <button id="child">Click</button>
</div>
\`\`\`
\`\`\`
parent.addEventListener("click", () => console.log("parent"));
child.addEventListener("click",  () => console.log("child"));

// Clicking the button logs:
// child
// parent   ← bubbled up
\`\`\`
Remember: bubbling = event rises from the target UP to ancestors.`,
      },
      {
        q: 'Event capturing?',
        a: `Capturing is the OPPOSITE of bubbling: the event travels from the TOP (parent) DOWN to the target first. It's off by default — enable it with { capture: true }.

\`\`\`
parent.addEventListener("click", () => console.log("parent"), true); // capture
child.addEventListener("click",  () => console.log("child"));

// Clicking the button logs:
// parent  ← captured on the way down
// child
\`\`\`
Full order of a click: capturing phase (top→target) then bubbling phase (target→top).
Remember: capturing = top-down; bubbling = bottom-up.`,
      },
      {
        q: 'Event delegation?',
        a: `Event delegation means attaching ONE listener to a parent instead of many listeners on each child. It relies on bubbling, and works even for elements added later.

\`\`\`
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
\`\`\`
\`\`\`
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("Clicked:", e.target.textContent);
  }
});
\`\`\`
One listener handles all current AND future <li>s.
Remember: delegation = one listener on the parent, uses e.target.`,
      },
      {
        q: 'localStorage vs sessionStorage?',
        a: `Both store key–value strings in the browser, but they differ in lifetime.

• localStorage   → persists even after closing the browser (until cleared).
• sessionStorage → cleared when the TAB is closed.

\`\`\`
localStorage.setItem("name", "Ashish");
console.log(localStorage.getItem("name")); // "Ashish"
localStorage.removeItem("name");

sessionStorage.setItem("temp", "123");
// gone when the tab closes
\`\`\`
Both store STRINGS only — use JSON for objects:
\`\`\`
localStorage.setItem("user", JSON.stringify({ id: 1 }));
const user = JSON.parse(localStorage.getItem("user"));
\`\`\`
Remember: local = long-term, session = until tab closes.`,
      },
      {
        q: 'What are cookies?',
        a: `Cookies are small pieces of data (max ~4KB) stored in the browser and automatically SENT to the server with every request. Often used for auth/sessions.

\`\`\`
// Create / read cookies
document.cookie = "user=Ashish; max-age=3600";
console.log(document.cookie); // "user=Ashish"
\`\`\`
\`\`\`
Storage        Size     Sent to server?   Lifetime
Cookies        ~4KB     yes (every req)   set by expiry
localStorage   ~5MB     no                until cleared
sessionStorage ~5MB     no                tab close
\`\`\`
Remember: cookies are small and auto-sent to the server; storage is bigger and stays in the browser.`,
      },
      {
        q: 'What is CORS?',
        a: `CORS = Cross-Origin Resource Sharing. It is a browser security rule that controls whether a web page can request data from a DIFFERENT origin (domain, protocol, or port).

By default, the browser BLOCKS cross-origin requests unless the server allows them with special headers.

\`\`\`
// Page at  https://myapp.com  calling  https://api.other.com
// Browser blocks it UNLESS api.other.com responds with:
Access-Control-Allow-Origin: https://myapp.com
\`\`\`
Same origin = same protocol + domain + port.
Remember: CORS is a browser rule; the SERVER must opt-in with headers to allow cross-origin calls.`,
      },
      {
        q: 'What is debounce?',
        a: `Debounce delays running a function until the user STOPS triggering it for a set time. Great for search boxes and resize events — it avoids firing on every keystroke.

\`\`\`
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);            // cancel previous
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((text) => {
  console.log("Searching:", text);
}, 500);

// Fires only 500ms AFTER typing stops
\`\`\`
Remember: debounce = "wait until they're done, then run once".`,
      },
      {
        q: 'What is throttle?',
        a: `Throttle limits a function to run at most ONCE per time interval, no matter how often it's triggered. Great for scroll and mousemove events.

\`\`\`
function throttle(fn, limit) {
  let wait = false;
  return function (...args) {
    if (!wait) {
      fn(...args);
      wait = true;
      setTimeout(() => (wait = false), limit);
    }
  };
}

const onScroll = throttle(() => console.log("scroll"), 1000);
// Runs at most once per second while scrolling
\`\`\`
Debounce vs throttle: debounce waits for a PAUSE; throttle runs at a steady RATE.
Remember: throttle = "run at most once every X ms".`,
      },
      {
        q: 'preventDefault()?',
        a: `preventDefault() stops the browser's DEFAULT action for an event — like a form submitting and reloading the page, or a link navigating away.

\`\`\`
form.addEventListener("submit", (e) => {
  e.preventDefault();     // stop page reload
  console.log("Handle form with JS instead");
});

link.addEventListener("click", (e) => {
  e.preventDefault();     // stop navigation
});
\`\`\`
Remember: preventDefault = cancel the browser's built-in behaviour (not the event itself).`,
      },
      {
        q: 'stopPropagation()?',
        a: `stopPropagation() stops an event from BUBBLING up (or capturing down) to other elements. The event stops at the current element.

\`\`\`
child.addEventListener("click", (e) => {
  e.stopPropagation();          // parent's click won't fire
  console.log("only child");
});

parent.addEventListener("click", () => {
  console.log("parent (blocked)");
});
\`\`\`
Difference: preventDefault cancels the default action; stopPropagation stops the event travelling to other elements.
Remember: stopPropagation = "the event ends here, don't tell the parents".`,
      },
      {
        q: 'What is the window object?',
        a: `window is the GLOBAL object in the browser — it represents the browser tab/window and holds everything: variables, functions, and browser APIs.

\`\`\`
console.log(window.innerWidth);   // viewport width
window.alert("Hi");               // same as alert("Hi")
window.location.href = "/home";   // navigate
window.setTimeout(fn, 1000);      // setTimeout lives on window

// Global vars become window properties
var x = 5;
console.log(window.x); // 5
\`\`\`
Because it's global, you can drop the "window." prefix (alert(), setTimeout()).
Remember: window = the browser's global object holding everything.`,
      },
      {
        q: 'window vs document object?',
        a: `• window   → the whole browser tab (biggest object). Holds timers, location, history, alerts, and the document itself.
• document → just the loaded HTML PAGE (the DOM). Lives inside window.

\`\`\`
window.innerHeight;        // browser window height
window.location.href;      // current URL
window.history.back();     // browser back button

document.title;            // page <title>
document.body;             // <body> element
document.querySelector("h1");
\`\`\`
Relationship: document is a property of window (window.document).
Remember: window = the browser, document = the page inside it.`,
      },
      {
        q: 'What is the BOM?',
        a: `BOM = Browser Object Model. It's everything the browser exposes to JS that is NOT the page content — things like the window, URL, history, and screen.

Main BOM objects (all under window):
• window   → the browser window
• location → current URL (redirect, reload)
• history  → back/forward navigation
• navigator→ browser & device info
• screen   → screen size

\`\`\`
console.log(location.href);      // current URL
location.reload();               // refresh page
history.back();                  // go back
console.log(navigator.userAgent);// browser info
\`\`\`
Remember: DOM = the page (document); BOM = the browser itself (window, location, history...).`,
      },
    ],
  },
  {
    title: '🔹 6. Advanced JavaScript',
    questions: [
      {
        q: 'What is a closure?',
        a: `A closure is a function that "remembers" the variables from the scope where it was CREATED, even after that outer function has finished running.

\`\`\`
function counter() {
  let count = 0;              // private variable
  return function () {
    count++;                  // still remembered!
    return count;
  };
}

const inc = counter();
console.log(inc()); // 1
console.log(inc()); // 2
console.log(inc()); // 3
\`\`\`
The inner function keeps count alive. This is how JS creates private data.
Remember: closure = function + the variables it "closed over" from its birthplace.`,
      },
      {
        q: 'What is a prototype?',
        a: `Every JS object has a hidden link to another object called its PROTOTYPE. When you access a property, JS looks on the object first, then walks up the prototype chain.

This is how objects share methods without copying them.

\`\`\`
const arr = [1, 2, 3];
// arr doesn't own push(), it inherits it:
arr.push(4);
// arr → Array.prototype → Object.prototype → null
\`\`\`
\`\`\`
function Person(name) { this.name = name; }
Person.prototype.greet = function () {
  return "Hi " + this.name;
};
const p = new Person("Ashish");
console.log(p.greet()); // "Hi Ashish" (found on prototype)
\`\`\`
Remember: prototype = a shared parent object where methods live.`,
      },
      {
        q: 'What is prototypal inheritance?',
        a: `Prototypal inheritance means objects inherit properties and methods from other objects through the prototype chain — instead of classical class-based copying.

\`\`\`
const animal = {
  eats: true,
  walk() { console.log("walking"); }
};

const dog = Object.create(animal); // dog's prototype = animal
dog.barks = true;

console.log(dog.barks); // true  (own)
console.log(dog.eats);  // true  (inherited)
dog.walk();             // "walking" (inherited)
\`\`\`
JS searches: object → its prototype → next prototype → ... → null.
Remember: inheritance in JS = looking UP the prototype chain.`,
      },
      {
        q: 'What is a class?',
        a: `A class is a cleaner SYNTAX (ES6) for creating objects and inheritance. Under the hood it still uses prototypes.

\`\`\`
class Person {
  constructor(name) {   // runs on "new"
    this.name = name;
  }
  greet() {
    return "Hi " + this.name;
  }
}

const p = new Person("Ashish");
console.log(p.greet()); // "Hi Ashish"

// Inheritance
class Student extends Person {
  constructor(name, grade) {
    super(name);        // call parent constructor
    this.grade = grade;
  }
}
\`\`\`
Remember: class = friendly syntax over prototypes; use new to create instances.`,
      },
      {
        q: 'What is a constructor?',
        a: `A constructor is a special function that runs automatically when you create an object with new. Its job is to initialise (set up) the new object's properties.

\`\`\`
class Car {
  constructor(brand, year) { // constructor method
    this.brand = brand;
    this.year = year;
  }
}
const c = new Car("Tesla", 2024);
console.log(c.brand); // "Tesla"
\`\`\`
Function-style constructor (older):
\`\`\`
function Car(brand) { this.brand = brand; }
const c2 = new Car("BMW");
\`\`\`
Remember: constructor = the setup function that runs on new.`,
      },
      {
        q: 'What is strict mode?',
        a: `Strict mode ( "use strict" ) makes JavaScript enforce stricter rules, turning silent mistakes into visible errors. It catches bugs early.

\`\`\`
"use strict";

x = 10;          // ❌ ReferenceError (undeclared variable)

const obj = {};
Object.freeze(obj);
obj.a = 1;       // ❌ throws instead of silently failing
\`\`\`
What it does:
• Blocks accidental global variables.
• Throws on assignment to read-only/frozen things.
• Disallows duplicate parameter names.
ES6 modules and class bodies are strict automatically.
Remember: "use strict" = safer JS with real errors instead of silent bugs.`,
      },
      {
        q: 'What is a memory leak?',
        a: `A memory leak happens when memory that is no longer needed is NOT released, so the app uses more and more RAM over time and slows down.

Common causes:
• Forgotten timers/intervals that keep running.
• Event listeners never removed.
• Global variables holding large data.
• Closures accidentally keeping big objects alive.

\`\`\`
// Leak: interval never cleared, keeps referencing data
const data = loadHugeData();
setInterval(() => console.log(data), 1000);

// Fix:
const id = setInterval(() => {}, 1000);
clearInterval(id); // release when done
\`\`\`
Remember: leak = unused memory that can't be garbage-collected because something still references it.`,
      },
      {
        q: 'What is garbage collection?',
        a: `Garbage collection (GC) is JavaScript automatically freeing memory that is no longer reachable — you don't free memory manually like in C.

The engine keeps values that can still be reached from the root (window/global). Anything unreachable is removed.

\`\`\`
let user = { name: "Ashish" }; // object in memory
user = null;                   // no reference left
// → object becomes unreachable → GC will free it
\`\`\`
Algorithm used: "mark-and-sweep" (mark reachable, sweep the rest).
Remember: GC = automatic cleanup of values nothing points to anymore.`,
      },
      {
        q: 'What is memoization?',
        a: `Memoization is an optimisation that CACHES a function's results, so repeated calls with the same input return instantly instead of recomputing.

\`\`\`
function memoize(fn) {
  const cache = {};
  return function (n) {
    if (n in cache) return cache[n];  // reuse
    cache[n] = fn(n);                 // store
    return cache[n];
  };
}

const slowSquare = (n) => { /* heavy work */ return n * n; };
const fast = memoize(slowSquare);

fast(5); // computes → 25
fast(5); // instant from cache → 25
\`\`\`
Remember: memoization = remember past results to skip repeated work.`,
      },
      {
        q: 'What is a polyfill?',
        a: `A polyfill is code that adds a MODERN feature to OLDER browsers that don't support it natively — so your code runs everywhere.

\`\`\`
// If an old browser lacks Array.includes, define it:
if (!Array.prototype.includes) {
  Array.prototype.includes = function (item) {
    return this.indexOf(item) !== -1;
  };
}

console.log([1, 2, 3].includes(2)); // true (even on old browsers)
\`\`\`
Remember: polyfill = "fill the gap" so new features work on old browsers.`,
      },
      {
        q: 'What is a Symbol?',
        a: `A Symbol is a primitive that is guaranteed to be UNIQUE. Even two symbols with the same description are different. Used for unique object keys that never clash.

\`\`\`
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2); // false (always unique)

const user = {
  name: "Ashish",
  [id1]: 123,     // unique, hidden-ish key
};
console.log(user[id1]); // 123
\`\`\`
Symbol keys don't show up in normal loops or Object.keys().
Remember: Symbol = a unique, collision-proof identifier.`,
      },
      {
        q: 'What is BigInt?',
        a: `BigInt is a primitive for integers TOO LARGE for the normal number type (which is safe only up to 2^53 - 1). Add an n suffix or use BigInt().

\`\`\`
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

const big = 9007199254740993n;   // n = BigInt
console.log(big + 1n);           // 9007199254740994n

console.log(BigInt(123));        // 123n
\`\`\`
Rule: you can't mix BigInt and Number directly in math.
\`\`\`
console.log(10n + 5);  // ❌ TypeError
console.log(10n + 5n); // ✅ 15n
\`\`\`
Remember: BigInt = huge integers, marked with n, don't mix with Number.`,
      },
      {
        q: 'Nullish coalescing ( ?? )?',
        a: `The ?? operator returns the RIGHT side only when the left side is null or undefined. Unlike ||, it does NOT treat 0, "", or false as "empty".

\`\`\`
const a = null ?? "default";
console.log(a); // "default"

const b = 0 ?? 100;
console.log(b); // 0   ✅ (0 is kept)

const c = 0 || 100;
console.log(c); // 100 ❌ (|| treats 0 as falsy)
\`\`\`
Use ?? when 0 / "" / false are VALID values you want to keep.
Remember: ?? checks only null/undefined; || checks all falsy values.`,
      },
      {
        q: 'What is the Temporal Dead Zone (TDZ)?',
        a: `The TDZ is the time between entering a scope and the line where a let/const variable is declared. Accessing the variable in that window throws an error.

\`\`\`
console.log(x); // ❌ ReferenceError (in TDZ)
let x = 5;
console.log(x); // ✅ 5

// var has no TDZ:
console.log(y); // undefined (no error)
var y = 10;
\`\`\`
So let/const ARE hoisted, but you can't touch them before their declaration.
Remember: TDZ = "declared but not yet initialised" zone for let/const.`,
      },
      {
        q: 'What are modules (import/export)?',
        a: `Modules let you split code into separate files and share pieces between them using export and import. This keeps code organised and scoped.

\`\`\`
// math.js
export const add = (a, b) => a + b;   // named export
export default function () {};          // default export
\`\`\`
\`\`\`
// app.js
import myDefault, { add } from "./math.js";
console.log(add(2, 3)); // 5
\`\`\`
• Named exports → import with the exact name in { }.
• Default export → one per file, import with any name.
Modules are strict-mode and have their own scope (no global leaks).
Remember: export shares, import brings in; default = one main thing per file.`,
      },
      {
        q: 'What is tree shaking?',
        a: `Tree shaking is a build-tool optimisation that REMOVES unused code (dead code) from the final bundle, making it smaller and faster to load.

It relies on ES modules (import/export) because they're statically analysable.

\`\`\`
// utils.js
export const used   = () => "I'm used";
export const unused = () => "I'm never imported";
\`\`\`
\`\`\`
// app.js
import { used } from "./utils.js";
used();
// Bundler drops "unused" from the final build ✂️
\`\`\`
Remember: tree shaking = shake off unused exports at build time.`,
      },
      {
        q: 'SSR vs CSR?',
        a: `Two ways to render a web page:

• CSR (Client-Side Rendering) → browser downloads a nearly empty HTML + JS, then JS builds the page. First load is slower, SEO weaker.
• SSR (Server-Side Rendering) → server sends fully-built HTML. Faster first paint, better SEO.

\`\`\`
CSR:  Server → empty <div id="root"></div> → JS fills it in the browser
SSR:  Server → full HTML page ready → browser just displays it
\`\`\`
Frameworks like Next.js offer SSR for React.
Remember: CSR renders in the browser; SSR renders on the server first.`,
      },
      {
        q: 'What is hydration?',
        a: `Hydration is the process where the browser takes the static HTML sent by SSR and attaches JavaScript event listeners to make it interactive.

\`\`\`
1. Server sends fully-rendered HTML  → user sees content fast
2. JS bundle loads in the browser
3. React "hydrates" → wires up clicks, state, events
4. Page is now interactive
\`\`\`
Before hydration the page LOOKS ready but buttons don't work yet.
Remember: hydration = "bring the server HTML to life" by attaching JS.`,
      },
      {
        q: 'What is Webpack?',
        a: `Webpack is a module BUNDLER. It takes all your JS, CSS, images, and modules and combines/optimises them into a few files the browser can load efficiently.

\`\`\`
Many files                         Bundled output
index.js  ┐
utils.js  ├─ Webpack ─→  bundle.js  (minified, optimised)
style.css ┘
\`\`\`
It also does transforms via "loaders" (e.g. Babel for old-browser JS) and "plugins" (minify, etc). Modern alternatives: Vite, esbuild, Rollup.
Remember: Webpack = bundles many files into optimised output for the browser.`,
      },
      {
        q: 'WeakMap and WeakSet?',
        a: `WeakMap/WeakSet are like Map/Set but hold their keys "weakly" — if nothing else references a key object, it can be garbage-collected. This helps avoid memory leaks.

\`\`\`
let obj = { id: 1 };
const wm = new WeakMap();
wm.set(obj, "data");

console.log(wm.get(obj)); // "data"

obj = null; // object can now be garbage-collected,
            // and its WeakMap entry disappears automatically
\`\`\`
Limits: keys must be objects, and they're NOT iterable (no .size, no loop).
Remember: Weak = keys don't block garbage collection; used for private/cached data.`,
      },
      {
        q: 'Why is typeof null === "object"?',
        a: `It's a long-standing BUG in JavaScript, kept for backward compatibility.

In the very first JS engine, values were tagged by a type label in memory. Objects had the tag 0, and null was represented as the null pointer (also 0). So typeof read null as an object.

\`\`\`
console.log(typeof null);      // "object"  (the historic bug)
console.log(typeof undefined); // "undefined"

// Correct way to check for null:
const x = null;
console.log(x === null); // true
\`\`\`
Fixing it would break millions of existing sites, so it stays.
Remember: typeof null === "object" is a legacy bug — check with x === null.`,
      },
      {
        q: 'Is JavaScript single-threaded?',
        a: `Yes. JavaScript has ONE main thread and one call stack — it can only do one thing at a time.

So how does it handle async? The browser/Node provide extra APIs (timers, network) that work in the background, and the EVENT LOOP feeds their results back to the single thread when it's free.

\`\`\`
console.log("1");
setTimeout(() => console.log("2"), 0); // handled by browser, queued
console.log("3");
\`\`\`
\`\`\`output
1
3
2
\`\`\`
The single thread never waited — the timer ran outside it.
Remember: JS is single-threaded, but async APIs + event loop make it feel concurrent.`,
      },
      {
        q: 'What is a JavaScript engine?',
        a: `A JavaScript engine is the program that READS and RUNS your JS code. Each browser has one:

• V8       → Chrome, Edge, Node.js
• SpiderMonkey → Firefox
• JavaScriptCore → Safari

Simplified pipeline inside V8:
\`\`\`
Your JS  →  Parser (makes AST)
         →  Interpreter (quick bytecode)
         →  JIT Compiler (optimises hot code to machine code)
         →  runs fast
\`\`\`
It also handles memory allocation and garbage collection.
Remember: the engine (like V8) parses, compiles, and executes your JavaScript.`,
      },
    ],
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function JSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('js_revision_last_read')) || null; }
    catch { return null; }
  });

  const revealedCount = Object.values(openAnswers).filter(Boolean).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  const toggleAnswer = (key, question, sectionTitle) => {
    setOpenAnswers(prev => {
      const isOpening = !prev[key];
      if (isOpening) {
        const data = { key, question, sectionTitle };
        setLastRead(data);
        localStorage.setItem('js_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    // Parse section index from key ("sIdx-qIdx") and expand that section first
    const sectionIdx = parseInt(lastRead.key.split('-')[0], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    // Wait for section to render, then scroll
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('js_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = revisionSections.map(sec => ({
    ...sec,
    questions: q
      ? sec.questions.filter(item =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        )
      : sec.questions,
  })).filter(sec => sec.questions.length > 0);

  const totalVisible = filteredSections.reduce((s, sec) => s + sec.questions.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-yellow-400">JavaScript</span> Revision
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {revisionSections.length} sections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden sm:block">{auth.user?.username}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-lg transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-8">
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search any question or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">×</button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-yellow-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Last Read Banner */}
        {lastRead && (
          <div className="flex items-center justify-between bg-yellow-400/8 border border-yellow-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-yellow-400 text-base flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg transition-colors">Resume →</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">✕</button>
            </div>
          </div>
        )}

        {/* No results */}
        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-yellow-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {/* Sections */}
        {filteredSections.map((section, sIdx) => {
          const originalIdx = revisionSections.findIndex(s => s.title === section.title);
          const isCollapsed = q ? false : collapsedSections[originalIdx];
          return (
            <div key={sIdx}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(originalIdx)}
                className="w-full flex items-center justify-between py-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-yellow-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className="h-px bg-[#1f1f1f] mb-2" />

              {/* Questions flat list */}
              {!isCollapsed && (
                <div>
                  {section.questions.map((item, qIdx) => {
                    const key = `${originalIdx}-${qIdx}`;
                    const isOpen = openAnswers[key];
                    const isLastRead = lastRead?.key === key;
                    return (
                      <div
                        key={key}
                        ref={el => questionRefs.current[key] = el}
                        className={`border-b transition-all rounded-sm ${
                          isOpen
                            ? 'bg-yellow-400/[0.06] border-yellow-400/20'
                            : isLastRead
                            ? 'border-yellow-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-yellow-400 text-xs flex-shrink-0">📌</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-yellow-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <a
                            href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in short.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ask ChatGPT"
                            className="flex-shrink-0 p-2 mr-1 text-red-400 hover:text-red-300 hover:scale-125 transition-all duration-300 rounded animate-spin [animation-duration:6s]"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                            </svg>
                          </a>
                        </div>
                        {isOpen && (
                          <div className="px-3 pb-5 pt-2 space-y-1">
                            {renderJSAnswer(item.a)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Search result count */}
        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default JSSheet;
