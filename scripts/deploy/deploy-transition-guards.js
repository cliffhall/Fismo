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

    // Guard contracts to deploy for example NightClub machine
    let guardNames = [
        "BarGuards",
        "CabGuards",
        "DancefloorGuards",
        "RestroomGuards",
        "StreetGuards",
        "VIPLoungeGuards"
    ];

    // Deployed guard contracts
    let guards = [];

    // Deploy all the guards
    while (guardNames.length) {

        let guardName = guardNames.shift();
        let GuardContractFactory = await ethers.getContractFactory(guardName);
        const guardContract = await GuardContractFactory.deploy({gasLimit});
        await guardContract.deployed();
        guards.push( {name: guardName, contract: guardContract} );

    }

    // Return array of guard objects with name and contract members
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