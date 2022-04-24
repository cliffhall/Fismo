---
layout: default
parent: Developers
title: Environment Setup
nav_order: 2
---
# Environment Setup
For the Fismo project, the stack is a simple one:
* Solidity
* JavaScript
* Node/NPM
* HardHat
* Waffle
* Ethers

### Download or clone the Fismo repository
* [Download a zip file](https://github.com/cliffhall/Fismo/archive/refs/heads/main.zip) of the head of branch `main`.
* Or clone the repo using `git`:

```shell
git clone https://github.com/cliffhall/Fismo.git
```

### Install Node (also installs NPM)
* Use the latest [LTS (long term support) version](https://nodejs.org/en/download/).

### Install required Node modules
* All NPM modules are project local. No global installs required.

```shell
cd path/to/fismo
npm install
```

### Configure Environment
- Copy [environments_template.js](../../environments_template.js) to `environments.js` and edit to suit.
- API keys are only needed for deploying to public networks.
- `environments.js` is included in `.gitignore` and will not be committed to the repo.
- For your target Ethereum network environment, set:
    * `txNode`: the endpoint for sending ethereum transactions
    * `mnemonic`: a valid ethereum HD wallet seed phrase
- For verifying code and running the gas reporter, set:
    * `etherscan.apiKey`: your etherscan API key
    * `coinmarketcap.apiKey`: your coinmarketcap API key