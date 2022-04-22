---
layout: default
title: Domain Model
nav_order: 6
has_children: true
has_toc: false
---
# Domain Model
### Solidity

The [contract interfaces](../api/index.md) documentation references structs and enums that represent Fismo's domain model. 

Those are all defined in [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol). 

### JavaScript
The [Fismo NPM package](https://www.npmjs.com/package/fismo) contains self-validating, self-marshaling representations of the domain model. The entities and enums are implemented as JavaScript classes, and are available in both ES6 (browser) and commonjs (Node) versions.

#### Entity
* 🦠 [`ActionResponse`](ActionResponse.md) - The details of a successful state transition.
* 🦠 [`Machine`](Machine.md) - The complete on-chain definition of a machine.
* 🦠 [`Position`](Position.md) - Machine and state, the longitude and latitude of Fismo.
* 🦠 [`State`](State.md) - The complete on-chain definition of a state.
* 🦠 [`Transition`](Transition.md) - The complete on-chain definition of a transition.

#### Enum
* 🦠 [`Guard`](Guard.md) - Transition guard types ( Enter / Exit )
