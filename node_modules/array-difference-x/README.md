<a href="https://travis-ci.org/Xotic750/array-difference-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/array-difference-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-difference-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-difference-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-difference-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-difference-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/array-difference-x" title="npm version">
<img src="https://badge.fury.io/js/array-difference-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_array-difference-x"></a>

## array-difference-x
Creates an array of array values not included in the other given arrays.

**Version**: 2.0.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_array-difference-x--module.exports"></a>

### `module.exports(array, [...exclude])` ⇒ <code>array</code> ⏏
This method creates an array of array values not included in the other given
arrays using SameValueZero for equality comparisons. The order and references
of result values are determined by the first array.

**Kind**: Exported function  
**Returns**: <code>array</code> - Returns the new array of filtered values.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The array to inspect. |
| [...exclude] | <code>array</code> | The values to exclude. |

**Example**  
```js
var difference = require('array-difference-x');

difference([2, 1], [2, 3]); // => [1]
```
