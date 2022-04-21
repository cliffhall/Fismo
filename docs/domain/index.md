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
The [Fismo NPM package](https://www.npmjs.com/package/fismo) contains self-validating, self-marshaling representations of the domain model. The entities and enums are implemented as JavaScript classes, and are available in both browser and commonjs (Node) versions.

#### Entity
* 🔬 [`ActionResponse`](ActionResponse.md) - An invoked action's response.
* 🔬 [`Machine`](Machine.md) - States + Transitions = Machine.
* 🔬 [`Position`](Position.md) - Machine + State =  Position, for recording history.
* 🔬 [`State`](State.md) - Name + Transitions + guard code = State.
* 🔬 [`Transition`](Transition.md) - Action + target State = Transition.

#### Enum
* 🔬 [`Guard`](Guard.md) - Types of Transition Guards ( Enter / Exit )
