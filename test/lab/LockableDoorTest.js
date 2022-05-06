// Environment
const hre = require("hardhat");
const ethers = hre.ethers;
const environments = require('../../environments');
const gasLimit = environments.gasLimit;
const { expect } = require("chai");

// Revert Reasons
const { RevertReasons } = require("../../scripts/domain/util/revert-reasons");

// Scripts and data
const { LockableDoor } = require("../../scripts/lab/lab-examples");
const { deployExample } = require("../../scripts/deploy/deploy-example");
const { deployFismo } = require('../../scripts/deploy/deploy-fismo');
const { nameToId } =  require('../../scripts/domain');

// Domain entities
const { ActionResponse } = require("../../scripts/domain");

/**
 *  Test interacting with the LockableDoor machine
 *
 *  Integrates:
 *  - Fismo
 *  - LockableDoorGuards (initializer and guard)
 *  - Operator (basic operator contract)
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Lockable Door Machine", function() {

    // Common vars
    let accounts, deployer, user, operator, operatorArgs, guards, tokens, keyToken;
    let fismo, example, machine, machineId, action, actionId, stateId;
    let actionResponse, actionResponseStruct, amountToMint;
    let priorState, nextState, exitMessage, enterMessage;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];

        // Deploy Fismo
        [fismo] = await deployFismo(gasLimit);

        // Deploy Example
        example = LockableDoor;
        [operator, operatorArgs, guards, machine, tokens] = await deployExample(deployer.address, fismo.address, example,null ,gasLimit);

        // Get the Fismo20 token, which is being used as a key
        keyToken = tokens[0];

    });

    context("📋 Machine-specific Tests", async function () {

        beforeEach( async function () {

            // Get the machine and its initial state
            machineId = machine.id;

            exitMessage = "";
            enterMessage = "";

        });

        context("👉 invokeAction()", async function () {

            it("Should invoke action 'Open' for initial state 'Closed'", async function () {

                // Action to invoke
                action = "Open";
                actionId = nameToId(action);

                // Initial state is "Closed", action is "Open", target state is "Opened"
                priorState = "Closed";
                nextState = "Opened";
                stateId = nameToId(nextState);

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'UserTransitioned')
                    .withArgs(user.address, machine.id, stateId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            it("Should invoke action 'Lock' for initial state 'Closed'", async function () {

                // Action to invoke
                action = "Lock";
                actionId = nameToId(action);

                // Initial state is "Closed", action is "Open", target state is "Locked"
                priorState = "Closed";
                nextState = "Locked";
                stateId = nameToId(nextState);

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'UserTransitioned')
                    .withArgs(user.address, machine.id, stateId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            it("Should invoke action 'Unlock' from state 'Locked' if user has key", async function () {

                // ---------------------------------------------------------------------------------------------
                // LOCK THE DOOR FIRST
                // ---------------------------------------------------------------------------------------------

                // Initial state is "Closed", action is "Lock", target state is "Locked"
                action = "Lock";
                actionId = nameToId(action);
                priorState = "Closed";
                nextState = "Locked";

                // Invoke the action via the Operator
                await operator.connect(user).invokeAction(machine.id, actionId);

                // ---------------------------------------------------------------------------------------------
                // GIVE USER THE KEY
                // ---------------------------------------------------------------------------------------------

                // One key
                amountToMint = "1";

                // Mint the key token and check for the event
                await expect(keyToken.connect(user).mintSample(user.address, amountToMint))
                    .to.emit(keyToken, 'Transfer')
                    .withArgs(ethers.constants.AddressZero, user.address, amountToMint);

                // ---------------------------------------------------------------------------------------------
                // NOW UNLOCK THE DOOR
                // ---------------------------------------------------------------------------------------------

                // Current state is "Locked", action is "Unlock", target state is "Closed"
                action = "Unlock";
                actionId = nameToId(action);
                priorState = nextState;
                nextState = "Closed";
                exitMessage = "Door unlocked.";
                stateId = nameToId(nextState);

                // Expected ActionResponse struct
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'UserTransitioned')
                    .withArgs(user.address, machine.id, stateId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            context("💔 Revert Reasons", async function () {

                it("Should revert if machineId is invalid", async function () {

                    // Invalid machine id
                    machineId = nameToId("not this");

                    // Attempt to invoke the action with an invalid machine Id
                    await expect(operator.connect(user).invokeAction(machineId, actionId))
                        .to.revertedWith(RevertReasons.NO_SUCH_MACHINE);
                });

                it("Should revert if actionId is invalid", async function () {

                    // Invalid action id
                    actionId = nameToId("not this");

                    // Attempt to add the machine, again
                    await expect(operator.connect(user).invokeAction(machine.id, actionId))
                        .to.revertedWith(RevertReasons.NO_SUCH_ACTION);
                });

                it("Should revert with a generic reason if guard reverts without one", async function () {

                    // ---------------------------------------------------------------------------------------------
                    // LOCK THE DOOR FIRST
                    // ---------------------------------------------------------------------------------------------

                    // Initial state is "Closed", action is "Lock", target state is "Locked"
                    action = "Lock";
                    actionId = nameToId(action);
                    priorState = "Closed";
                    nextState = "Locked";

                    // Invoke the action via the Operator
                    await operator.connect(deployer).invokeAction(machine.id, actionId);

                    // ---------------------------------------------------------------------------------------------
                    // GIVE USER THE KEY
                    // ---------------------------------------------------------------------------------------------

                    // One key
                    amountToMint = "1";

                    // Mint the key token and check for the event
                    await expect(keyToken.connect(deployer).mintSample(deployer.address, amountToMint))
                        .to.emit(keyToken, 'Transfer')
                        .withArgs(ethers.constants.AddressZero, deployer.address, amountToMint);

                    // ---------------------------------------------------------------------------------------------
                    // NOW ATTEMPT TO UNLOCK THE DOOR
                    // ---------------------------------------------------------------------------------------------

                    // Current state is "Locked", action is "Unlock", target state is "Closed"
                    action = "Unlock";
                    actionId = nameToId(action);

                    // Attempt to invoke the action via the Operator, checking for the generic revert reason
                    // Note: This guard will revert with no reason if the contract owner attempts to use it.
                    //       Yes, this is contrived, but code coverage, yo.
                    await expect(operator.connect(deployer).invokeAction(machine.id, actionId))
                        .to.revertedWith(RevertReasons.GUARD_REVERTED);

                });

                it("Should revert if user doesn't have key for action 'Unlock'", async function () {

                    // ---------------------------------------------------------------------------------------------
                    // LOCK THE DOOR FIRST
                    // ---------------------------------------------------------------------------------------------

                    // Initial state is "Closed", action is "Lock", target state is "Locked"
                    action = "Lock";
                    actionId = nameToId(action);
                    priorState = "Closed";
                    nextState = "Locked";

                    // Invoke the action via the Operator
                    await operator.connect(user).invokeAction(machine.id, actionId);

                    // ---------------------------------------------------------------------------------------------
                    // DO *NOT* GIVE USER THE KEY
                    // ---------------------------------------------------------------------------------------------

                    // ---------------------------------------------------------------------------------------------
                    // NOW ATTEMPT TO UNLOCK THE DOOR
                    // ---------------------------------------------------------------------------------------------

                    // Current state is "Locked", action is "Unlock", target state is "Closed"
                    action = "Unlock";
                    actionId = nameToId(action);
                    priorState = nextState;
                    nextState = "Closed";
                    exitMessage = "Door unlocked.";
                    stateId = nameToId(nextState);

                    // Invoke the action via the Operator
                    // Action will be suppressed, since user does not have key
                    await expect(operator.connect(user).invokeAction(machine.id, actionId))
                        .to.revertedWith(RevertReasons.NO_SUCH_ACTION);

                });

            });

        });

    });

});