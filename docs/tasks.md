![Fismo](images/fismo-logo.png)
# [Status](../README.md) 🧪 [About](about.md) 🧪 Docs 🧪 [FAQ](faq.md)

## [Intro](intro.md) 💥 [Setup](setup.md) 💥 Tasks 💥 [API](api/README.md)

## Development Tasks
Everything required to build, test, analyse, and deploy is available as an NPM script.
* Scripts are defined in [`package.json`](../package.json).
* Most late-model IDEs such as Webstorm have an NPM tab to let you view and launch these
tasks with a double-click.
* If you don't have an NPM launch window, you can run them from the command line.

### Build the contracts
This creates the build artifacts for deployment or testing.

* ```npm run build```

### Test the contracts
This builds the contracts and runs the unit tests.

* ```npm run test```

### Lint the contracts
This runs the solhint linter against the contracts.

* ```npm run lint```

### Size the contracts
This runs the hardhat contract sizer against the contracts to display compiled sizes.

* ```npm run size```

### Deploy to local Hardhat network
This runs the `scripts/deploy/deploy-and-verify.js` script the against local hardhat network.
Mainly used to test the deployment script.

* ```npm run deploy:local```

### Deploy to Polygon Mumbai Testnet
This runs the `scripts/deploy/deploy-and-verify.js` script against Polygon testnet.

* ```npm run deploy:poly:test```

### Deploy to Polygon Mainnet
This runs the `scripts/deploy/deploy-and-verify.js` script against Polygon mainnet.

* ```npm run deploy:poly:main```

### Deploy to Ethereum Rinkeby Testnet
This runs the `scripts/deploy/deploy-and-verify.js` script against Ethereum mainnet.

* ```npm run deploy:eth:test```

### Deploy to Ethereum Mainnet
This runs the `scripts/deploy/deploy-and-verify.js` script against Ethereum mainnet.

* ```npm run deploy:eth:main```


[![Created by Futurescale](images/created-by.png)](https://futurescale.com)