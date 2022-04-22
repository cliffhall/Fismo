---
layout: default
title: About
nav_order: 1
---
# The Finite State Machine Protocol

#### Consider this
> There are standards for tokens that allow us to represent static things like currency, ownership, membership, and participation. _But why do we have no standard for representing a world and an individual's dynamic path through it?_

#### A Humble Solution
Fismo Machines are a way of simulating processes, branching narratives, maps of places, or nearly any stateful thing you can imagine.

In a nutshell, Fismo enforces rules about transitions between states when users invoke actions.

The builder writes custom Solidity functions that get called when state transitions happen. Transitions don't always need such hooks, but when they do, anything can be queried or stored, and the transaction can be reverted if your conditions aren't met. Further, each user's progress through a Fismo Machine is recorded and can be queried publicly by anyone. Hmm, _Proof of Quest Protocol?_ 🤔

State transitions can be gated by the tokens a user holds, places the've been, or any other accessible value, be it stored or derived. Likewise, new values could be stored or tokens transferred to a user when they take some action or arrive at some waypoint.

#### But wait, there's more...
* 💥 Cheaply clone Fismo on Ethereum or deploy to any EVM
* 💥 Configure and install a virtually unlimited number of machines
* 💥 Use off-chain metadata to richly describe states in any 
* 💥 Deploy custom logic for
  - 👉 Controlling access to your machines
  - 👉 Initializing storage for newly installed machines
  - 👉 Responding to any state transition
  - 👉 Contextually filtering available actions for any state

##  [![Created by Futurescale](images/created-by.png)](https://futurescale.com)