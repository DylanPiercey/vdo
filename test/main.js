var assert = require("assert");
var vdo    = require("../lib");

describe("Function", function () {
	it("should test for valid vdo elements", function () {
		assert.equal(vdo.isElement(vdo("div")), true);
		assert.equal(vdo.isElement(1), false);
	});
	it("should be able to create", function () {
		var ChildComponent, MyComponent;
		ChildComponent = function (props, children) {
			return vdo("h1", null, children.map(function (child, i) {
				child.attrs = {
					"class": "child-" + i
				};
				return child;
			}));
		};
		MyComponent = function (attrs, children) {
			var value = attrs.value;
			return vdo("div", null,
				vdo(ChildComponent, { value: value * 2 },
					Array.from(Array(value + 1)).map(function (j, i) {
						return vdo("span", null, i);
					})
				)
			);
		};
		assert.equal(
			String(vdo(MyComponent, { value: 5 })),
			'<div><h1><span class="child-0">0</span><span class="child-1">1</span><span class="child-2">2</span><span class="child-3">3</span><span class="child-4">4</span><span class="child-5">5</span></h1></div>'
		);
	});
	it("should be able to set a context", function () {
		assert.equal(vdo["with"](1, function () {
			return vdo(MyComponent);
		}), "<div>1</div>");

		function MyComponent (props, children, context) {
			return vdo("div", null, context);
		};
	});
});

describe("Node", function () {
	it("should be able to create", function () {
		assert.equal(vdo("div").type, "div");
	});
	it("should be able to set attributes", function () {
		var node = vdo("div", { a: undefined, b: null, c: false, d: true, e: 1, f: "hi" });
		assert.equal(node.type, "div");
		assert.deepEqual(node.attrs, { a: undefined, b: null, c: false, d: true, e: 1, f: "hi" });
		assert.equal(node.toString(), '<div d e="1" f="hi"></div>');
	});
	it("should add children", function () {
		var node = vdo("div", null, 1, 2, 3);
		assert.equal(node.type, "div");
		assert.equal(Object.keys(node.children).length, 3);
		assert.equal(String(node), "<div>123</div>");
	});
	it("should add child nodes", function () {
		var node = vdo("div", null, vdo("span"), vdo("span"), vdo("span"));
		assert.equal(node.type, "div");
		assert.equal(Object.keys(node.children).length, 3);
		assert.equal(String(node), "<div><span></span><span></span><span></span></div>");
	});
	it("should escape child strings", function () {
		var node = vdo("div", null, "<span></span>");
		assert.equal(node.type, "div");
		assert.equal(String(node), "<div>&lt;span&gt;&lt;/span&gt;</div>");
	});
	it("should ignore null and false children", function () {
		var node = vdo("div", null, [null, false, "hello"]);
		assert.equal(node.type, "div");
		assert.equal(String(node), "<div>hello</div>");
	});
	it("should set safe html", function () {
		var node = vdo("div", null, vdo.markSafe("<span></span>"));
		assert.equal(node.type, "div");
		assert.equal(String(node), "<div><span></span></div>");
	});
});
