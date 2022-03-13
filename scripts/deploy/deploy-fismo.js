const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy Fismo
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployFismo(gasLimit) {

    // Deploy Contract
    const Fismo = await ethers.getContractFactory("Fismo");
    const fismo = await Fismo.deploy({gasLimit});
    await fismo.deployed();

    // Return Fismo
    return [fismo];

}

exports.deployFismo = deployFismo;