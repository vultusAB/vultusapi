_Syntax for modifying this document can be found [here](https://guides.github.com/features/mastering-markdown/#examples)_

### _subrepo_ Vutlus platform application

This repository contain the client side application.
_When setting up dev environment multiple repositories must be combined._

## Infastructure

| Library              | Name       | Purpose            |
| -------------------- | ---------- | ------------------ |
| @angular             | Angular    | Framework          |
| @angular/router      |            | Navigation         |
| @angular/flex-layout |            | Layout positioning |
| @clr                 | Clarity    | Layout views       |
| pouchdb              | PouchDB    | Database           |
| webpack              | Webpack    | Deployment         |
| typescript           | Typescript | Compatibility      |
| bootstrap            | Bootstrap  | CSS extension      |

## ES6 extension

| Library                                                                | Name            | Local name | Purpose                            |
| ---------------------------------------------------------------------- | --------------- | ---------- | ---------------------------------- |
| [array-uniq](https://www.npmjs.com/package/array-uniq)                 | ArrayUniq       | UArray     | Extract uniq values                |
| [array-difference-x](https://www.npmjs.com/package/array-difference-x) | ArrayDifference | FArray     | Filter first based on second array |
| [arrays-diff](https://www.npmjs.com/package/arrays-diff)               | ArrayDiff       | DArray     | Extract uniq values in arrays      |
| [array-events](https://www.npmjs.com/package/array-events)             | EventedArray    | EArray     | Events on array                    |
| [change-case](https://www.npmjs.com/package/change-case)               | ChangeCase      | CastTo     | Format strings                     |
| [deep-extend](https://www.npmjs.com/package/deep-extend)               | DeepExtend      | DMerge     | Merge two objects                  |
| [validator.js](https://www.npmjs.com/package/validator)                | Validator       | ValidateIf | Validates strings                  |
| [array-flatten](https://www.npmjs.com/package/array-flatten)           | Array Flatten   | Flatten    | Flatten array                      |

## array-uniq

Example

```js
import * as UArray from "array-uniq";

UArray([1, 1, 2, 3, 3]);
//=> [1, 2, 3]

UArray(["foo", "foo", "bar", "foo"]);
//=> ['foo', 'bar']
```

## array-difference-x

**Example**

```js
import * as FArray from "array-difference-x";

FArray([2, 1], [2, 3]); // => [1]
```

## arrays-diff

Example

```js
import * as DArray from "arrays-diff";
const a = ["a", "b", "c", "d"];
const b = ["b", "c", "d", "e"];
console.log(DArray(a, b)); // => ['a', 'e']
```

## array-events

Is an Array extension class which adds asynchronous functions to Array as well as firing events on 'remove', 'add' or 'change'

    var EventedArray = require('array-events');
    var myArray = new EventedArray();

_change_ : fired any time an element is added or removed
_add_ : fired any time an element is added
_remove_ : fired any time an element is removed

**emitter functions**

EventedArrays are also [Emitters](http://docs.nodejitsu.com/articles/getting-started/control-flow/what-are-event-emitters) but have an expanded syntax from [extended-emitter](https://github.com/khrome/extended-emitter) and the additional `.when()` call.

    myArray.on('change', function(event){ });
    myArray.once('change', function(event){ });
    myArray.off('change', function(event){ });
    myArray.emit('change'[, arguments]);

## change-case

All methods accept two arguments, the string to change case and an optional locale.

##### [camelCase](https://github.com/blakeembrey/camel-case)

Return as a string with the separators denoted by having the next letter capitalized.

```js
CastTo.camelCase("test string");
//=> "testString"
```

##### [constantCase](https://github.com/blakeembrey/constant-case)

Return as an upper case, underscore separated string.

```js
CastTo.constantCase("test string");
//=> "TEST_STRING"
```

##### [dotCase](https://github.com/blakeembrey/dot-case)

Return as a lower case, period separated string.

```js
CastTo.dotCase("test string");
//=> "test.string"
```

##### [headerCase](https://github.com/blakeembrey/header-case)

Return as a title cased, dash separated string.

```js
CastTo.headerCase("test string");
//=> "Test-String"
```

##### [isLowerCase](https://github.com/blakeembrey/is-lower-case)

Return a boolean indicating whether the string is lower cased.

```js
CastTo.isLowerCase("test string");
//=> true
```

##### [isUpperCase](https://github.com/blakeembrey/is-upper-case)

Return a boolean indicating whether the string is upper cased.

```js
CastTo.isUpperCase("test string");
//=> false
```

##### [lowerCase](https://github.com/blakeembrey/lower-case)

Return the string in lower case.

```js
CastTo.lowerCase("TEST STRING");
//=> "test string"
```

##### [lowerCaseFirst](https://github.com/blakeembrey/lower-case-first)

Return the string with the first character lower cased.

```js
CastTo.lowerCaseFirst("TEST");
//=> "tEST"
```

##### [noCase](https://github.com/blakeembrey/no-case)

Return the string without any casing (lower case, space separated).

```js
CastTo.noCase("test string");
//=> "test string"
```

##### [paramCase](https://github.com/blakeembrey/param-case)

Return as a lower case, dash separated string.

```js
CastTo.paramCase("test string");
//=> "test-string"
```

##### [pascalCase](https://github.com/blakeembrey/pascal-case)

Return as a string denoted in the same fashion as `camelCase`, but with the first letter also capitalized.

```js
CastTo.pascalCase("test string");
//=> "TestString"
```

##### [pathCase](https://github.com/blakeembrey/path-case)

Return as a lower case, slash separated string.

```js
CastTo.pathCase("test string");
//=> "test/string"
```

##### [sentenceCase](https://github.com/blakeembrey/sentence-case)

Return as a lower case, space separated string with the first letter upper case.

```js
CastTo.sentenceCase("testString");
//=> "Test string"
```

##### [snakeCase](https://github.com/blakeembrey/snake-case)

Return as a lower case, underscore separated string.

```js
CastTo.snakeCase("test string");
//=> "test_string"
```

##### [swapCase](https://github.com/blakeembrey/swap-case)

Return as a string with every character case reversed.

```js
CastTo.swapCase("Test String");
//=> "tEST sTRING"
```

##### [titleCase](https://github.com/blakeembrey/title-case)

Return as a space separated string with the first character of every word upper cased.

```js
CastTo.titleCase("a simple test");
//=> "A Simple Test"
```

##### [upperCase](https://github.com/blakeembrey/upper-case)

Return the string in upper case.

```js
CastTo.upperCase("test string");
//=> "TEST STRING"
```

##### [upperCaseFirst](https://github.com/blakeembrey/upper-case-first)

Return the string with the first character upper cased.

```js
CastTo.upperCaseFirst("test");
//=> "Test"
```

## array-flatten

Example

```javascript
var flatten = require("array-flatten");

flatten([1, [2, [3, [4, [5], 6], 7], 8], 9]);
//=> [1, 2, 3, 4, 5, 6, 7, 8, 9]

flatten.depth([1, [2, [3, [4, [5], 6], 7], 8], 9], 2)(
  //=> [1, 2, 3, [4, [5], 6], 7, 8, 9]

  function() {
    flatten.from(arguments); //=> [1, 2, 3]
  }
)(1, [2, 3]);
```

## Commands

**Note**
The commands are directory specific

Run application
`npm run start`

Build application
`npm run build`

When Webpack config files are being modified the compiler must be active to apply the changes.

`npm run tsc:support`

Todo's

Add localization on fields

## Data structure

#### Account

- [x] Account provide access to platform.
  - Account has no parent.
  - Account has no relation.
  - Account has no owner.

Legal identity has Account.
Legal identity are represented by Account

- [x] Account use Email and Password combination to validate authorization.
- [x] Account use PouchDB instance to validate authorization.

#####Data

- [x] Account has identifier.
- [x] Account has email.
- [x] Account has password.
- [x] Account has localization
- [x] Account has metadata about Legal identity

#### Farm

- [ ] Farm provide container for Fields
- [ ] Farm provide access control endpoint

**Logic**

- [ ] Farm instance Weather
- [ ] Farm instance Growing degree days: Weather
- [ ] Farm instance Fields
- [ ] Farm use Fields[] to determine outer latlng bounds

**Data**

- [ ] Farm has metadata about fysical identity
- [ ] Farm has latlng
- [ ] Farm has no parent.
- [ ] Farm has relation to Account.
- [ ] Farm are owned by Account

**GRUD** (create, read, update, and delete)

- [ ] Farm can be created by Account: \*
- [ ] Farm can be read by Account: Owner | Visitor
- [ ] Farm can be updated by Account: Owner
- [ ] Farm can be deleted by Account: Owner

#### Field

- [ ] Field provide container for Zones
- [ ] Field provide container for Comment
- [ ] Field provide access control endpoint
      **Logic**
- [ ] Field instance Zones
- [ ] Field use Shape[] to determine outer latlng bounds
      **Data**
- [ ] Field has name
- [ ] Field has latlng center
- [ ] Field has latlng bounds
- [ ] Field has localization
- [ ] Field has metadata about physical identity
- [ ] Field are child to Farm
- [ ] Field has relation to Account.
- [ ] Field are owned by Account

**GRUD** (create, read, update, and delete)

- [ ] Field can be created by \* : Farm: Owner
- [ ] Field can be read by Account: Farm: Owner | Visitor & Account: Visitor | Link: Visitor
- [ ] Field can be updated by \*: Farm: Owner
- [ ] Field can be deleted by \*: Farm: Owner

#### Zone

- [ ] Zone provide container for Analysis

- [ ] Zone append Analysis
- [ ] Zone use Shape[] to determine outer latlng bounds

**Data**

- [ ] Zone has daterange
- [ ] Zone has latlng center
- [ ] Zone has latlng bounds
- [ ] Zone has metadata about physical identity

**Logic**

- [ ] Zone are child to Field
- [ ] Zone has relation to Account.
- [ ] Zone are owned by Field

**GRUD** (create, read, update, and delete)

- [ ] Zone can be created by \*:Field: Owner
- [ ] Zone can be read by \*: Field: Owner | Visitor
- [ ] Zone can be updated by \*: Field: Farm: Owner
- [ ] Zone can be deleted by \*: Field: Farm: Owner

#### Field comment

**Data**

- [ ] Comment has LatLng
- [ ] Comment has Content
- [ ] Comment has Category
- [ ] Comment has Shape

**Logic**

- [ ] Comment are child to Field
- [ ] Comment has relation to Account.
- [ ] Comment are owned by Account
- [ ] Comment has option to edits its shape.

**GRUD** (create, read, update, and delete)

- [ ] Comment can be created by \*
- [ ] Comment can be read by \*
- [ ] Comment can be updated by Account: Comment: Owner
- [ ] Comment can be deleted by Account: Farm: Owner | Account: Comment: Owner

### Access control

##### Invitation

Account: Farm: Owner

- [ ] Invite Account by Email. (default) Read.

Case: Account: Owner can invite an Account to have read access to Farm and related content. This give the invited account the right to GRUD owned comment, and read comments that exists.

##### Link access

Access granted by: Account: Farm: Owner

- [ ] Realtime by direct link to specific farm. (default) Read

Case: Account owner can provide link to viewer in real-time to provide insight for a real time discussion.

### Customization

##### Option Logic

Hierarchy for options
Application -> Account: Farm: Owner -> Account
