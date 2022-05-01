const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy Operator
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param fismo - the fismo Contract instance
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployOperator(fismo, gasLimit) {

    // Deploy Contract
    const operatorArgs = [fismo.address];
    const Operator = await ethers.getContractFactory("Operator");
    const operator = await Operator.deploy(...operatorArgs,{gasLimit});
    await operator.deployed();

    // Return Operator
    return [operator, operatorArgs];

}

exports.deployOperator = deployOperator;