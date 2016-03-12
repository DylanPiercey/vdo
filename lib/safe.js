"use strict";

var safe = Safe.prototype;
module.exports = Safe;

/*
 * @private
 * @class Safe
 * @description
 * Creates a virtual node that contains safe html.
 *
 * @param {String} html - the safe html to be used in vdo.
 */
function Safe (html) {
	if (html != null) {
		this.innerHTML = String(html);
	}
}

/*
 * @private
 * @constant
 * @description
 * Mark instances as VDO nodes.
 */
safe.isVirtual = true;

/*
 * @description
 * Return the stored safe html.
 *
 * @returns {String}
 */
safe.toString = function () {
	return this.innerHTML;
};
