'use strict'

var escape = require('escape-html')

// Expose module.
module.exports = Text

/**
 * @private
 * @class Text
 * Creates a virtual text node.
 *
 * @param {string} html - the html to be used in vdo.
 * @param {boolean} [raw] - if true raw html will be used (escaped by default).
 */
function Text (html, raw) {
  if (html != null) {
    this.nodeValue = String(html)
    if (!raw) this.nodeValue = escape(this.nodeValue)
  }
}

/**
 * @private
 * @constant
 * Mark instances as VDO nodes.
 */
Text.prototype.isVirtual = true

/**
 * @private
 * @constant
 * Node type for diffing algorithms.
 * Text nodes are "TEXT_TYPE".
 */
Text.prototype.nodeType = 3

/**
 * Return the stored safe html.
 *
 * @returns {String}
 */
Text.prototype.toString = function () {
  return this.nodeValue
}
