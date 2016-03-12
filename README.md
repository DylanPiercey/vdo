# VDO

The lightweight JSX compatible templating engine.
Perfect for creating html strings server side or in browser.

Check out [diffhtml](https://github.com/tbranyen/diffhtml) for React style diffing.

# Why
JSX is powerful compared to other templating engines but it has some warts.
It has some abstractions that simply don't make sense for creating html (ala className).
"VDO" provides a JSX interface that is specifically designed for rendering html, not DOM.

### Features
* Minimal API.
* ~1kb min/gzip.
* No extra "data-react-id".
* No random span's.
* Allows any custom attribute (react only allows data-).
* Render nested arrays.
* Optimized for rendering html.
* JSX compatible.

# Installation

#### Npm
```console
npm install vdo
```

# Example

```javascript
/** @jsx vdo */
const vdo = require('vdo');

function MyPartial (attrs, children) {
    return <span class="custom" data-value={attrs.value}/>;
}

const html = (
    <div class="root">
        <MyPartial value="1"/>
    </div>
);

document.body.innerHTML = html;

```

# API
+ **isElement(element)** : Tests if given `element` is a vdo virtual element.


```javascript
vdo.isElement(<div/>); // true
```

+ **with(context, renderer)** : Gives all components inside a render function some external `context`.


```javascript
// renderer must be a function that returns a virtual node.
function MyComponent (props, children, context) {
    return (
        <div>External data: { context }</div>
    );
}

String(vdo.with(1, ()=> <MyComponent/>));
//-> "<div>External Data: 1</div>"
```

+ **createElement(type, props, children...)** : Create a virtual node/component.

```javascript
// Automatically called when using JSX.
let vNode = vdo.createElement("div", { editable: true }, "Hello World");
// Or call vdo directly
let vNode = vdo("div", { editable: true }, "Hello World");

// Render to string on the server.
vNode.toString(); // '<div editable="true">Hello World</div>';

/**
 * @params type can also be a function (shown in example above).
 */
```

---

### Contributions

* Use gulp to run tests.

Please feel free to create a PR!
