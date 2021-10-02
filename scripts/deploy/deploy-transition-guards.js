const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy state transition guards
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param gasLimit - gasLimit for transactions
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployTransitionGuards(gasLimit) {

    // Guard contracts to deploy
    const GuardName1 = "MockEnterGuard";
    const EnterGuard = await ethers.getContractFactory(GuardName1);
    const enterGuard = await EnterGuard.deploy({gasLimit});
    await enterGuard.deployed();
    const guard1 = { name: GuardName1, contract: enterGuard };

    // Deploy an Exit Guard
    const GuardName2 = "MockExitGuard";
    const ExitGuard = await ethers.getContractFactory(GuardName2);
    const exitGuard = await ExitGuard.deploy({gasLimit});
    await exitGuard.deployed();
    const guard2 = { name: GuardName2, contract: exitGuard };

    // Return array of guard objects with name and contract members
    const guards = [guard1, guard2];
    return guards;

}

if (require.main === module) {
    deployTransitionGuards()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}

exports.deployTransitionGuards = deployTransitionGuards