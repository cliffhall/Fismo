![Fismo](images/fismo-logo.png)
# Status 🧪 [About](about.md) 🧪 [FAQ](faq.md) 🧪 [Docs](intro.md)
## The Finite State Machine Protocol for EVM Blockchains
Fismo Machines are a way of simulating stateful things, processes, or maps of places.

**Consider this:** There are standards for tokens that allow us to represent things like currency, ownership, and membership. _Why do we have no standard for representing a process or map and an individual's journey through it?_

Fismo enforces rules about transitions between states when users invoke actions. The implementer writes custom Solidity functions that get called when transitions happen. Transitions don't always need such hooks, but when they do, anything can be queried or stored.

Each user's progress through a Fismo Machine is recorded and can be queried publicly by anyone. State transitions can be gated by the tokens a user holds, places the've been, or any other  accessible stored value. Likewise, new values could be stored or tokens transferred to a user when they take some action or arrive at some waypoint.

### But wait, there's more...
* 💥 Cheaply clone Fismo on Ethereum or deploy to any EVM
* 💥 Configure and install a virtually unlimited number of machines
* 💥 Deploy custom logic for controlling access to your machines
* 💥 Deploy custom logic for any state transition
* 💥 Deploy custom logic to contextually filter available actions
* 💥 Use off-chain metadata to richly describe states in any medium

### Status 
### [![Node.js CI](https://github.com/cliffhall/Fismo/actions/workflows/node.js.yml/badge.svg)](https://github.com/cliffhall/Fismo/actions/workflows/node.js.yml) 🔬 ![89%](https://progress-bar.dev/89/?title=Progress&width=100&color=000000)

Done or in progress are:
- ✅ Science! a functional [Deterministic Selector Proxy](docs/about.md#deterministic-selector-proxy) implementation
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
- ✅ Publish [NPM package](https://www.npmjs.com/package/fismo) with contracts and domain for browser + node
- 👉 Deploy to testnets, mainnet, sidechains
- 👉 Write "How to create, install and operate machines on Fismo" doc
- 👉 Moar examples!

##  [![Created by Futurescale](docs/images/created-by.png)](https://futurescale.com)