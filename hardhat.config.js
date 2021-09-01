const environments = require('./environments');
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0
    },
    "eth-main": {
      gas: "auto",
      url: environments.network['eth-main'].txNode,
      accounts: {
        mnemonic: environments.network['eth-main'].mnemonic
      }
    },
    "eth-test": {
      gas: "auto",
      url: environments.network['eth-test'].txNode,
      accounts: {
        mnemonic: environments.network['eth-test'].mnemonic
      }
    },
    "poly-main": {
      gas: "auto",
      url: environments.network['poly-main'].txNode,
      accounts: {
        mnemonic: environments.network['poly-main'].mnemonic
      }
    },
    "poly-test": {
      gas: "auto",
      url: environments.network['poly-test'].txNode,
      accounts: {
        mnemonic: environments.network['poly-test'].mnemonic
      }
    }
  },
  etherscan: {
    apiKey: environments.apiKey.etherscan
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
    gasPrice: 82,
    coinmarketcap: environments.apiKey.coinmarketcap,
    showTimeSpent: true,
    showMethodSig: true
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};