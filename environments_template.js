module.exports = {

    "apiKey": {
        "block_explorer": {
            "poly-test": "YOUR_POLYGONSCAN_API_KEY",
            "eth-main": "YOUR_ETHERSCAN_API_KEY"
        },
        "coinmarketcap": "YOUR_COINMARKETCAP_API_KEY"
    },
    "network": {

        "hardhat": {  // hardhat local network
            "gasLimit": "5000000"
        },

        "eth-test": {  // Ethereum Rinkeby testnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rinkeby.infura.io/v3/[API_KEY_HERE]",
            "explorer": "https://rinkeby.etherscan.io/",
            "gasLimit": "5000000",
            "chain": {
                "title": "Rinkeby Testnet",
                "name": "rinkeby",
                "chainId": 4
            }
        },

        "eth-main": {  // Ethereum Homestead mainnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://mainnet.infura.io/v3/[API_KEY_HERE]",
            "explorer": "https://etherscan.io/",
            "gasLimit": "5000000",
            "chain": {
                "title": "Ethereum Mainnet",
                "name": "homestead",
                "chainId": 1
            }
        },

        "poly-test": {   // Polygon Amoy testnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rpc-amoy.polygon.technology/[API_KEY_HERE]",
            "explorer": "https://amoy.polygonscan.com/",
            "gasLimit": "10000000",
            "chain": {
                "title": "Polygon Amoy Testnet",
                "name": "amoy",
                "chainId": 80002
            }
        },

        "poly-main": {   // Polygon Matic mainnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rpc-mainnet.maticvigil.com/v1/[API_KEY_HERE]",
            "explorer": "https://polygonscan.com/",
            "gasLimit": "10000000",
            "chain": {
                "title": "Polygon Matic Mainnet",
                "name": "matic",
                "chainId": 137
            }
        }
    },

};