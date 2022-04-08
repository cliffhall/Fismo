![Fismo](docs/images/fismo-logo.png)
# Status 🧪 [About](docs/about.md) 🧪 [FAQ](docs/faq.md) 🧪 [Docs](docs/intro.md)
## A Finite State Machine Protocol for EVM Blockchains
### What is this?
Fismo is a way of simulating stateful things, processes, or maps of places on EVM blockchains.

There are standards for tokens that allow us to represent things like currency, ownership, and membership. But why do we have no standard for representing a process or map and an individual's path through it?

Each user's position on their journey through a state machine is recorded, and can be publicly queried by anyone. Progress can be controlled by the tokens a user holds. Likewise, tokens could be transferred to a user when they or take some action or arrive at some waypoint.

* 💥 Cheaply clone Fismo on Ethereum or deploy to any EVM
* 💥 Configure and install a virtually unlimited number of machines
* 💥 Deploy custom logic to be triggered by any state transition
* 💥 Deploy custom logic for controlling access to your machines
* 💥 Use off-chain metadata to describe states in any medium

### Status 
### [![Node.js CI](https://github.com/cliffhall/Fismo/actions/workflows/node.js.yml/badge.svg)](https://github.com/cliffhall/Fismo/actions/workflows/node.js.yml) 🔬 ![89%](https://progress-bar.dev/89/?title=Progress&width=100&color=000000)

Done or in progress are:
- ✅ Science! a working [Deterministic Selector Proxy](docs/about.md#deterministic-selector-proxy) implementation
- ✅ A robust [Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine) protocol
- ✅ Minimal clones for cheap deployments (~$50 vs ~$3000)!!!
- ✅ Initialization and access of machine-specific storage slots
- ✅ Clear and complete interface documentation and inline code comments
- ✅ Separation of concerns into inheritance tree for easy comprehension and maintenance
- ✅ Shared domain model for contract structures, enums, events, & constants
- ✅ Domain model expressed in JS for use in deployment and testing
- ✅ Domain model unit tests
- ✅ Shared Script modules for reuse in both deployment and testing
- ✅ Contract unit tests
- ✅ Working examples
- ✅ Example machine tests (multi-step operation of machine examples)
- ✅ CI build and test with Github Actions
- ✅ Contract interfaces documentation
- ✅ Developer setup and tasks documentation
- ✅ Developer environment configuration template
- ✅ High level architecture documentation
- ✅ Contextually filter actions on guard contracts
- ✅ Enable self-targeting transitions to inspect the action
- ✅ Optimize contract size
- 👉 Complete NPM package
- 👉 Deploy to testnets, mainnet, sidechains
- 👉 Write "How to create, install and operate machines on Fismo" doc
- 👉 Moar examples!

##  [![Created by Futurescale](docs/images/created-by.png)](https://futurescale.com)