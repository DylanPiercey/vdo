'use strict'

var Node = require('./node')
var Text = require('./text')
var _context

// Expose module.
module.exports = vdo['default'] = vdo.createElement = vdo

/**
 * Utility to create virtual elements.
 * If the given type is a string then the resulting virtual node will be created with a tagname of that string.
 * Otherwise if the type is a function it will be invoked, and the returned nodes used.
 *
 * @example
 * vdo("div", { id: "example" }, ...); // -> Node
 *
 * @param {string|Function} type - A nodeName or a function that returns a Node.
 * @param {object} attributes - The events and attributes for the resulting element.
 * @param {Node[]} childNodes - The childNodes for the resulting element.
 * @throws {TypeError} type must be a function or a string.
 * @return {Node}
 */
function vdo (type, attributes /* ...childNodes: Node[] */) {
  attributes = attributes || {}

  // Convert child arguments to an array.
  var childNodes = new Array(Math.max(arguments.length - 2, 0))
  for (var i = childNodes.length; i--;) childNodes[i] = arguments[i + 2]
  childNodes = normalizeChildren(childNodes, [])

  switch (typeof type) {
    case 'string':
      return new Node(type, attributes, childNodes)
    case 'function':
      attributes.children = childNodes
      return type(attributes, childNodes, _context)
    default:
      throw new TypeError('VDO: Invalid virtual node type.')
  }
}

/**
 * Check if an element is a virtual vdo element.
 *
 * @example
 * vdo.isElement(<body>Hello World!</body>); //-> true
 *
 * @param {*} node - The node to test.
 * @returns {Boolean}
 */
vdo.isElement = function (node) {
  return Boolean(node && node.isVirtual)
}

/**
 * Marks a string of html as safe to be used as a child node.
 *
 * @example
 * const html = "<span></span>"
 * const node = <body>{vdo.markSafe(html)}</body>
 * String(node) //-> "<body><span></span></body>"
 *
 * @param {*} html - The html to mark as safe.
 * @returns {Safe}
 */
vdo.markSafe = function (html) {
  return new Text(html, true)
}

/**
 * Utility to attach context to #createElement for sideways data loading.
 * The provided renderer will be immediately invoked.
 *
 * @example
 * let MyComponent = function (attributes, childNodes, context) {
 *   return (
 *     <body>
 *       Counter: { context.counter }
 *     </body>
 *    )
 * }
 *
 * let html = vdo.with({ counter: 1 }, function () {
 *  return (
 *    <MyCounter/>
 *  )
 * })
 *
 * html; //-> "Counter: 1"
 *
 * @param {*} context - A value that any custom render functions will be invoked with.
 * @param {Function} renderer - Any nodes rendered within the function will be called with the context.
 * @throws {TypeError} The result of renderer must be a Node.
 * @returns {Node}
 */
vdo.with = function (context, renderer) {
  if (typeof renderer !== 'function') throw new TypeError('VDO: renderer should be a function.')

  _context = context
  var node = renderer(context)
  _context = undefined
  return node
}

/**
 * Flattens an arbitrarily deep array and casts non virtual nodes to text nodes.
 *
 * @param {*} arr - the nested array.
 * @param {Array} result - the array to add the results to.
 * @return {Array}
 */
function normalizeChildren (arr, result) {
  for (var i = 0, len = arr.length, item; i < len; i++) {
    item = arr[i]
    // Skip nullish or false items.
    if (item == null || item === false) continue
    else if (Array.isArray(item)) normalizeChildren(item, result)
    else result.push(item.isVirtual ? item : new Text(item))
  }

  return result
}
