const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy Fismo
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param useMock - if true, deploys MockFismo instead of Fismo
 * @param owner - the owner address
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployFismo(useMock, owner, gasLimit) {

    // Determine which contract to deploy
    const contract = useMock ? "MockFismo" : "Fismo";

    // Deploy Contract
    const fismoArgs = [owner]
    const Fismo = await ethers.getContractFactory(contract);
    const fismo = await Fismo.deploy(...fismoArgs, {gasLimit});
    await fismo.deployed();

    // Return Fismo, its constructor args, and the guards
    return [fismo, fismoArgs];

}

exports.deployFismo = deployFismo;