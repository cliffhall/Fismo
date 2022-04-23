---
layout: default
parent: Developers
title: SDK
nav_order: 8
has_toc: false
---
# Fismo SDK
#### In progress
The Fismo SDK (currently WIP) will contain everything you need to:
* ✅ Create Solidity contracts that communicate with Fismo
* ✅ Interact with Fismo from a browser or Node.js.
* ✅ Create and validate Fismo domain entities.
* 👉 Clone a Fismo instance on a supported chain.
* 👉 Install and optionally initialize storage for your own machines.
* 👉 Add more states and transitions to your installed machines.
* 👉 Invoke actions on your machines.
* 👉 Query a user's current state, last position, and position history.

### Get the NPM Package
💾 [`Fismo`](https://www.npmjs.com/package/fismo)
```shell
npm install fismo
```

### Browser Example (ES6)
```html
<html>
<head>
    <script src="node_modules/Fismo/browser/fismo.js"></script>
</head>
<body onload="testFismoConstructors()">
<script>

    function testFismoConstructors() {

        let a = new Fismo.ActionResponse();
        console.log(a);

        let m = new Fismo.Machine();
        console.log(m);

        let s = new Fismo.State();
        s.guardLogic = "0x068d9f17fBF0CCBF39BD8DA421731Fe86986bD3a";
        console.log(s, s.guardLogicIsValid()); // proves eip55 is there

        let t = new Fismo.Transition();
        console.log(t);

        let p = new Fismo.Position();
        console.log(p);

        let name = "Fismology!"
        console.log(name, Fismo.nameToId(name));

    }
</script>
</body>
</html>
```

### Node.js Example (commonjs)
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
} = require("./node_modules/Fismo/node/fismo.js");

let a = new ActionResponse();
console.log(a);

let m = new Machine();
console.log(m);

let s = new State();
s.guardLogic = "0x28928a86697dAa456C11232d0475B6eE1d5f3efa";
console.log(s, s.guardLogicIsValid()); // proves eip55 is there

let t = new Transition();
console.log(t);

let p = new Position();
console.log(p);

let name = "Fismology!"
console.log(name, Fismo.nameToId(name));

```