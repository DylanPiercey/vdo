'use strict'

var escape = require('escape-html')
var node = Node.prototype
var CLOSED = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'command': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
}

module.exports = Node

/*
 * @private
 * @class Node
 * @description
 * Creates a virtual node that can be converted into html.
 *
 * @param {String} nodeName - The tagname of the element.
 * @param {Object} attributes - An object containing events and attributes.
 * @param {Array} childNodes - The child nodeList for the element.
 */
function Node (nodeName, attributes, childNodes) {
  this.nodeName = nodeName
  this.attributes = attributes
  this.childNodes = CLOSED[this.nodeName] ? false : childNodes
}

/**
 * @private
 * @constant
 * @description
 * Node type for diffing algorithms.
 * Regular nodes are "ELEMENT_TYPE".
 */
node.nodeType = 1

/*
 * @private
 * @constant
 * @description
 * Mark instances as VDO nodes.
 */
node.isVirtual = true

/*
 * @description
 * Generate valid html for the virtual node.
 *
 * @returns {String}
 */
node.toString = function () {
  var key, attr
  var attributes = ''
  var innerHTML = ''
  var childNodes = this.childNodes

  // Build attributes string.
  for (key in this.attributes) {
    attr = this.attributes[key]
    if (attr == null || attr === false) continue
    if (attr === true) attributes += ' ' + key
    else attributes += ' ' + key + '="' + escape(attr) + '"'
  }

  if (childNodes === false) {
    // Self closing nodes will not have childNodes.
    return '<' + this.nodeName + attributes + '>'
  } else if (Array.isArray(childNodes)) {
    // Cast all childNodes to strings, escaping non vdo nodes.
    for (var child, i = 0, len = childNodes.length; i < len; i++) {
      child = childNodes[i]
      if (child == null || child === false) continue
      innerHTML += child.isVirtual ? child : escape(child)
    }
  }

  return '<' + this.nodeName + attributes + '>' + innerHTML + '</' + this.nodeName + '>'
}
