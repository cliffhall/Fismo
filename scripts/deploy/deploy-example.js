const hre = require("hardhat");
const ethers = hre.ethers;
const Machine = require("../../scripts/domain/Machine");

/**
 * Deploy an example machine
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param owner - the owner address
 * @param fismoAddress - the fismo contract
 * @param example - the example descriptor. see {example-machines.js}
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployExample(owner, fismoAddress, example, gasLimit) {

    // Get the deployed Fismo contract
    const fismo = await ethers.getContractAt("Fismo", fismoAddress);

    // Create and validate the machine
    const machine = Machine.fromObject(example.machine);

    if (machine.isValid()) {

        // Deploy operator
        const operatorArgs = [fismo.address];
        const Operator = await ethers.getContractFactory(example.operator);
        const operator = await Operator.deploy(...operatorArgs, {gasLimit});
        await operator.deployed();

        // Update machine with operator address
        machine.operator = operator.address;

        // Deploy transition guards
        const guards = await deployTransitionGuards(example, gasLimit);

        // Add guard addresses to their associated states
        for (const guard of guards) {
            guard.states.forEach(stateName => {
                let state = machine.getState(stateName);
                state.guardLogic = guard.contract.address
            })
        }

        // Add the machine
        await fismo.addMachine(machine.toObject(), operator.address);

        // Return the operator and the guards
        return [operator, operatorArgs, guards];

    } else {

        throw("Invalid machine definition.");

    }

}

/**
 * Deploy state transition guards
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param example - the example machine descriptor. see {example-machines.js}
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

    // Return array of guard objects with state, contractName, and contract members
    return deployedGuards;

}

if (require.main === module) {
    deployExample()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}

exports.deployExample = deployExample;