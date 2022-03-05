const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy Tokens
 *
 * ERC20, ERC721, and ERC1155 example tokens for unit tests
 *
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployTokens(gasLimit) {

    const deployedTokens = [], tokens = ["Fismo20", "Fismo721", "Fismo1155"];

    // Deploy all the tokens
    while (tokens.length) {
        let token = tokens.shift();
        let TokenContractFactory = await ethers.getContractFactory(token);
        const tokenContract = await TokenContractFactory.deploy({gasLimit});
        await tokenContract.deployed();
        deployedTokens.push(tokenContract);
    }

    // Return the deployed token contracts
    return deployedTokens;

}

exports.deployTokens = deployTokens;