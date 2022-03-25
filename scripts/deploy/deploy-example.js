const hre = require("hardhat");
const ethers = hre.ethers;
const { Machine } = require("../domain");
const { deployTokens } = require('./deploy-tokens');
const { deployTransitionGuards } = require('./deploy-guards');

/**
 * Deploy an example machine
 *
 * Reused between deployment script and unit tests for consistency
 *
 * @param owner - the owner address
 * @param fismoAddress - the fismo contract
 * @param example - the example descriptor. see {lab-examples.js}
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

    // Deploy operator, guards, and add machine to Fismo
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

        // If there is an initializer defined, deploy
        let tokens = [];
        if (example.initializer) {

            // Deploy the example tokens; example initializers will need one or more of them
            tokens = await deployTokens(gasLimit);

            // Get example-specific initialization args (initializer contract and calldata)
            const initArgs = prepareInitializerArgs(example, guards, tokens);

            // Install and initialize ethe machine
            await fismo.installAndInitializeMachine(machine.toObject(), ...initArgs);

        } else {

            // Just install the machine
            await fismo.installMachine(machine.toObject());

        }

        // Return the operator, the guards, and the guarded machine entity
        return [operator, operatorArgs, guards, machine.clone(), tokens];

    } else {

        throw("Invalid machine definition.");

    }

}

/**
 * Prepare initializer arguments
 *
 * Only used by deployExample when an example
 * has an initializer.
 *
 * Initializers vary by example, depending upon the
 * arguments they need, so custom code is required to
 * prepare the initializer arguments (address and calldata).
 *
 * By convention, the initialize functions are expected to
 * be on the first of a machine's guard contracts rather
 * than a separate contract, for simplicity in deployment
 * configuration.
 *
 * @param example
 * @param guards
 * @param tokens
 * @returns {*[]}
 */
function prepareInitializerArgs(example, guards, tokens) {

    let initFunction, initInterface, initCallData, initializer;
    let [fismo20, fismo721, fismo1155] = tokens;

    switch (example.machine.name) {

        case "LockableDoor":

            // Get the initializer contract
            initializer = guards[0].contract.address;

            // Prepare the calldata
            initFunction = "initialize(address payable)";
            initInterface = new ethers.utils.Interface([`function ${initFunction}`]);
            initCallData = initInterface.encodeFunctionData("initialize", [fismo20.address]);
            break;

        default:
            break;
    }

    return [initializer, initCallData];

}

exports.deployExample = deployExample;
exports.prepareInitializerArgs = prepareInitializerArgs;