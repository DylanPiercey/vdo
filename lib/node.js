"use strict";

var escape = require("escape-html");
var node   = Node.prototype;
var CLOSED = {
	"area": true,
	"base": true,
	"br": true,
	"col": true,
	"command": true,
	"embed": true,
	"hr": true,
	"img": true,
	"input": true,
	"keygen": true,
	"link": true,
	"meta": true,
	"param": true,
	"source": true,
	"track": true,
	"wbr": true
};

module.exports = Node;

/*
 * @private
 * @class Node
 * @description
 * Creates a virtual node that can be converted into html.
 *
 * @param {String} type - The tagname of the element.
 * @param {Object} attrs - An object containing events and attributes.
 * @param {Array} children - The child nodeList for the element.
 */
function Node (type, attrs, children) {
	this.type     = type;
	this.attrs    = attrs;
	this.children = CLOSED[this.type] ? false : children;
};

/*
 * @private
 * @constant
 * @description
 * Mark instances as VDO nodes.
 */
node.isVirtual = true;

/*
 * @description
 * Generate valid html for the virtual node.
 *
 * @returns {String}
 */
node.toString = function () {
	var key, attr;
	var attrs = "";
	var children = "";
	var childNodes = this.children;

	// Build attrs string.
	for (key in this.attrs) {
		attr = this.attrs[key];
		if (attr == null || attr === false) continue;
		attrs += " " + key + "=\"" + escape(attr) + "\"";
	}

	if (childNodes === false) {
		// Self closing nodes will not have children.
		return "<" + this.type + attrs + ">";
	} else if (Array.isArray(childNodes)) {
		// Cast all children to strings, escaping non vdo nodes.
		for (var child, i = 0, len = childNodes.length; i < len; i++) {
			child = childNodes[i];
			if (child == null) continue;
			children += child.isVirtual ? child : escape(child);
		}
	}

	return "<" + this.type + attrs + ">" + children + "</" + this.type + ">";
};
