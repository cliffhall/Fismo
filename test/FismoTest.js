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

/**
 *  Test Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Fismo", function() {

    // Common vars
    let accounts, deployer;
    let fismo, machine, machineObj;
    let state, stateObj, stateName;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];

        // Deploy Fismo
        [fismo] = await deployFismo(deployer.address, gasLimit);

    });

    context("Interfaces", async function () {

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

            // Define a simple, valid, unguarded, single-state machine
            stateName = "Be";
            machineObj = {
                "operator": deployer.address,
                "name": "Meditate",
                "initialStateId": nameToId(stateName),
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

        context("addMachine", async function () {

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

                // Get simple, guarded machineObj
                machineObj = StopWatch;
                machine = Machine.fromObject(machineObj.machine);
                machine.operator = deployer.address;
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

        context("addState", async function () {

            beforeEach( async function () {

                // Create and validate a simple, unguarded, single state machine
                stateName = "Be";
                machineObj = {
                    "name": "Meditate",
                    "operator": deployer.address,
                    "initialStateId": nameToId(stateName),
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
                machine = Machine.fromObject(machineObj);
                expect(machine.isValid()).is.true;

                // Add machine to Fismo
                await fismo.addMachine(machine.toObject());

                // Define a simple end state, no transitions
                state = State.fromObject({
                    "name": "Transcendence",
                    "enterGuarded": false,
                    "exitGuarded": false
                });
                expect(state.isValid()).is.true;
                
            });

            it("Should accept a valid end State (no transitions)", async function () {

                // Simple end state, no transitions
                state = State.fromObject({
                    "name": "Transcendence",
                    "enterGuarded": false,
                    "exitGuarded": false
                });
                expect(state.isValid()).is.true;

                // Add the state to the existing machine, checking for the event
                await expect(fismo.addState(machine.id, state.toObject()))
                    .to.emit(fismo, 'StateAdded')
                    .withArgs(machine.id, state.id, state.name);
            });

            it("Should accept a valid State with transitions", async function () {

                // Simple end state, with transition
                state = State.fromObject({
                    "name": "Transcendence",
                    "enterGuarded": false,
                    "exitGuarded": false,
                    "transitions": [
                        {
                            action: "Accept",
                            targetStateName: "Enlightenment"
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
                    state.id = nameToId("not this");
                    expect(state.isValid()).is.false;

                    // Add the state to the existing machine, checking for the event
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.revertedWith("State ID is invalid");
                });

                xit("Should revert if an action id in a transition is invalid", async function () {

                    // Simple end state, no transitions
                    state = State.fromObject({
                        "name": "Transcendence",
                        "enterGuarded": false,
                        "exitGuarded": false,
                        "transitions": [
                            {
                                action: "Accept",
                                targetStateName: "Enlightenment"
                            }
                        ]
                    });
                    expect(state.isValid()).is.true;

                    // Add the state to the existing machine, checking for the event
                    await expect(fismo.addState(machine.id, state.toObject()))
                        .to.emit(fismo, 'StateAdded')
                        .withArgs(machine.id, state.id, state.name);
                });

                xit("Should revert if a target state id in a transition is invalid", async function () {

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

    });

});