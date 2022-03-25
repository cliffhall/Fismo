const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy state transition guards
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param example - the example machine descriptor. see {lab-machines.js}
 * @param gasLimit - gasLimit for transactions
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployTransitionGuards(example, gasLimit) {

    // Deployed guard contracts
    let deployedGuards = [], guards = [...example.guards];

    // Deploy all the guards
    while (guards.length) {
        let guard = guards.shift();
        let GuardContractFactory = await ethers.getContractFactory(guard.contractName);
        const guardContract = await GuardContractFactory.deploy({gasLimit});
        await guardContract.deployed();
        guard.contract = guardContract;
        deployedGuards.push(guard);
    }

    // Return array of guard objects with state, contractName, and contract
    return deployedGuards;

}

exports.deployTransitionGuards = deployTransitionGuards;