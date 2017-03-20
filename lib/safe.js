'use strict'

// Expose module.
module.exports = Safe

/**
 * @private
 * @class Safe
 * Creates a virtual node that contains safe html.
 *
 * @param {string} html - the safe html to be used in vdo.
 */
function Safe (html) {
  if (html != null) {
    this.nodeValue = String(html)
  }
}

/**
 * @private
 * @constant
 * Mark instances as VDO nodes.
 */
Safe.prototype.isVirtual = true

/**
 * @private
 * @constant
 * Node type for diffing algorithms.
 * Text nodes are "TEXT_TYPE".
 */
Safe.prototype.nodeType = 3

/**
 * Return the stored safe html.
 *
 * @returns {String}
 */
Safe.prototype.toString = function () {
  return this.nodeValue
}
