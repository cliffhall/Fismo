---
layout: default
parent: Developers
title: SDK
nav_order: 1
has_toc: false
---
# Fismo SDK
### Get the NPM Package
💾 [`Fismo SDK`](https://www.npmjs.com/package/fismo)
```shell
npm install fismo
```
### Contents
#### Open Alpha - May change frequently!
The Fismo SDK contains everything you need to build:
* 📜 Solidity 
  * 📂 `fismo/contracts/domain/`
    * ✅ Revert reasons
    * ✅ Structs and enums
    * ✅ Fismo storage slot struct and position
  * 📂 `fismo/contracts/interfaces/`
    * ✅ All [supported interfaces](../api/index.md)
* 📜 JavaScript 
  * 📂 `fismo/sdk/browser/index.js`
    * ✅ A CommonJS version for use in the browser
  * 📂 `fismo/sdk/node/index.js`
    * ✅ An ES6 version for use in Node.js
  * ✅ Self-validating domain entities in JavaScript
  * ✅ Utilities for encoding names to IDs
  * ✅ All Fismo contract revert reasons
  * ✅ Official, cloneable contract addresses for supported chains
* 📜 JSON
  * 📂 `fismo/fismo-abi.json`
    * ✅ Solidity contract ABI for each supported Fismo interface

#### Other Resources
[Fismology](https://github.com/cliffhall/Fismology) is a separate project for exploring how to build on the Fismo SDK. It uses the NPM package and demonstrates both the included CommonJS and ES6 versions for scripting and in-browser interaction, respectively.

### Solidity Usage

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import {IFismoView} from "fismo/contracts/interfaces/IFismoView.sol";
import {FismoConstants} from "fismo/contracts/domain/FismoConstants.sol";
import {FismoTypes} from "fismo/contracts/domain/FismoTypes.sol";

contract MyFismoClient is FismoTypes, FismoConstants {
    
    IFismoView fismoView;
    bytes4 machineId;
    constructor(address _fismoAddress, bytes4 _machineId) {
        fismo = IFismoView(_fismoAddress);
        machineId = _machineId;
    }

    function getAvailableActions(address _user) external view {
        State currentState = fismoView.getUserState(_user, machineId);
        ...
    }
    
}

```

### Browser (ES6) Usage
```html
<html>
<head>
    <script src="node_modules/fismo/sdk/browser/index.js"></script>
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

### Node.js (commonjs) Usage
```javascript
const {
    ActionResponse,
    Guard,
    Machine,
    Position,
    State,
    Transition,
    InterfaceIds,
    RevertReasons,
    Deployments,
    nameToId,
    validateId,
    validateNameLax,
    validateNameStrict
} = require("fismo/sdk/node");

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