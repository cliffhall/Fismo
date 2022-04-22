---
layout: default
parent: Developers
title: Environment Setup
nav_order: 1
---
# Environment Setup
The stack is a simple one:
* Solidity
* JavaScript
* Node/NPM
* HardHat
* Waffle
* Ethers

### Install Node (also installs NPM)
* Use the latest [LTS (long term support) version](https://nodejs.org/en/download/).

### Install required Node modules
All NPM resources are project local. No global installs required.

```
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