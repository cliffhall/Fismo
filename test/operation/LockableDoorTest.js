// Environment
const hre = require("hardhat");
const ethers = hre.ethers;
const environments = require('../../environments');
const gasLimit = environments.gasLimit;
const { expect } = require("chai");

// Scripts and data
const { LockableDoor } = require("../../scripts/constants/example-machines");
const { deployExample } = require("../../scripts/deploy/deploy-example");
const { deployFismo } = require('../../scripts/deploy/deploy-fismo');
const { nameToId } =  require('../../scripts/util/name-utils');

// Domain entities
const Guard = require("../../scripts/domain/Guard");
const State = require("../../scripts/domain/State");
const Machine = require("../../scripts/domain/Machine");
const Transition = require("../../scripts/domain/Transition");
const ActionResponse = require("../../scripts/domain/ActionResponse");

/**
 *  Test interacting with the LockableDoor machine
 *
 *  Integrates:
 *  - Fismo
 *  - LockableDoorGuards
 *  - LockableDoorOperator
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Lockable Door Machine", function() {

    // Common vars
    let accounts, deployer, user, operator, operatorArgs, guards;
    let fismo, example, machine, machineId, state, action, actionId;
    let actionResponse, actionResponseStruct, response, tx;
    let priorState, nextState, exitMessage, enterMessage;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];

        // Deploy Fismo
        [fismo] = await deployFismo(true, deployer.address, gasLimit);

        // Deploy Example
        example = LockableDoor;
        [operator, operatorArgs, guards, machine] = await deployExample(deployer.address, fismo.address, example, gasLimit);

    });

    context("📋 Operator", async function () {

        beforeEach( async function () {

            // Get the machine and its initial state
            machineId = machine.id;

            exitMessage = "";
            enterMessage = "";

        });

        context("👉 callGuard()", async function () {

            it("Should call guard function and return response", async function () {

                // State to call guard for
                state = "Locked";

                // Call the guard
                response = await fismo.callStatic.callGuard(user.address, machine.name, state, Guard.EXIT);

                // Test the response
                expect(response).equal("Door unlocked.");
            });

        });

        context("👉 invokeAction()", async function () {

            it("Should invoke valid action 'Open' for initial state 'Closed'", async function () {

                // Action to invoke
                action = "Open";
                actionId = nameToId(action);

                // Initial state is "Closed", action is "Open", target state is "Opened"
                priorState = "Closed";
                nextState = "Opened";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            it("Should invoke valid action 'Lock' for initial state 'Closed'", async function () {

                // Action to invoke
                action = "Lock";
                actionId = nameToId(action);

                // Initial state is "Closed", action is "Open", target state is "Locked"
                priorState = "Closed";
                nextState = "Locked";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            it("Should invoke valid action 'Unlock' from state 'Locked'", async function () {

                // Action to invoke
                action = "Lock";
                actionId = nameToId(action);

                // Initial state is "Closed", action is "Open", target state is "Locked"
                priorState = "Closed";
                nextState = "Locked";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Verify the user's state before the transition
                state = machine.getInitialState();
                let currentStateId = await fismo.getUserState(user.address, machine.id);
                expect(currentStateId).to.equal(state.id);

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

                // Verify the user's state after the transition
                currentStateId = await fismo.getUserState(user.address, machine.id);
                expect(currentStateId).to.equal(nameToId(nextState));

                // Action to invoke
                action = "Unlock";
                actionId = nameToId(action);

                // Current state is "Locked", action is "Open", target state is "Closed"
                priorState = nextState;
                nextState = "Closed";
                exitMessage = "Door unlocked.";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, priorState, nextState, exitMessage, enterMessage];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

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
                        .to.revertedWith("No such machine");
                });

                it("Should revert if actionId is invalid", async function () {

                    // Invalid action id
                    actionId = nameToId("not this");

                    // Attempt to add the machine, again
                    await expect(operator.connect(user).invokeAction(machine.id, actionId))
                        .to.revertedWith("No such action");
                });

            });

        });

    });

});