'use strict'

var escape = require('escape-html')
var CLOSED = {
  'area': 1,
  'base': 1,
  'br': 1,
  'col': 1,
  'command': 1,
  'embed': 1,
  'hr': 1,
  'img': 1,
  'input': 1,
  'keygen': 1,
  'link': 1,
  'meta': 1,
  'param': 1,
  'source': 1,
  'track': 1,
  'wbr': 1
}

// Expose module.
module.exports = Node

/**
 * @private
 * @class Node
 * Creates a virtual node that can be converted into html.
 *
 * @param {string} nodeName - The tagname of the element.
 * @param {object} attributes - An object containing events and attributes.
 * @param {Array} childNodes - The child nodeList for the element.
 */
function Node (nodeName, attributes, childNodes) {
  this.nodeName = nodeName
  this.attributes = attributes
  this.childNodes = CLOSED[nodeName] ? false : childNodes
}

/**
 * @private
 * @constant
 * Node type for diffing algorithms.
 * Regular nodes are "ELEMENT_TYPE".
 */
Node.prototype.nodeType = 1

/**
 * @private
 * @constant
 * Mark instances as VDO nodes.
 */
Node.prototype.isVirtual = true

/**
 * Generate valid html for the virtual node.
 *
 * @returns {string}
 */
Node.prototype.toString = function () {
  var key, attr
  var attributes = ''
  var nodeName = this.nodeName
  var childNodes = this.childNodes

  // Build attributes string.
  for (key in this.attributes) {
    attr = this.attributes[key]
    if (attr == null || attr === false) continue
    if (attr === true) attributes += ' ' + key
    else attributes += ' ' + key + '="' + escape(attr) + '"'
  }

  return (
    '<' + nodeName + attributes + '>' + (
      // Self closing nodes will not have childNodes or an end tag.
      childNodes === false
        ? ''
        : childNodes.join('') + '</' + nodeName + '>'
    )
  )
}
