const hre = require("hardhat");
const ethers = hre.ethers;
const {deployStandaloneFismo} = require("./deploy-standalone-fismo");
const {deployTransitionGuards} = require("./deploy-transition-guards");

/**
 * Deploy Fismo and all guard implementations
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param owner - the owner address
 * @param actionInitiator - the actionInitiator address
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployGuardedFismo(owner, actionInitiator, gasLimit) {

    // Deploy Fismo
    [fismo, fismoArgs] = await deployStandaloneFismo(owner, actionInitiator, gasLimit);

    // Deploy transition guards
    const guards = await deployTransitionGuards(gasLimit);

    // Return Fismo, its constructor args, and the guards
    return [fismo, fismoArgs, guards];

}

if (require.main === module) {
    deployGuardedFismo()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}

exports.deployGuardedFismo = deployGuardedFismo