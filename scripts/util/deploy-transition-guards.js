const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy the transition guards
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param admin - the admin address for the proxy
 * @param gasLimit - gasLimit for transactions
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployTransitionGuards(admin, gasLimit) {

    // Deploy Guards
    const Guard1 = await ethers.getContractFactory("TransitionGuard1");
    const guard1 = await Guard1.deploy({gasLimit});
    await guard1.deployed();

    const Guard2 = await ethers.getContractFactory("TransitionGuard2");
    const guard2 = await Guard2.deploy({gasLimit});
    await guard2.deployed();

    return [guard1, guard2];

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