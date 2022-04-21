---
layout: default
title: Domain Model
nav_order: 6
has_children: true
has_toc: false
---
# Domain Model
### Solidity

Some methods of the Solidity contract interfaces reference structs and enums that represent Fismo's domain model which are defined on [FismoTypes.sol](https://github.com/cliffhall/Fismo/blob/main/contracts/domain/FismoTypes.sol). 

The NPM package contains self-validating, self-marshaling, JavaScript representations of the domain model.

* 🔬 [`ActionResponse`](ActionResponse.md) - An invoked action's response.
* 🔬 [`Machine`](Machine.md) - States + Transitions = Machine.
* 🔬 [`Position`](Position.md) - Machine + State =  Position, for recording history.
* 🔬 [`State`](State.md) - Name + Transitions + guard code = State.
* 🔬 [`Transition`](Transition.md) - Action + target State = Transition.
