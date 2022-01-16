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
    let actionResponse, actionResponseStruct;
    let prevState, nextState;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];

        // Deploy Fismo
        [fismo] = await deployFismo(deployer.address, gasLimit);

        // Deploy Example
        example = LockableDoor;
        [operator, operatorArgs, guards] = await deployExample(deployer.address, fismo.address, example, gasLimit);

    });

    context("Operator", async function () {

        beforeEach( async function () {

            // Get the machine and its intial state
            machine = Machine.fromObject(example.machine);
            machineId = nameToId(machine.name);
            state = machine.getInitialState();

        });

        context("invokeAction()", async function () {

            it("Should invoke valid action 'Open' for initial state 'Closed'", async function () {

                // Action to invoke
                action = "Open";
                actionId = nameToId(action);

                // Initial state is "Closed", action is "Open", target state is "Opened"
                prevState = "Closed";
                nextState = "Opened";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, prevState, nextState, "", ""];

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
                prevState = "Closed";
                nextState = "Locked";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, prevState, nextState, "", ""];

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
                prevState = "Closed";
                nextState = "Locked";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, prevState, nextState, "", ""];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

                // Action to invoke
                action = "Unlock";
                actionId = nameToId(action);

                // Current state is "Locked", action is "Open", target state is "Closed"
                prevState = "Locked";
                nextState = "Closed";

                // Expected ActionResponse parameter
                actionResponseStruct = [machine.name, action, prevState, nextState, "", ""];

                // Invoke the action via the Operator, checking for the event from Fismo
                await expect(operator.connect(user).invokeAction(machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

                // Validate the ActionResponse
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            context("Revert Reasons", async function () {

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