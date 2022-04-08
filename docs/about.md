![Fismo](images/fismo-logo.png)
# [Status](../README.md) 🧪 About 🧪 [FAQ](faq.md) 🧪 [Docs](intro.md)

## Experiment
### Deterministic Selector Proxy
Most extensible among Solidity contract proxy patterns is the [EIP-2535](https://eips.ethereum.org/EIPS/eip-2535) Diamond Multi-Facet Proxy specification. It allows a proxy to have more than one upgradeable implementation (logic) contract. The Diamond architecture is extremely useful for almost any non-trivial contract suite, lending a modular building approach that can place any amount of logic behind a single Ethereum address. Having built upon the Diamond architecture multiple times, I highly recommend it.

However, one criticism auditors and implementers have often raised is the level of complexity involved in managing the "Facets" (how the Diamond spec refers to implementation contracts) and their function selectors. That complexity is for the most part tucked away out of sight and works flawlessly. But it does beg the question: 

> What other forms might the multiple-implementation proxy pattern take?

Fismo began as an experiment in what I will call Deterministic Selector Proxy design. The idea was that the function selectors would be determined not by calling complicated maintenance functions to associate a given function selector with its implementation, but rather by **generating the function selector on the fly** somehow, based on the execution context.

Nifty idea, but without a problem domain, this hypothetical deterministic selector proxy would have no context within which to formulate function selectors to be proxied. 

## Problem Domain
### Finite State Machines
FSMs are a perfect match for this experiment. As problem domains go, it's relatively simple, but still non-trivial. You can describe them in a lightweight way, validate the descriptions easily, consume them in Solidity, and place them into contract storage. It is straightforward to enforce that transitions between states follow the edges of their directed graph. Fismo does that automatically.

But there is one place where you need to add custom code: _guarding state transitions._ 

In the [Lockable Door](../contracts/lab/LockableDoor) example, going from the Locked state to the Unlocked state should require that the user have a key. That could be an NFT, or just some state in the contract. 

This is where you need to write some code and deploy a guard logic implementation contract. It is also where we get a chance to test the Deterministic Selector Proxy hypothesis at the heart of the Fismo experiment.

In the machine definition for the Locked state, the `exitGuarded` flag should be set to `true` and the `guardLogic` property set to this guard contract's address. When Fismo tries to transition between the Locked state and the Open state, it will attempt to execute the following function by combining machine name, state name, and guard direction.

> `LockableDoor_Locked_Exit(address user, string calldata _action, string calldata _nextStateName)`

This requires a developer to write function signatures in a very specific way, but it nicely demonstrates the Deterministic Selector Proxy concept with no chance of function signature collision, since:
  - Each machine name must be unique  
  - Within a machine, each state name must be unique
  - There are only two valid guard directions

## Outcomes
### A technology demonstration
* The Deterministic Selector Proxy concept is fully demonstrated. Implementations for other problem domains wherein the expected function selector can be determined from execution context alone could follow this pattern for implementation. For instance, a geo-tagging system could have selectors based on a global coordinate scheme rather than state machines.

### A broadly useful protocol 
* As a result of the experiment, we ended up with a Finite State Machine protocol that can be used to simulate, oh, I don't know...

  - [Nearly any describable process](https://scholar.google.com/scholar?q=process+simulation+with+finite+state+machines&hl=en&as_sdt=0&as_vis=1&oi=scholart)
  - [Chatbots or non-player characters in games](https://www.hamidadelyar.com/blog/finite-state-machine-chatbot/)
  - [Software architecture](328717831_Modeling_Software_with_Finite_State_Machines_A_Practical_Approach)
  - [The behavior of living creatures](https://mind-simulation.com/en/blog/tech/using-finite-state-machines-to-model-behavior.html)
  - [Adventure game worlds with blockchain-native assets](https://www.mecs-press.org/ijieeb/ijieeb-v13-n4/IJIEEB-V13-N4-5.pdf)

* ... just to name a few. What will you build?

### Self-cloning for affordable building
* The Fismo contract is prohibitively expensive to deploy if you just want to create interesting machines for people to interact with. 
  * At the time of this writing, it 
approaches **$2000 USD to deploy** Fismo to Ethereum mainnet.
* By adding support for [ERC-1167 Minimal Proxy](https://eips.ethereum.org/EIPS/eip-1167) cloning, Fismo allows anyone to deploy their own fully functional clone. 
  * At the time of this writing, it costs about **$40 USD to clone** Fismo on Ethereum mainnet.
* And finally yes, you *could* try to make a clone of a clone. And it would work... ok.
    * Unfortunately, like Micheal Keaton in [Multiplicity](https://en.wikipedia.org/wiki/Multiplicity_(film)), you would realize a sort of fidelity loss with each successive clone in the chain.
    * Although the logic would operate the same and the clone would store the data, each clone would be delegating the call to the clone it came from, increasing the transaction cost with each delegation.
    * To avoid this hidden expense for the unwary, the `cloneFismo` method reverts if attempting to clone a clone.
    
[![Created by Futurescale](images/created-by.png)](https://futurescale.com)