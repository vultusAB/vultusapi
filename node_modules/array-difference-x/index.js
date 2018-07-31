/**
 * @file Creates an array of array values not included in the other given arrays.
 * @version 2.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-difference-x
 */

'use strict';

var filter = require('array-filter-x');
var some = require('array-some-x');
var slice = require('array-like-slice-x');
var arrayincludes = require('array-includes-x');
var isNil = require('is-nil-x');

/**
 * This method creates an array of array values not included in the other given
 * arrays using SameValueZero for equality comparisons. The order and references
 * of result values are determined by the first array.
 *
 * @param {array} array - The array to inspect.
 * @throws {TypeError} If array is null or undefined.
 * @param {...array} [exclude] - The values to exclude.
 * @returns {array} Returns the new array of filtered values.
 * @example
 * var difference = require('array-difference-x');
 *
 * difference([2, 1], [2, 3]); // => [1]
 */
module.exports = function difference(array) {
  if (isNil(array)) {
    return [];
  }

  var excludes = slice(arguments, 1);
  return filter(array, function (value) {
    return some(excludes, function (exclude) {
      return isNil(exclude) === false && arrayincludes(exclude, value);
    }) === false;
  });
};
