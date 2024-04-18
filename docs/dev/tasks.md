---
layout: default
parent: Developers
title: Development Tasks
nav_order: 3
---
# Development Tasks
_Only necessary if directly working on, testing, or auditing the Fismo protocol. If you just want to build cool stuff, you probably want to visit the [Fismology Lab](https://lab.fismo.xyz)._

## NPM Scripts
Everything required to build, test, analyse, and deploy is available as an NPM script.
* Scripts are defined in [`package.json`](https://github.com/cliffhall/Fismo/blob/main/package.json#L31).
* Most late-model IDEs such as Webstorm have an NPM tab to let you view and launch these
tasks with a double-click.
* If you don't have an NPM launch window, you can run them from the command line.

### Build the contracts
This creates the build artifacts for deployment or testing.

* ```npm run build:contracts```

### Build the SDK
This creates the JavaScript SDK.

* ```npm run build:sdk```

### Test the contracts
This builds the contracts and runs the unit tests.

* ```npm run test```

### Lint the contracts
This runs the solhint linter against the contracts.

* ```npm run lint```

### Size the contracts
This runs the hardhat contract sizer against the contracts to display compiled sizes.

* ```npm run size```

### Calculate code coverage
This runs the unit tests with a code coverage report.

* ```npm run coverage```

### Preview the NPM package
This runs the `npm publish` command in dry-run mode, reporting what will be in the package.

* ```npm run npm:publish:dry-run```

### Publish NPM package
This runs the `npm publish` command in dry-run mode, reporting what will be in the package.

* ```npm run npm:publish```

### Deploy to local Hardhat network
This runs the `scripts/deploy/deploy-and-verify-pair.js` script the against local hardhat network.
Mainly used to test the deployment script.

* ```npm run deploy:local```

### Deploy to Polygon Amoy Testnet
This runs the `scripts/deploy/deploy-and-verify-pair.js` script against Polygon testnet. It deploys Fismo and a paired Operator.

* ```npm run deploy:poly:test```

### Deploy to Polygon Mainnet
This runs the `scripts/deploy/deploy-and-verify-pair.js` script against Polygon mainnet. It deploys Fismo and a paired Operator.

* ```npm run deploy:poly:main```

### Deploy to Ethereum Rinkeby Testnet
This runs the `scripts/deploy/deploy-and-verify-pair.js` script against Rinkeby testnet. It deploys Fismo and a paired Operator.

* ```npm run deploy:eth:test```

### Deploy to Ethereum Ropsten Testnet
This runs the `scripts/deploy/deploy-and-verify-pair.js` script against Ropsten testnet. It deploys Fismo and a paired Operator.

* ```npm run deploy:eth:test-2```

### Deploy to Ethereum Mainnet
This runs the `scripts/deploy/deploy-and-verify-pair.js` script against Ethereum mainnet. It deploys Fismo and a paired Operator.

* ```npm run deploy:eth:main```