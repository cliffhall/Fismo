const hre = require("hardhat");
const ethers = hre.ethers;
const environments = require('../environments');
const gasLimit = environments.gasLimit;
const { expect } = require("chai");

const { deployTransitionGuards } = require('../scripts/deploy/deploy-guards');
const { InterfaceIds } = require('../scripts/constants/supported-interfaces');
const { StopWatch } = require("../scripts/constants/example-machines");
const { deployFismo } = require('../scripts/deploy/deploy-fismo');
const { nameToId } =  require('../scripts/util/name-utils');
const { ZERO_ADDRESS } = require("../scripts/util/constants");
const Machine = require("../scripts/domain/Machine");
const State = require("../scripts/domain/State");
const Transition = require("../scripts/domain/Transition");
const ActionResponse = require("../scripts/domain/ActionResponse");

/**
 *  Test Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Fismo", function() {

    // Common vars
    let accounts, deployer, user, operator, guardLogic;
    let fismo, machine, machineObj;
    let state, transition, action, stateName, stateId, actionId;
    let actionResponse, actionResponseStruct;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        operator = accounts[2];   // operator can be an EOA, which helps with unit testing
        guardLogic = accounts[3]; // just need a valid address for the guard logic since we won't invoke it in units

        // Deploy Fismo
        [fismo] = await deployFismo(deployer.address, gasLimit);

    });

    context("Supported Interfaces", async function () {

        context("supportsInterface()", async function () {

            it("should indicate support for ERC-165 interface", async function () {

                // See https://eips.ethereum.org/EIPS/eip-165#how-a-contract-will-publish-the-interfaces-it-implements
                support = await fismo.supportsInterface(InterfaceIds.IERC165);

                // Test
                await expect(
                    support,
                    "ERC-165 interface not supported"
                ).is.true;

            });

            it("should indicate support for IFismo interface", async function () {

                // Current interfaceId for IFismo
                support = await fismo.supportsInterface(InterfaceIds.IFismo);

                // Test
                await expect(
                    support,
                    "IFismo interface not supported"
                ).is.true;

            });

        });

    });

    context("IFismo methods", async function () {

        beforeEach( async function () {

            // Create and validate a simple, unguarded, single-state machine
            // N.B. the single state is the initial state, and its transitions are re-entrant
            stateName = "Be";
            stateId = nameToId(stateName);
            machineObj = {
                "name": "Meditate",
                "operator": operator.address,
                "initialStateId": stateId,
                "states": [
                    {
                        "name": stateName,
                        "enterGuarded": false,
                        "exitGuarded": false,
                        "transitions": [
                            {
                                "action": "Inhale",
                                "targetStateName": stateName,
                            },
                            {
                                "action": "Exhale",
                                "targetStateName": stateName,
                            },
                        ]
                    }
                ]
            };

        });

        context("addMachine()", async function () {

            it("Should accept a valid unguarded Machine", async function () {

                // Create and validate a simple, unguarded, single-state machine
                machine = Machine.fromObject(machineObj);
                expect(machine.isValid()).is.true;

                // Add the machine, checking for the event
                await expect(fismo.addMachine(machine.toObject()))
                    .to.emit(fismo, 'MachineAdded')
                    .withArgs(machine.id, machine.name);
            });

            it("Should accept a valid guarded Machine", async function () {

                // Get simple, guarded machine example
                machineObj = StopWatch;
                machine = Machine.fromObject(machineObj.machine);
                machine.operator = operator.address;
                expect(machine.isValid()).is.true;

                // Deploy its transition guards
                const guards = await deployTransitionGuards(machineObj, gasLimit);

                // Add guard addresses to their associated states
                for (const guard of guards) {
                    guard.states.forEach(stateName => {
                        let state = machine.getState(stateName);
                        state.guardLogic = guard.contract.address
                    })
                }

                // Add the machine, checking for the event
                await expect(fismo.addMachine(machine.toObject()))
                    .to.emit(fismo, 'MachineAdded')
                    .withArgs(machine.id, machine.name);
            });

            context("Revert Reasons", async function () {

                it("Should revert if operator address is zero address", async function () {

                    // Create and validate a simple, unguarded, single-state machine
                    // Operator cannot be zero address
                    machineObj.operator = ZERO_ADDRESS;
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Attempt to add the machine, checking for the revert
                    await expect(fismo.addMachine(machine.toObject()))
                        .to.revertedWith("Invalid operator address");
                });

                it("Should revert if machine id is invalid", async function () {

                    // Create the machine, but then set an invalid machine id
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;
                    machine.id = nameToId("not this");
                    expect(machine.isValid()).is.false;

                    // Attempt to add the machine, checking for the revert
                    await expect(fismo.addMachine(machine.toObject()))
                        .to.revertedWith("Invalid machine ID");
                });

                it("Should revert if machine already exists", async function () {

                    // Create the machine and add it
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;
                    await fismo.addMachine(machine.toObject());

                    // Attempt to add the machine, again
                    await expect(fismo.addMachine(machine.toObject()))
                        .to.revertedWith("Machine already exists");
                });

                it("Should revert if a state id in a state is invalid", async function () {

                    // Create the machine, but then set an invalid state id
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;
                    machine.states[0].id = nameToId("not this");
                    expect(machine.isValid()).is.false;

                    // Attempt to add the machine, again
                    await expect(fismo.addMachine(machine.toObject()))
                        .to.revertedWith("State ID is invalid");
                });

                it("Should revert if an action id in a transition is invalid", async function () {

                    // Create the machine, but then set an invalid action id
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;
                    machine.states[0].transitions[0].actionId = nameToId("not this");
                    expect(machine.isValid()).is.false;

                    // Attempt to add the machine, again
                    await expect(fismo.addMachine(machine.toObject()))
                        .to.revertedWith("Action ID is invalid");
                });

                it("Should revert if a target state id in a transition is invalid", async function () {

                    // Create the machine, but then set an invalid action id
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;
                    machine.states[0].transitions[0].targetStateId = nameToId("not this");
                    expect(machine.isValid()).is.false;

                    // Attempt to add the machine, again
                    await expect(fismo.addMachine(machine.toObject()))
                        .to.revertedWith("Target State ID is invalid");
                });

            });

        });

        context("addState()", async function () {

            beforeEach( async function () {

                // Create machine
                machine = Machine.fromObject(machineObj);
                expect(machine.isValid()).is.true;

                // Add machine to Fismo
                await fismo.addMachine(machine.toObject());

                // Define a simple end state, no transitions
                state = State.fromObject({
                    "name": "Enlightenment",
                    "enterGuarded": false,
                    "exitGuarded": false
                });
                expect(state.isValid()).is.true;

            });

            it("Should accept a valid end State (no transitions)", async function () {

                // Add the state to the existing machine, checking for the event
                await expect(fismo.addState(machine.id, state.toObject()))
                    .to.emit(fismo, 'StateAdded')
                    .withArgs(machine.id, state.id, state.name);
            });

            it("Should accept a valid State with transitions", async function () {

                // Simple end state, with transition
                state = State.fromObject({
                    "name": "Enlightenment",
                    "enterGuarded": false,
                    "exitGuarded": false,
                    "transitions": [
                        {
                            action: "Accept",
                            targetStateName: "Nirvana"
                        }
                    ]
                });
                expect(state.isValid()).is.true;

                // Add the state to the existing machine, checking for the event
                await expect(fismo.addState(machine.id, state.toObject()))
                    .to.emit(fismo, 'StateAdded')
                    .withArgs(machine.id, state.id, state.name);
            });

            context("Revert Reasons", async function () {

                it("Should revert if the state id is invalid", async function () {

                    // Simple end state, no transitions
                    state = State.fromObject({
                        "name": "Transcendence",
                        "enterGuarded": false,
                        "exitGuarded": false
                    });
                    expect(state.isValid()).is.true;

                    // Set state id to an invalid value
                    state.id = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Attempt to add the state to the existing machine, checking for the revert
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.revertedWith("State ID is invalid");
                });

                it("Should revert if an action id in a transition is invalid", async function () {

                    // Simple end state, no transitions
                    state = State.fromObject({
                        "name": "Transcendence",
                        "enterGuarded": false,
                        "exitGuarded": false,
                        "transitions": [
                            {
                                action: "Transcend",
                                targetStateName: "Enlightenment"
                            }
                        ]
                    });
                    expect(state.isValid()).is.true;

                    // Set action id to an invalid value
                    state.transitions[0].actionId = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Attempt to add the state to the existing machine, checking for the revert
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.revertedWith("Action ID is invalid");
                });

                it("Should revert if a target state id in a transition is invalid", async function () {

                    // Simple end state, no transitions
                    state = State.fromObject({
                        "name": "Transcendence",
                        "enterGuarded": false,
                        "exitGuarded": false,
                        "transitions": [
                            {
                                action: "Transcend",
                                targetStateName: "Enlightenment"
                            }
                        ]
                    });
                    expect(state.isValid()).is.true;

                    // Set target state id to an invalid value
                    state.transitions[0].targetStateId = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Attempt to add the state to the existing machine, checking for the revert
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.revertedWith("Target State ID is invalid");
                });

            });

        });

        context("updateState()", async function () {

            beforeEach( async function () {

                // Create machine
                machine = Machine.fromObject(machineObj);
                expect(machine.isValid()).is.true;

                // Add machine to Fismo
                await fismo.addMachine(machine.toObject());

                // Create updated state with enter and exit guards specified
                state = State.fromObject({
                    "name": stateName,
                    "enterGuarded": true,
                    "exitGuarded": true,
                    "guardLogic": guardLogic.address,
                    "transitions": [
                        {
                            "action": "Inhale",
                            "targetStateName": stateName,
                        },
                        {
                            "action": "Exhale",
                            "targetStateName": stateName,
                        },
                    ]
                });
                expect(state.isValid()).is.true;

            });

            it("Should accept an updated State", async function () {

                // Update the state on the existing machine, checking for the event
                await expect(fismo.updateState(machine.id, state.toObject()))
                    .to.emit(fismo, 'StateUpdated')
                    .withArgs(machine.id, state.id, state.name);
            });

            context("Revert Reasons", async function () {

                it("Should revert if the state id is invalid", async function () {

                    // Set state id to an invalid value
                    state.id = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Attempt to add the state to the existing machine, checking for the revert
                    await expect(fismo.updateState(machine.id, state.toObject()))
                        .to.revertedWith("State ID is invalid");
                });

                it("Should revert if an action id in a transition is invalid", async function () {

                    // Set action id to an invalid value
                    state.transitions[0].actionId = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Attempt to add the state to the existing machine, checking for the revert
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.revertedWith("Action ID is invalid");
                });

                it("Should revert if a target state id in a transition is invalid", async function () {

                    // Set target state id to an invalid value
                    state.transitions[0].targetStateId = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Attempt to add the state to the existing machine, checking for the revert
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.revertedWith("Target State ID is invalid");
                });

            });

        });

        context("addTransition()", async function () {

            beforeEach( async function () {

                machine = Machine.fromObject(machineObj);
                expect(machine.isValid()).is.true;

                // Add machine to Fismo
                await fismo.addMachine(machine.toObject());

            });

            it("Should accept a valid Transition", async function () {

                // Create a new transition instance
                transition = Transition.fromObject({
                    action: "Transcend",
                    targetStateName: "Enlightenment"
                });
                expect(transition.isValid()).is.true;

                // Add the transition to the only state of the machine
                await expect(fismo.addTransition(machine.id, stateId, transition.toObject()))
                    .to.emit(fismo, 'TransitionAdded')
                    .withArgs(machine.id, stateId, transition.action, transition.targetStateName);
            });

            context("Revert Reasons", async function () {

                it("Should revert if the action id is invalid", async function () {

                    // Create a new transition instance
                    transition = Transition.fromObject({
                        action: "Transcend",
                        targetStateName: "Enlightenment"
                    });
                    expect(transition.isValid()).is.true;

                    // Set an invalid action id
                    transition.actionId = nameToId("not this");

                    // Add the transition to the only state of the machine
                    await expect(fismo.addTransition(machine.id, stateId, transition.toObject()))
                        .to.revertedWith("Action ID is invalid");

                });

                it("Should revert if the target state id is invalid", async function () {

                    // Create a new transition instance
                    transition = Transition.fromObject({
                        action: "Transcend",
                        targetStateName: "Enlightenment"
                    });
                    expect(transition.isValid()).is.true;

                    // Set an invalid target state id
                    transition.targetStateId = nameToId("not this");

                    // Add the transition to the only state of the machine
                    await expect(fismo.addTransition(machine.id, stateId, transition.toObject()))
                        .to.revertedWith("Target State ID is invalid");

                });

            });

        });

        context("invokeAction()", async function () {

            beforeEach( async function () {

                machine = Machine.fromObject(machineObj);
                expect(machine.isValid()).is.true;

                // Add machine to Fismo
                await fismo.addMachine(machine.toObject());

                // Id of action to invoke
                action = "Inhale";
                actionId = nameToId(action);

            });

            it("Should accept a valid invocation", async function () {

                // The expected ActionResponse struct
                // N.B. In this simple machine,the single state is re-entrant for each action
                actionResponseStruct = [machine.name, action, stateName, stateName, "", ""];

                // Invoke the action, checking for the event
                await expect(fismo.connect(operator).invokeAction(user.address, machine.id, actionId))
                    .to.emit(fismo, 'Transitioned')
                    .withArgs(user.address, machine.id, actionId, actionResponseStruct);

                // Validate ActionResponse struct
                actionResponse = new ActionResponse(...actionResponseStruct);
                expect(actionResponse.isValid()).is.true;

            });

            context("Revert Reasons", async function () {

                /*
                 * Reverts if
                 * - caller is not the machine's operator (contract or EOA)
                 * - _machineId does not refer to a valid machine
                 * - _actionId is not valid for the user's current state in the given machine
                 * - any invoked guard logic reverts (tested separately elsewhere)
                 */

                it("Should revert if caller is not the machine's operator", async function () {

                    // Attempt to invoke the action from user wallet, checking for revert
                    await expect(fismo.connect(user).invokeAction(user.address, machine.id, actionId))
                        .to.revertedWith("Only operator may call");

                });

                it("Should revert if machine doesn't exist", async function () {

                    // Invalid machine id
                    machine.id = nameToId("not this");

                    // Attempt to invoke the action from user wallet, checking for revert
                    await expect(fismo.connect(user).invokeAction(user.address, machine.id, actionId))
                        .to.revertedWith("No such machine");

                });

                it("Should revert if the action is invalid for the user's current state", async function () {

                    // Invalid action id
                    actionId = nameToId("not this");

                    // Invoke the action, checking for the event
                    await expect(fismo.connect(operator).invokeAction(user.address, machine.id, actionId))
                        .to.revertedWith("No such action");

                });

            });

        });

    });

});