---
layout: default
title: SDK
nav_order: 8
has_children: true
has_toc: false
---
# SDK
The Fismo SDK
### NPM Package
💾 [`Fismo`](https://www.npmjs.com/package/fismo)
```shell
npm install fismo
```

### Browser (ES6)
```html
<head>
    <script src="node_modules/Fismo/browser/fismo.js"></script>
</head>
```

### Node (commonjs)
```javascript
const { 
    ActionResponse, 
    Guard,
    Machine,
    Position,
    State,
    Transition,
    nameToId,
    validateId,
    validateNameLax,
    validateNameStrict
} = require("fismo");

```