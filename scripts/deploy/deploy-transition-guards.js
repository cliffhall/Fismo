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

    // Guard contracts to deploy for mock NightClub machine

    const GuardName1 = "CabGuards";
    const CabGuards = await ethers.getContractFactory(GuardName1);
    const cabGuards = await CabGuards.deploy({gasLimit});
    await cabGuards.deployed();
    const CabStateGuards = { name: GuardName1, contract: cabGuards };

    const GuardName2 = "StreetGuards";
    const StreetGuards = await ethers.getContractFactory(GuardName2);
    const streetGuards = await StreetGuards.deploy({gasLimit});
    await streetGuards.deployed();
    const StreetStateGuards = { name: GuardName2, contract: streetGuards };

    const GuardName3 = "VIPLoungeGuards";
    const VIPLoungeGuards = await ethers.getContractFactory(GuardName3);
    const vipLoungeGuards = await VIPLoungeGuards.deploy({gasLimit});
    await vipLoungeGuards.deployed();
    const VIPLoungeStateGuards = { name: GuardName3, contract: vipLoungeGuards };


    // Return array of guard objects with name and contract members
    const guards = [CabStateGuards, StreetStateGuards, VIPLoungeStateGuards];
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