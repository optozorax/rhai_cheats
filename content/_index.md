+++
weight = 1
sort_by = "weight"
template = "index.html"
insert_anchor_links = "right"
+++

<img id="logo" class="hide_on_small" src="logo.png" alt="Rhai logo on a cheat sheet." height="67"></img>
<pagetitle>Rhai Language Cheat Sheet</pagetitle>
<subtitle><span id="subtitle">{{ date() }}</span></subtitle>


<blockquote class="legend">

<symbol-legend class="short">

Single-page reference for the **Rhai** scripting language.
All snippets are valid Rhai code; most examples assume default engine settings.

</symbol-legend>

<symbol-legend class="long">

<twocolumn>
<column>

**What this page is for**
- Quick lookup of Rhai syntax and behavior
- Discovering lesser-known language features
- Comparing Rhai with other scripting languages

</column>
<column>

**What this page is not**
- Full engine / embedding guide (see the Book)
- Exhaustive standard-library reference
- Advice on Rust-side integration

</column>
</twocolumn>
</symbol-legend>

<div style="text-align: right; height: 1px;">
    <span class="expander" style="font-size: 10px; position: relative; top: -20px;">
        <a href="javascript:toggle_legend();">➕</a>
    </span>
</div>

</blockquote>


<noprint>
<page-controls>
    <a id="toggle_ligatures" href="javascript:toggle_ligatures()">Font Ligatures (<code>..=, =></code>)</a>
    <a href="javascript:toggle_night_mode()">Night Mode &#x1f4a1;</a>
</page-controls>
</noprint>


<noprint>
<toc><column>

**Basics**
* [Hello, Rhai](#hello-rhai)
* [Values &amp; Types](#values-types)
* [Variables &amp; Constants](#variables-constants)
* [Comments &amp; Doc Comments](#comments-doc-comments)
* [Statements &amp; Blocks](#statements-blocks)
* [Keywords](#keywords)

**Data &amp; Collections**
* [Numbers &amp; Operators](#numbers-operators)
* [Strings &amp; Interpolation](#strings-interpolation)
* [Arrays](#arrays)
* [Object Maps](#object-maps)
* [BLOBs &amp; Binary Data](#blobs-binary-data)
* [JSON &amp; Timestamps](#json-timestamps)

**Control Flow**
* [Control Flow](#control-flow)
* [Error Handling](#error-handling)

</column>

<column>

**Functions &amp; Modules**
* [Functions &amp; Methods](#functions-methods)
* [Closures &amp; Anonymous Functions](#closures-anonymous-functions)
* [Function Pointers &amp; Currying](#function-pointers-currying)
* [Modules &amp; Globals](#modules-globals)

**Advanced**
* [Dynamic Typing](#dynamic-typing)
* [Shadowing &amp; Scope](#shadowing-scope)
* [Debugging &amp; Introspection](#debugging-introspection)

**Standard Functions**
* [Numeric](#std-numeric)
* [Strings](#std-strings)
* [Arrays](#std-arrays)
* [BLOBs](#std-blobs)
* [Object Maps](#std-maps)
* [Ranges &amp; Bit-fields](#std-ranges-bits)
* [Time](#std-time)
* [Function Pointers](#std-fn-ptr)
* [Misc](#std-misc)

</column>
</toc>
</noprint>


## Hello, Rhai {#hello-rhai}

```rust
// Rhai scripts are plain text files evaluated by a host application.
// This is a minimal self-contained example.

let name = "world";
print(`Hello, ${name}!`);
```

Key ideas:

- Execution is statement-based; the last statement of a block is also its value.
- Types are inferred at runtime, but operations are strongly typed (no implicit casts).
- The host (Rust) decides which functions/types are available to the script.


## Values &amp; Types {#values-types}

Primitive value categories in Rhai (see `book/src/language/values-and-types.md`):

| Category          | Examples                      | `type_of()` result | Notes |
|-------------------|-------------------------------|--------------------|-------|
| Integer           | `0`, `-1`, `42`, `0xFF`       | `"i64"` / `"i32"`  | Default integer type is `INT` (`i64` by default, `i32` with `only_i32`). |
| Float             | `1.0`, `-3.14`, `2e-3`        | `"f64"` / `"f32"`  | Enabled unless compiled with `no_float`. |
| Decimal           | `decimal(1.23)`               | `"decimal"`        | Requires the `decimal` feature; precise fixed-point. |
| Bool              | `true`, `false`               | `"bool"`           | Logical operations use `&&`, `\|\|`, `!`. |
| Char              | `'a'`, `'#'`, `'\u2764'`      | `"char"`           | Unicode scalar value, single quotes. |
| String            | `"hello"`                     | `"string"`         | Immutable strings; backticks enable interpolation. |
| Array             | `[1, 2, 3]`                   | `"array"`          | Heterogeneous, indexable via `[i]`. |
| Object map        | `#{ x: 1, y: 2 }`             | `"map"`            | String-keyed map; `#{ "x": 1 }` also valid. |
| Blob (byte array) | `#[1, 2, 255]`, `#[0xAA]`     | `"blob"`           | `u8` values; useful for binary protocols. |
| Timestamp         | `now()`                       | `"timestamp"`      | Requires `no_time` disabled. |
| Function pointer  | `Fn("foo")`                   | `"Fn"`             | Callable via `call` / `curry`. |
| Dynamic           | any of the above              | actual type name   | `Dynamic` is the internal catch‑all value type. |

Notes:

- `type_of(x)` returns a string describing the runtime type.
- `to_string()` and string interpolation use the display representation of a value.
- Many feature flags (`no_float`, `no_index`, `no_time`, …) can disable parts of the language at engine compile time.

See also in the Rhai Book: [Values and Types](https://rhai.rs/book/language/values-and-types.html).


## Variables &amp; Constants {#variables-constants}

```rust
let x = 42;          // mutable variable
let y;               // defaults to ()
const PI = 3.14159;  // compile-time constant
```

- `let` declares a mutable variable in the current scope.
- If no initial value is provided, the variable is created with value `()`.
- `const` declares an immutable constant; the initializer must be constant‑foldable.
- Names must:
  - contain only ASCII letters, digits, and `_`,
  - contain at least one ASCII letter,
  - not start with a digit once leading `_` are skipped,
  - not be a keyword.

Shadowing:

```rust
let x = 1;
{
    let x = 2;   // shadows outer x within this block
    print(x);    // 2
}
print(x);        // 1
```

See also in the Rhai Book: [Variables](https://rhai.rs/book/language/variables.html) and [Constants](https://rhai.rs/book/language/constants.html).


## Comments &amp; Doc Comments {#comments-doc-comments}

```rust
// Line comment
/* Block comment */
/// Doc comment for a function or variable
//! Doc comment for the enclosing module / script
```

- `//` comments extend to the end of the line.
- `/* ... */` comments can span multiple lines.
- `///` attaches documentation to the following item (usually a function).
- `//!` attaches documentation to the current module/file.

See also in the Rhai Book: [Comments](https://rhai.rs/book/language/comments.html) and [Doc Comments](https://rhai.rs/book/language/doc-comments.html).


## Statements &amp; Blocks {#statements-blocks}

```rust
let x = 40 + 2;      // statement (terminated by `;`)

let y = {
    let tmp = 40;
    tmp + 2          // last statement: block value is 42
};                   // block used as an expression
```

- Statements are normally terminated with `;`.
- Semicolons can be omitted:
  - for the last statement in a block, and
  - for statements that syntactically end with a block (`if`, `while`, `for`, `loop`, `switch`).
- A block `{ ... }` introduces a new scope:
  - variables/constants declared inside do not escape the block;
  - the block’s value is the value of its last statement (even if it ends with `;`).
- Blocks can appear inside expressions (“statement expressions”), which is helpful to compute a sub‑expression once and reuse it.

See also in the Rhai Book: [Statements](https://rhai.rs/book/language/statements.html) and [Statement Expressions](https://rhai.rs/book/language/statement-expression.html).


## Keywords {#keywords}

Selected active keywords (see `book/src/language/keywords.md` for the full list):

| Category     | Keywords                                                                 |
|--------------|--------------------------------------------------------------------------|
| Booleans     | `true`, `false`                                                          |
| Bindings     | `let`, `const`, `global`                                                 |
| Control flow | `if`, `else`, `switch`, `do`, `while`, `loop`, `for`, `in`, `break`, `continue` |
| Functions    | `fn`, `private`, `return`, `this`, `is_def_fn`                           |
| Errors       | `throw`, `try`, `catch`                                                  |
| Modules      | `import`, `export`, `as`                                                 |
| Dynamic      | `type_of`, `eval`, `is_def_var`, `is_shared`                             |
| Special      | `Fn`, `call`, `curry`, `print`, `debug`                                  |

Keywords cannot be used as variable or function names, even if a feature flag disables their behavior.

See also in the Rhai Book: [Keywords](https://rhai.rs/book/language/keywords.html).


## Numbers &amp; Operators {#numbers-operators}

### Numeric literals

```rust
let a = 42;          // decimal
let b = 0b1010;      // binary
let c = 0o755;       // octal
let d = 0xFF;        // hexadecimal
let f = 1.23e-4;     // float (if enabled)
let big = 1_000_000; // `_` separators ignored
```

### Arithmetic &amp; comparison

```rust
x + y;  x - y;  x * y;  x / y;  x % y;

x < y;  x <= y;  x > y;  x >= y;  x == y;  x != y;
```

- Operators are strongly typed; incompatible types cause script errors.
- Comparisons are defined only for certain type combinations.
- Integer division truncates toward zero.

### Assignment operators

```rust
let x = 1;
x += 2;   // 3
x -= 1;   // 2
x *= 2;   // 4
x /= 2;   // 2
x %= 2;   // 0
```

Bit operators (on integers):

```rust
x & y;   x | y;   x ^ y;
!x;      // bitwise NOT on integers
x << n;  x >> n;  // shifts
```

Logical operators (on booleans):

```rust
a && b;  a || b;  !a;
```

Short‑circuiting rules are the usual: `&&` stops when the left side is `false`, `||` stops when the left side is `true`.

### Null-coalescing `??`

```rust
let value = maybe() ?? 42;        // default 42 if maybe() returns ()

let x = map.foo ?? 0;             // default for missing property

for v in list {
    total += calculate(v) ?? break;   // stop loop when calculation yields ()
}
```

- `a ?? b` returns `a` if it is not `()`, otherwise `b`.
- The right-hand side is evaluated only if the left-hand side is `()`, so it short‑circuits.
- After `??` you can also use `break`, `continue`, `return` or `throw` to short‑circuit loops or functions.

See also in the Rhai Book: [Numbers](https://rhai.rs/book/language/numbers.html), [Numeric Operators](https://rhai.rs/book/language/num-op.html), [Numeric Functions](https://rhai.rs/book/language/num-fn.html), and [Logic](https://rhai.rs/book/language/logic.html).


## Strings &amp; Interpolation {#strings-interpolation}

```rust
let s1 = "hello";              // basic string
let s2 = "hello\nworld";       // escapes: \n, \t, \uXXXX, ...
let name = "Rhai";
let s3 = `Hello, ${name}!`;    // interpolation with backticks
```

- Double quotes `"..."` create normal strings with escapes.
- Backticks `` `...` `` enable interpolation: `${expr}` is replaced with the string value of `expr`.
- Strings are immutable; methods return new strings.

Selected string methods (see `book/src/language/string-fn.md`):

| Example                         | Description                                  |
|---------------------------------|----------------------------------------------|
| `"abc".len`                     | Length in Unicode scalar values.            |
| `"abc" + "def"`                 | Concatenation.                              |
| `"abc".pad(5, "_")`            | Pad to width.                               |
| `"abc".to_upper()`             | Uppercase; also `to_lower()`.               |
| `"hello".find("ll")`           | Index of substring or `-1`.                 |
| `"hello".substr(1, 3)`         | Substring (start, length).                  |
| `"hello".replace("l", "L")`    | Replace occurrences.                        |

Characters:

```rust
let ch = '❤';
let code = ch.to_int();   // numeric code point
```

See also in the Rhai Book: [Strings and Characters](https://rhai.rs/book/language/strings-chars.html), [String Interpolation](https://rhai.rs/book/language/string-interp.html), and [String Functions](https://rhai.rs/book/language/string-fn.html).


## Arrays {#arrays}

```rust
let list = [1, 2, 3];
let mixed = [1, "two", true];

list[0];        // first element
list[-1];       // from the end
list.len;       // number of elements
list.push(4);   // append
```

- Arrays are zero‑based; negative indices count from the end (`-1` is the last element).
- Out‑of‑bounds access raises an error by default (see `arrays-oob.md`).
- Arrays can hold any mix of value types (they are arrays of `Dynamic`).
- Common methods (see `arrays.md`):

| Example                       | Description                            |
|-------------------------------|----------------------------------------|
| `list.len`                    | Length.                                |
| `list.push(x)`                | Append element.                        |
| `list.pop()`                  | Remove and return last element.        |
| `list.insert(i, x)`           | Insert at index.                       |
| `list.remove(i)`              | Remove element at index.               |
| `list.clear()`                | Remove all elements.                   |
| `list += [4, 5]`              | Concatenate arrays.                    |

See also in the Rhai Book: [Arrays](https://rhai.rs/book/language/arrays.html) and [Array Out-of-Bounds Access](https://rhai.rs/book/language/arrays-oob.html).


## Object Maps {#object-maps}

```rust
let point = #{ x: 1, "y": 2 };

point.x = 42;
let y = point["y"];

if "z" in point {
    print(point.z);
}
```

- Object maps are string‑keyed maps.
- Keys can be written as identifiers (`x: 1`) or quoted strings (`"x": 1`).
- Access:
  - Dot syntax `map.key` is sugar for `map["key"]`.
  - Indexing with `map[key]` uses the runtime value of `key`.
- Missing properties can be handled explicitly (see `object-maps-missing-prop.md`):
  - Accessing a non‑existing property normally errors.
  - Engines can be configured to auto‑create properties instead.

Object maps can also be used in an OOP‑style (see `object-maps-oop.md`) where methods are attached via the host.

See also in the Rhai Book: [Object Maps](https://rhai.rs/book/language/object-maps.html), [Missing Properties](https://rhai.rs/book/language/object-maps-missing-prop.html), and [Object Maps as Objects](https://rhai.rs/book/language/object-maps-oop.html).


## BLOBs &amp; Binary Data {#blobs-binary-data}

```rust
let data = #[0xDE, 0xAD, 0xBE, 0xEF];
data.len;          // length in bytes
data[0] = 0xFF;    // mutate
```

- BLOBs are arrays of `u8` values; available when `no_index` is disabled.
- Useful for binary protocols, hashing, cryptography, etc.
- Many array operations work on BLOBs as well (length, indexing, loops).

See also in the Rhai Book: [BLOBs](https://rhai.rs/book/language/blobs.html).


## JSON &amp; Timestamps {#json-timestamps}

```rust
// Host-provided helper (usually exposed from Engine::parse_json)
let obj = parse_json(`{ "x": 1, "y": 2 }`);
obj.x == 1;                     // object map: #{ x: 1, y: 2 }

let t = now();
let elapsed = elapsed_ms(t);
```

- `parse_json` converts JSON text into Rhai values when the host exposes it:
  - objects → object maps,
  - arrays → arrays,
  - numbers / strings / booleans / null → matching Rhai primitives (`null` → `()`).
- Timestamps (see `timestamps.md`):
  - `now()` returns the current timestamp.
  - Helper functions can compute durations (depends on the host’s API registration).

See also in the Rhai Book: [JSON](https://rhai.rs/book/language/json.html) and [Timestamps](https://rhai.rs/book/language/timestamps.html).


## Control Flow {#control-flow}

### `if` / `else`

```rust
if condition {
    do_something();
} else if other {
    do_other();
} else {
    fallback();
}

let max = if x > y { x } else { y };
```

- `if` conditions must be booleans.
- `if` is an expression: the last statement of the taken branch is the value.

### `switch`

```rust
switch x {
    0          => print("zero"),
    1 | 2      => print("small"),
    3..=10     => print("medium"),
    _          => print("other"),
}
```

- Patterns can be literals, ranges, or `_` (catch‑all).
- Multiple patterns can be combined with `|`.
- `switch` is also an expression; the chosen branch’s last statement is the value.

### Loops

```rust
while cond {
    work();
}

loop {
    if done { break; }
}

do { work(); } while cond;   // run‑at‑least‑once
```

- `while` checks the condition before each iteration.
- `do { ... } while cond` checks after the first run.
- `loop { ... }` is an infinite loop; exit with `break` or `return`.
- `break` exits the current loop; `continue` jumps to the next iteration.

### `for` loops and `in`

```rust
for x in 0..10 {
    print(x);
}

for item in array {
    print(item);
}

for key in map {
    print(key);          // iterates keys
}
```

- The right side of `in` must be iterable:
  - ranges, arrays, BLOBs, strings, object maps (keys), and any type with an iterator registered.
- Loop variable is created fresh for each iteration; assignments to it do not affect the original collection element unless the engine is configured for shared values.

See also in the Rhai Book: [If](https://rhai.rs/book/language/if.html), [Switch](https://rhai.rs/book/language/switch.html), [Switch as Expression](https://rhai.rs/book/language/switch-expression.html), [Loop](https://rhai.rs/book/language/loop.html), [While](https://rhai.rs/book/language/while.html), [Do-While](https://rhai.rs/book/language/do.html), [For](https://rhai.rs/book/language/for.html), [In](https://rhai.rs/book/language/in.html), [Iterators](https://rhai.rs/book/language/iter.html), and [Ranges](https://rhai.rs/book/language/ranges.html).


## Error Handling {#error-handling}

```rust
throw "something went wrong";

let result = try {
    risky();
} catch (err) {
    print(`Error: ${err}`);
    "default"
};
```

- `throw expr` aborts the current script with an error value.
- `try { ... } catch (err) { ... }` evaluates the block and catches `throw`‑n values:
  - on success, the `try` block value is returned;
  - on error, the `catch` block runs with the error bound to `err`.
- Error values are typically strings but can be any type.

See also in the Rhai Book: [Try / Catch](https://rhai.rs/book/language/try-catch.html) and [Throw](https://rhai.rs/book/language/throw.html).


## Functions &amp; Methods {#functions-methods}

```rust
fn add(x, y) {
    x + y          // last statement is the return value
}

fn abs(x) {
    if x < 0 { -x } else { x }
}

let z = add(1, 2);        // 3
```

- `fn` defines a script function.
- Parameters are dynamically typed; default arguments are not supported directly but can be simulated with `()`.
- `return expr;` can be used to exit early from a function; without `return` the last statement is the result.
- Functions are visible in their module; mark them `private` to hide from module exports.

Method calls:

```rust
fn length(s) { s.len }

let n = "hello".length();     // calls length("hello")
```

- `value.method(args...)` is sugar for `method(value, args...)` when such a function exists.
- Inside a method defined with a `this` parameter, `this` refers to the receiver:

```rust
fn inc(this) { this + 1 }
let x = 1.inc();              // 2
```

See also in the Rhai Book: [Functions](https://rhai.rs/book/language/functions.html), [Methods](https://rhai.rs/book/language/fn-method.html), and [Function Metadata](https://rhai.rs/book/language/fn-metadata.html).


## Closures &amp; Anonymous Functions {#closures-anonymous-functions}

```rust
let times_two = |x| x * 2;

let base = 10;
let add_base = |x| x + base;   // captures `base`

let result = add_base(5);      // 15
```

- Anonymous functions/closures can be created with `|params| expr` syntax (see `fn-closure.md` and `fn-anon.md`).
- Captured variables are shared via reference‑counted `Dynamic` values.
- Closures can be stored in variables, passed to other functions, or converted into function pointers.

See also in the Rhai Book: [Closures](https://rhai.rs/book/language/fn-closure.html) and [Anonymous Functions](https://rhai.rs/book/language/fn-anon.html).


## Function Pointers &amp; Currying {#function-pointers-currying}

```rust
let f = Fn("add");        // pointer to function `add`
let r = f.call(1, 2);     // call via pointer

let plus_one = f.curry(1);  // partial application
let three = plus_one.call(2);
```

- `Fn(name)` creates a function pointer referring to a global function.
- `fp.call(args...)` invokes the function.
- `fp.curry(fixed_args...)` creates a new function pointer with arguments pre‑applied.

See also in the Rhai Book: [Function Pointers](https://rhai.rs/book/language/fn-ptr.html) and [Currying](https://rhai.rs/book/language/fn-curry.html).


## Modules &amp; Globals {#modules-globals}

```rust
import "math" as math;

let x = math::sqrt(2);

export fn helper(x) { x * 2 }

global my_global = 42;
```

- `import "path" as name;` loads a module, making its exported functions/variables available under `name::`.
- `export` in a script marks functions/variables to be visible when that script is used as a module.
- `global` promotes a module into a global namespace, making its exports available without a prefix (depends on engine configuration).
- Module creation and registration is done on the host side; from Rhai scripts you only use `import`/`export`/`global`.

See also in the Rhai Book: [Modules](https://rhai.rs/book/language/modules/index.html), [Import](https://rhai.rs/book/language/modules/import.html), [Export](https://rhai.rs/book/language/modules/export.html), and [Global Modules](https://rhai.rs/book/language/global.html).


## Dynamic Typing {#dynamic-typing}

```rust
let x = 1;
x = "now a string";

let t = type_of(x);   // "string"
```

- Variables can hold values of any type; a variable’s type can change over time.
- `type_of(value)` returns the current runtime type as a string.
- Many APIs take or return `Dynamic`, which is Rhai’s internal “any” type.

Shared values (see `dynamic.md` and `dynamic-tag.md`):

- Closures capture variables by reference into shared `Dynamic` values.
- `is_shared(value)` tests whether a value is shared.

See also in the Rhai Book: [Dynamic Values](https://rhai.rs/book/language/dynamic.html), [Dynamic and Rust](https://rhai.rs/book/language/dynamic-rust.html), and [Dynamic Tagging](https://rhai.rs/book/language/dynamic-tag.html).


## Shadowing &amp; Scope {#shadowing-scope}

```rust
let x = 1;

if true {
    let x = 2;    // shadows outer `x`
    const PI = 3.14;
}

print(x);         // 1
// PI is not visible here
```

- Each block (`{ ... }`) creates a new scope.
- Variables/constants defined inside are destroyed at the end of the block.
- Shadowing is allowed and common, especially in loops or narrow scopes.

See also in the Rhai Book: [Shadowing](https://rhai.rs/book/language/shadow.html) and [Global](https://rhai.rs/book/language/global.html).


## Debugging &amp; Introspection {#debugging-introspection}

```rust
print("hello");          // user-facing output
debug(some_value);       // debug representation

let t = type_of(some_value);
print(`type: ${t}`);
```

- `print(value)` writes a human‑readable representation (destination controlled by the host).
- `debug(value)` writes a more verbose/debug‑oriented representation.
- `type_of(value)` returns a string describing the runtime type.

When things go wrong:

- Use `try` / `catch` around suspicious code to surface error values.
- Add temporary `print`/`debug` calls in branches and loops.

See also in the Rhai Book: [Print and Debug](https://rhai.rs/book/language/print-debug.html), [Type Of](https://rhai.rs/book/language/type-of.html), and [Eval](https://rhai.rs/book/language/eval.html).


## Standard Functions {#standard-functions}

Most of Rhai’s “standard library” lives in built-in packages (e.g. `BasicMathPackage`, `MoreStringPackage`).
These functions are available unless you use a raw `Engine` or disable the corresponding package/feature.


### Numeric {#std-numeric}

| Category           | Functions                                                                                                      | Notes                                                          |
|--------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| Integer predicates | `is_odd`, `is_even`, `is_zero`                                                                                | Odd/even/zero tests (also as methods/properties).             |
| Sign & abs         | `abs`, `sign`                                                                                                 | `sign` returns −1, 0, or +1.                                   |
| Min/max            | `min`, `max`                                                                                                  | Smaller/larger of two numbers (ints, floats, decimals).        |
| Trigonometry       | `sin`, `cos`, `tan`, `sinh`, `cosh`, `tanh`, `asin`, `acos`, `atan(v)`, `atan(x, y)`, `asinh`, `acosh`, `atanh` | Angles in radians.                                             |
| Root & exp         | `sqrt`, `exp`                                                                                                 | Square root and exp(_e_).                                      |
| Logs               | `ln`, `log(x)`, `log(x, base)`                                                                               | Natural, base‑10, and arbitrary‑base logs.                     |
| Rounding           | `floor`, `ceiling`, `round([digits])`, `int`, `fraction`                                                     | Extra decimal-only variants: `round_up`, `round_down`, `round_half_up`, `round_half_down`. |
| Conversions        | `to_int`, `to_float`, `to_decimal`, `to_degrees`, `to_radians`                                               | Between numeric types and degrees/radians.                     |
| Float tests        | `is_nan`, `is_finite`, `is_infinite`                                                                         | Methods/properties on floats/decimals.                         |
| Parsing            | `parse_int([radix])`, `parse_float`, `parse_decimal`                                                         | From string to numbers.                                        |
| Formatting         | `to_binary`, `to_octal`, `to_hex`                                                                            | From integer to formatted string.                              |
| Constants          | `PI`, `E`                                                                                                    | Return π and e.                                                |


### Strings {#std-strings}

| Category          | Functions                                                                                                                  | Notes                                           |
|-------------------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| Length & emptiness| `len`, `bytes`, `is_empty`                                                                                                 | Character vs byte length.                      |
| Case              | `to_upper`, `to_lower`, `make_upper`, `make_lower`                                                                        | `to_*` returns new string; `make_*` mutates.   |
| Trimming          | `trim`                                                                                                                     | Strip leading and trailing whitespace.         |
| Search            | `contains`, `starts_with`, `ends_with`, `index_of(needle[, start])`                                                       | `index_of` returns index or −1.                |
| Substrings        | `sub_string(start, len)`, `sub_string(range)`, `crop(start[, len])`, `crop(range)`                                        | Extract portions of a string.                  |
| Splitting         | `split(delim[, max])`, `split_rev(delim[, max])`                                                                          | Split into an array of segments.               |
| Building & edit   | `pad`, `append`, `remove`, `pop`, `clear`, `truncate`, `replace`                                                          | Build and mutate strings.                      |
| Conversion        | `to_blob`, `to_chars`                                                                                                      | To BLOB or array of characters.                |
| Iteration         | `chars(start[, len])`                                                                                                      | Iterate over characters (also takes a range).  |
| Comparison        | `min`, `max`                                                                                                               | Lexicographic min/max of two characters/strings. |


### Arrays {#std-arrays}

| Category        | Functions                                                                                                              | Notes                                                           |
|-----------------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Index & update  | `get`, `set`, `insert`, `remove`                                                                                       | By index; negative indices count from the end.                  |
| Size            | `len`, `is_empty`                                                                                                      | Number of elements / emptiness.                                 |
| Add/remove      | `push`, `pop`, `shift`, `chop`, `clear`                                                                               | Append, remove last/first, trim head/tail, empty array.         |
| Concatenate     | `append`, `+`, `+=`                                                                                                    | Join arrays or append single elements.                          |
| Slicing         | `extract(start[, len])`, `extract(range)`, `split`, `pad`, `truncate`                                                 | Slice or resize arrays.                                         |
| Search          | `contains`, `index_of`, `find`, `find_map`                                                                            | Membership tests and searches (often via closures).             |
| Dedup & zip     | `dedup`, `zip`                                                                                                         | Remove consecutive duplicates; zip two arrays.                  |
| Higher-order    | `for_each`, `map`, `filter`, `some`, `all`, `reduce`, `reduce_rev`                                                    | Functional-style processing with closures.                      |
| Sorting         | `sort()`, `sort(cmp)`                                                                                                  | Sort homogeneous arrays or via a comparison closure.            |

The `in` operator on arrays is based on `contains` and the `==` operator for the element type.


### BLOBs {#std-blobs}

| Category        | Functions                                                                                                             | Notes                                                          |
|-----------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| Construction    | `blob(len?, value?)`                                                                                                  | Create a BLOB, optionally with initial length and fill value.  |
| Conversion      | `to_array`, `as_string`                                                                                               | To array of bytes or UTF‑8 string.                             |
| Index & update  | `get`, `set`, `insert`, `remove`                                                                                      | Index and modify bytes; negative indices count from the end.   |
| Size & clear    | `len`, `is_empty`, `clear`, `truncate`                                                                               | Size/emptiness and length changes.                             |
| Add/concat      | `push`, `append`, `+`, `+=`                                                                                           | Append bytes, BLOBs, or strings; concatenate.                  |
| Slicing         | `extract(start[, len])`, `extract(range)`, `split`, `drain`, `retain`, `splice`                                      | Various ways to cut or replace slices.                         |
| Compare         | `==`, `!=`                                                                                                            | Compare two BLOBs.                                             |
| Parsing         | `parse_le_int`, `parse_be_int`, `parse_le_float`, `parse_be_float`                                                   | Parse integers/floats from byte ranges.                        |
| Writing         | `write_le`, `write_be`, `write_utf8`, `write_ascii`                                                                  | Write integers/floats or strings into a BLOB.                  |


### Object Maps {#std-maps}

| Category        | Functions                                                                                               | Notes                                                          |
|-----------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| Index & update  | `get`, `set`, `remove`                                                                                  | Get/set/remove properties (missing keys return `()`).          |
| Size & clear    | `len()`, `is_empty`, `clear`                                                                            | Number of properties / emptiness.                              |
| Merge/mix       | `+=`, `mixin`, `+`, `fill_with`                                                                         | Combine maps; fill missing keys from another map.              |
| Compare         | `==`, `!=`                                                                                              | Compare maps element‑wise using `==`.                          |
| Membership      | `contains`, `in`                                                                                        | Check if a property exists.                                    |
| Keys & values   | `keys`, `values`                                                                                        | Arrays of property names/values (order not guaranteed).        |
| Filtering       | `drain`, `retain`, `filter`                                                                            | Keep/remove entries based on predicate functions.              |
| JSON            | `to_json`                                                                                               | Convert map to JSON string (when supported by host).           |


### Ranges & Bit-fields {#std-ranges-bits}

| Category  | Functions                                                                                   | Notes                                                   |
|-----------|---------------------------------------------------------------------------------------------|---------------------------------------------------------|
| Ranges    | `start`, `end`, `contains`, `is_empty`, `is_inclusive`, `is_exclusive`                      | Methods/properties on numeric ranges.                   |
| Range ctor| `range(start, end[, step])`                                                                 | Build numeric ranges (also for floats).                 |
| Bit-field | `get_bit`, `set_bit`, `get_bits`, `set_bits`, `bits(start[, len])`, `bits(range)`          | Inspect and manipulate bits of an integer.              |


### Time {#std-time}

| Category | Functions                                                                                           | Notes                                         |
|----------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------|
| Time     | `timestamp()`                                                                                       | Current timestamp value.                      |
| Elapsed  | `ts.elapsed`                                                                                        | Seconds since timestamp.                      |
| Math     | `ts + seconds`, `ts - seconds`, `ts += seconds`, `ts -= seconds`, `later_ts - earlier_ts`          | Add/subtract time or compute differences.     |
| Sleep    | `sleep(seconds)`                                                                                    | Block current thread for given seconds.       |


### Function pointers & metadata {#std-fn-ptr}

| Category | Functions                                                        | Notes                                      |
|----------|------------------------------------------------------------------|--------------------------------------------|
| Pointer  | `Fn("name")`                                                     | Create a function pointer by name.         |
| Inspect  | `fp.type_of()`, `fp.name`, `fp.is_anonymous`                     | Type is `"Fn"`; inspect target name.       |
| Call     | `fp.call(args...)`                                               | Invoke the referenced function.            |
| Metadata | `get_fn_metadata_list([name[, params]])`                         | Array of maps describing script functions. |


### Misc & introspection {#std-misc}

| Category      | Functions                                            | Notes                                                            |
|---------------|------------------------------------------------------|------------------------------------------------------------------|
| Printing      | `print(value)`, `debug(value)`                       | User‑facing vs debug output.                                     |
| Type info     | `type_of(value)`                                     | Runtime type as string.                                          |
| Stringify     | `to_string(value)`, `to_debug(value)`                | Convert value to display/debug strings.                          |
| Evaluation    | `eval(script)`                                       | Evaluate Rhai source inside current scope (use with care).       |
| Dynamic/shared| `is_shared(value)`                                   | Test whether a value is shared (e.g. captured by a closure).     |

---
