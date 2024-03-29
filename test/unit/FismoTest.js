// Environment
const hre = require("hardhat");
const ethers = hre.ethers;
const { expect } = require("chai");
const environments = require('../../environments');
const gasLimit = environments.gasLimit;

// Revert Reasons
const { RevertReasons } = require("../../scripts/domain/util/revert-reasons");

// Scripts and data
const { deployTransitionGuards } = require('../../scripts/deploy/deploy-guards');
const { InterfaceIds } = require('../../scripts/domain/util/supported-interfaces');
const { LockableDoor } = require("../../scripts/lab/lab-examples");
const { deployFismo } = require('../../scripts/deploy/deploy-fismo');
const { deployExample, prepareInitializerArgs } = require("../../scripts/deploy/deploy-example");
const { deployTokens } = require('../../scripts/deploy/deploy-tokens');
const { nameToId } =  require('../../scripts/domain');

// Domain entities
const {
    State,
    Machine,
    Position,
    Transition,
    ActionResponse
} = require("../../scripts/domain");

/**
 *  Test Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Fismo", function() {

    // Common vars
    let accounts, deployer, user, operator, guardLogic, operatorArgs, guards, expected;
    let fismo, machine, machineObj, response, targetStateName, targetStateId, selector;
    let state, transition, action, stateName, stateId, actionId, success, support;
    let actionResponse, actionResponseStruct, position, positionStruct, uri;
    let implementation, instance, tx, event, owner, isFismo, tokens, initArgs;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        operator = accounts[2];   // operator can be an EOA, which helps with unit testing
        guardLogic = accounts[3]; // just need a valid address for the guard logic since we won't invoke it in units

        // A simple, unguarded, single-state machine definition
        // The single state is the initial state, and its transitions are re-entrant
        stateName = "Be";
        stateId = nameToId(stateName);
        uri = "ipfs://QmQgg8yFUArWnE9KWMATEpf4ukPRzgy9Z2QWubL357eReA";
        machineObj = {
            "name": "Meditate",
            "operator": operator.address,
            "initialStateId": stateId,
            "uri": uri,
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

    describe("🔬 As a standalone contract, called directly", function() {

        beforeEach( async function () {

            // We are testing the real Fismo
            isFismo = true;

            // Deploy Fismo contract
            [fismo] = await deployFismo(gasLimit);

        });

        context("📋 IFismoClone methods", async function () {

            context("👉 init()", async function () {

                context("💔 Revert Reasons", async function () {

                    it("Should revert if not called by cloneFismo on an instance it created", async function () {

                        // Attempt to call
                        await expect(fismo.init(user.address))
                            .to.revertedWith(RevertReasons.ALREADY_INITIALIZED);

                    });

                });

            });

            context("👉 cloneFismo()", async function () {

                it("Should create a clone of the Fismo contract for any caller", async function () {

                    // Clone Fismo as random user
                    response = await expect(fismo.connect(user).cloneFismo())
                        .to.emit(fismo, 'FismoCloned');

                });

                it("Should emit a FismoCloned event with owner and instance addresses", async function () {

                        // Clone Fismo as random user
                        tx = await fismo.connect(user).cloneFismo();
                        response = await tx.wait();

                        // Extract the owner and clone addresses from the event
                        event = (response.events?.filter((x) => {return x.event === "FismoCloned"}))[0];
                        owner = event.args.owner;
                        clone = event.args.clone;

                        // Clone address is not the original Fismo implementation
                        expect(clone === fismo.address).to.be.false;

                        // Owner is caller
                        expect(owner === user.address).to.be.true;

                    });

            });

        });

        testFismo();

    })

    describe("🔬 As a logic contract, called via clone proxy", function() {

        beforeEach( async function () {

            // We are testing a Fismo clone
            isFismo = false;

            // Deploy Fismo
            [implementation] = await deployFismo(gasLimit);

            // Clone Fismo
            tx = await implementation.cloneFismo();
            response = await tx.wait();

            // Extract the address and owner from the event
            event = (response.events?.filter((x) => {return x.event === "FismoCloned"}))[0];
            instance = event.args.instance;
            owner = event.args.owner;
            expect(owner === deployer.address).to.be.true;

            // Cast clone to Fismo
            fismo = await ethers.getContractAt('Fismo', instance);

        });

        context("📋 IFismoClone methods", async function () {

            context("👉 init()", async function () {

                context("💔 Revert Reasons", async function () {

                    it("Should revert if not called by cloneFismo on an instance it created", async function () {

                        // Attempt to call
                        await expect(fismo.init(user.address))
                            .to.revertedWith(RevertReasons.ALREADY_INITIALIZED);

                    });

                });

            });

            context("👉 cloneFismo()", async function () {

                context("💔 Revert Reasons", async function () {

                    it("Should revert if contract is a clone", async function () {

                        // Attempt to clone, expect revert
                        response = await expect(fismo.connect(user).cloneFismo())
                            .to.revertedWith(RevertReasons.MULTIPLICITY);

                    });

                });

            });

        });

        testFismo();

    })

    // Tests to be run against Fismo and Fismo clone
    function testFismo() {

        context("📋 IFismoOperate methods", async function () {

            context("👉 invokeAction()", async function () {

                beforeEach( async function () {

                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

                    // Id of action to invoke
                    action = "Inhale";
                    actionId = nameToId(action);

                });

                it("Should accept a valid invocation", async function () {

                    // The expected ActionResponse struct
                    // In this simple machine,the single state is re-entrant for each action
                    actionResponseStruct = [machine.name, action, stateName, stateName, "", ""];
                    stateId = nameToId(stateName);

                    // Invoke the action, checking for the event
                    await expect(fismo.connect(operator).invokeAction(user.address, machine.id, actionId))
                        .to.emit(fismo, 'UserTransitioned')
                        .withArgs(user.address, machine.id, stateId, actionResponseStruct);

                    // Validate ActionResponse struct
                    actionResponse = new ActionResponse(...actionResponseStruct);
                    expect(actionResponse.isValid()).is.true;

                });

                context("💔 Revert Reasons", async function () {

                    /*
                     * Reverts if
                     * - caller is not the machine's operator (can be contract or EOA)
                     * - _machineId does not refer to a valid machine
                     * - _actionId is not valid for the user's current state in the given machine
                     * - any invoked guard logic reverts (tested separately in LockableDoorTest)
                     */

                    it("Should revert if caller is not the machine's operator", async function () {

                        // Attempt to invoke the action from user wallet, checking for revert
                        await expect(fismo.connect(user).invokeAction(user.address, machine.id, actionId))
                            .to.revertedWith(RevertReasons.ONLY_OPERATOR);

                    });

                    it("Should revert if machine doesn't exist", async function () {

                        // Invalid machine id
                        machine.id = nameToId("not this");

                        // Attempt to invoke the action from user wallet, checking for revert
                        await expect(fismo.connect(user).invokeAction(user.address, machine.id, actionId))
                            .to.revertedWith(RevertReasons.NO_SUCH_MACHINE);

                    });

                    it("Should revert if the action is invalid for the user's current state", async function () {

                        // Invalid action id
                        actionId = nameToId("not this");

                        // Invoke the action, checking for the event
                        await expect(fismo.connect(operator).invokeAction(user.address, machine.id, actionId))
                            .to.revertedWith(RevertReasons.NO_SUCH_ACTION);

                    });

                });

            });

        });

        context("📋 IFismoOwner methods", async function () {

            context("👉 owner()", async function () {

                it("Should return the owner of the Fismo instance", async function () {

                    // Current owner is the deployer
                    expected = deployer.address;

                    // Get the owner of the Fismo instance
                    owner = await fismo.owner();

                    // Verify that the appropriate address was returned
                    expect(owner).to.equal(expected);

                });

            });

            context("👉 transferOwnership()", async function () {

                it("Should accept a valid non-zero address", async function () {

                    // Transfer ownership, checking for the event
                    await expect(fismo.transferOwnership(user.address))
                        .to.emit(fismo, 'OwnershipTransferred')
                        .withArgs(deployer.address, user.address);

                });

                context("💔 Revert Reasons", async function () {

                    it("Should revert if new owner address is zero address", async function () {

                        // Attempt to transfer ownership to zero address, check for the revert
                        await expect(fismo.transferOwnership(ethers.constants.AddressZero))
                            .to.revertedWith(RevertReasons.INVALID_ADDRESS);

                    });

                    it("Should revert if caller is not owner", async function () {

                        // Attempt to transfer ownership, check for the revert
                        await expect(fismo.connect(user).transferOwnership(deployer.address))
                            .to.revertedWith(RevertReasons.ONLY_OWNER);
                    });


                });

            });

        });

        context("📋 IFismoSupport methods", async function () {

            context("👉 supportsInterface()", async function () {

                it("should conditionally indicate support for IFismoClone interface", async function () {

                    // Current interfaceId for IFismoOperate
                    support = await fismo.supportsInterface(InterfaceIds.IFismoClone);

                    // Test conditionally (not supported if called on a clone)
                    if (isFismo) {

                        await expect(
                            support,
                            "IFismoClone interface not supported"
                        ).is.true;

                    } else {

                        await expect(
                            support,
                            "IFismoClone interface unexpectedly supported"
                        ).is.false;

                    }

                });

                it("should indicate support for IFismoOperate interface", async function () {

                    // Current interfaceId for IFismoOperate
                    support = await fismo.supportsInterface(InterfaceIds.IFismoOperate);

                    // Test
                    await expect(
                        support,
                        "IFismoOperate interface not supported"
                    ).is.true;

                });

                it("should indicate support for IFismoOwner interface", async function () {

                    // Current interfaceId for IFismoOwner
                    support = await fismo.supportsInterface(InterfaceIds.IFismoOwner);

                    // Test
                    await expect(
                        support,
                        "IFismoOwner interface not supported"
                    ).is.true;

                });

                it("should indicate support for IFismoSupport (ERC-165) interface", async function () {

                    // InterfaceId for IFismoSupport (is same id as ERC-165)
                    support = await fismo.supportsInterface(InterfaceIds.IFismoSupport);

                    // Test
                    await expect(
                        support,
                        "IFismoSupport (ERC-165) interface not supported"
                    ).is.true;

                });

                it("should indicate support for IFismoUpdate interface", async function () {

                    // Current interfaceId for IFismoUpdate
                    support = await fismo.supportsInterface(InterfaceIds.IFismoUpdate);

                    // Test
                    await expect(
                        support,
                        "IFismoUpdate interface not supported"
                    ).is.true;

                });

                it("should indicate support for IFismoView interface", async function () {

                    // Current interfaceId for IFismoView
                    support = await fismo.supportsInterface(InterfaceIds.IFismoView);

                    // Test
                    await expect(
                        support,
                        "IFismoView interface not supported"
                    ).is.true;

                });

                it("should not indicate support for a random interface", async function () {

                    // An invalid
                    support = await fismo.supportsInterface(InterfaceIds.IInvalidRandom);

                    // Test
                    await expect(
                        support,
                        "Random interface oddly supported?"
                    ).is.false;

                });

            });

        });

        context("📋 IFismoUpdate methods", async function () {

            context("👉 installMachine()", async function () {

                it("Should accept a valid unguarded Machine", async function () {

                    // Create and validate a simple, unguarded, single-state machine
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add the machine, checking for the event
                    await expect(fismo.installMachine(machine.toObject()))
                        .to.emit(fismo, 'MachineInstalled')
                        .withArgs(machine.id, machine.name);
                });

                it("Should accept a valid guarded Machine", async function () {

                    // Get simple, guarded machine example
                    machineObj = LockableDoor;
                    machine = Machine.fromObject(machineObj.machine);
                    machine.operator = operator.address;
                    expect(machine.isValid()).is.true;

                    // Deploy its transition guards
                    guards = await deployTransitionGuards(machineObj, gasLimit);

                    // Add guard addresses to their associated states
                    for (const guard of guards) {
                        guard.states.forEach(stateName => {
                            let state = machine.getState(stateName);
                            state.guardLogic = guard.contract.address
                        })
                    }

                    // Add the machine, checking for the event
                    await expect(fismo.installMachine(machine.toObject()))
                        .to.emit(fismo, 'MachineInstalled')
                        .withArgs(machine.id, machine.name);
                });

                context("💔 Revert Reasons", async function () {

                    it("Should revert if operator address is zero address", async function () {

                        // Create and validate a simple, unguarded, single-state machine
                        // Operator cannot be zero address
                        machineObj.operator = ethers.constants.AddressZero;
                        machine = Machine.fromObject(machineObj);
                        expect(machine.isValid()).is.true;

                        // Attempt to add the machine, checking for the revert
                        await expect(fismo.installMachine(machine.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_OPERATOR_ADDR);
                    });

                    it("Should revert if machine id is invalid", async function () {

                        // Create the machine, but then set an invalid machine id
                        machine = Machine.fromObject(machineObj);
                        expect(machine.isValid()).is.true;
                        machine.id = nameToId("not this");
                        expect(machine.isValid()).is.false;

                        // Attempt to add the machine, checking for the revert
                        await expect(fismo.installMachine(machine.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_MACHINE_ID);
                    });

                    it("Should revert if machine already exists", async function () {

                        // Create the machine and add it
                        machine = Machine.fromObject(machineObj);
                        expect(machine.isValid()).is.true;
                        await fismo.installMachine(machine.toObject());

                        // Attempt to add the machine, again
                        await expect(fismo.installMachine(machine.toObject()))
                            .to.revertedWith(RevertReasons.MACHINE_EXISTS);
                    });

                    it("Should revert if a state id in a state is invalid", async function () {

                        // Create the machine, but then set an invalid state id
                        machine = Machine.fromObject(machineObj);
                        expect(machine.isValid()).is.true;
                        machine.states[0].id = nameToId("not this");
                        expect(machine.isValid()).is.false;

                        // Attempt to add the machine, again
                        await expect(fismo.installMachine(machine.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_STATE_ID);
                    });

                    it("Should revert if an action id in a transition is invalid", async function () {

                        // Create the machine, but then set an invalid action id
                        machine = Machine.fromObject(machineObj);
                        expect(machine.isValid()).is.true;
                        machine.states[0].transitions[0].actionId = nameToId("not this");
                        expect(machine.isValid()).is.false;

                        // Attempt to add the machine, again
                        await expect(fismo.installMachine(machine.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_ACTION_ID);
                    });

                    it("Should revert if a target state id in a transition is invalid", async function () {

                        // Create the machine, but then set an invalid action id
                        machine = Machine.fromObject(machineObj);
                        expect(machine.isValid()).is.true;
                        machine.states[0].transitions[0].targetStateId = nameToId("not this");
                        expect(machine.isValid()).is.false;

                        // Attempt to add the machine, again
                        await expect(fismo.installMachine(machine.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_TARGET_ID);
                    });

                });

            });

            context("👉 installAndInitializeMachine()", async function () {

                beforeEach( async function () {
                    // Get simple, guarded machine example
                    machineObj = LockableDoor;
                    machine = Machine.fromObject(machineObj.machine);
                    machine.operator = operator.address;
                    expect(machine.isValid()).is.true;

                    // Deploy its transition guards
                    guards = await deployTransitionGuards(machineObj, gasLimit);

                    // Add guard addresses to their associated states
                    for (const guard of guards) {
                        guard.states.forEach(stateName => {
                            let state = machine.getState(stateName);
                            state.guardLogic = guard.contract.address
                        })
                    }

                    // Deploy the example tokens; example initializer needs to know the Fismo20 address
                    tokens = await deployTokens(gasLimit);

                });

                it("Should install a valid guarded Machine and initialize it", async function () {

                    // Get example-specific initialization args (initializer contract and calldata)
                    initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                    // Add the machine, and initialize
                    // Note: The initializer contract can be any contract, and
                    //       it's any method can be called with any arguments.
                    //       The initializer can be a separate contract,
                    //       added to one of a machine's guard contracts,
                    //       even some other contract that does no initialization
                    //       of the machine's storage at all.

                    await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                        .to.emit(fismo, 'MachineInstalled')
                        .withArgs(machine.id, machine.name);
                });

                context("💔 Revert Reasons", async function () {

                    it("Should revert with initializer's revert reason if it reverts with one", async function () {

                        // Fake a guard contract with the user's EOA
                        guards = [{contract: { address:user.address } }]

                        // Get example-specific initialization args (initializer contract and calldata)
                        initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                        // Add the machine, and attempt to initialize
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.CODELESS_INITIALIZER);
                    });

                    it("Should revert with generic reason if initializer reverts without one", async function () {

                        // Fake a token contract with the zero address
                        tokens = [{ address: ethers.constants.AddressZero }]

                        // Get example-specific initialization args (initializer contract and calldata)
                        initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                        // Add the machine, and attempt to initialize
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.INITIALIZER_REVERTED);
                    });

                    it("Should revert if operator address is zero address", async function () {

                        // Operator cannot be zero address
                        machine.operator = ethers.constants.AddressZero;

                        // Get example-specific initialization args (initializer contract and calldata)
                        initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                        // Attempt to add the machine, checking for the revert
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.INVALID_OPERATOR_ADDR);
                    });

                    it("Should revert if machine id is invalid", async function () {

                        // Set an invalid machine id
                        machine.id = nameToId("not this");

                        // Get example-specific initialization args (initializer contract and calldata)
                        initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                        // Attempt to add the machine, checking for the revert
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.INVALID_MACHINE_ID);
                    });

                    it("Should revert if machine already exists", async function () {

                        // Get example-specific initialization args (initializer contract and calldata)
                        initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                        // Add the machine once
                        await fismo.installAndInitializeMachine(machine.toObject(), ...initArgs);

                        // Attempt to add the machine, again
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.MACHINE_EXISTS);
                    });

                    it("Should revert if a state id in a state is invalid", async function () {

                        // Set an invalid state id
                        machine.states[0].id = nameToId("not this");

                        // Get example-specific initialization args (initializer contract and calldata)
                        initArgs = prepareInitializerArgs(LockableDoor, guards, tokens);

                        // Attempt to add the machine, again
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.INVALID_STATE_ID);
                    });

                    it("Should revert if an action id in a transition is invalid", async function () {

                        // Set an invalid action id
                        machine.states[0].transitions[0].actionId = nameToId("not this");

                        // Attempt to add the machine, again
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.INVALID_ACTION_ID);
                    });

                    it("Should revert if a target state id in a transition is invalid", async function () {

                        // Set an invalid target state id
                        machine.states[0].transitions[0].targetStateId = nameToId("not this");

                        // Attempt to add the machine, again
                        await expect(fismo.installAndInitializeMachine(machine.toObject(), ...initArgs))
                            .to.revertedWith(RevertReasons.INVALID_TARGET_ID);
                    });

                });

            });

            context("👉 addState()", async function () {

                beforeEach( async function () {

                    // Create machine
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

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

                it("Should accept a valid guarded State with guard logic", async function () {

                    // Simple guarded state
                    state = State.fromObject({
                        "name": "Enlightenment",
                        "enterGuarded": false,
                        "exitGuarded": true,
                        "guardLogic": fismo.address, // just needs a deployed contract with code
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

                context("💔 Revert Reasons", async function () {

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
                            .to.revertedWith(RevertReasons.INVALID_STATE_ID);
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
                            .to.revertedWith(RevertReasons.INVALID_ACTION_ID);
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
                            .to.revertedWith(RevertReasons.INVALID_TARGET_ID);
                    });

                    it("Should revert if guard logic address is not a contract", async function () {

                        // Guarded state with an EOA supplied as the guard logic address
                        state = State.fromObject({
                            "name": "Transcendence",
                            "enterGuarded": false,
                            "exitGuarded": true,
                            "guardLogic": user.address,
                            "transitions": [
                                {
                                    action: "Transcend",
                                    targetStateName: "Enlightenment"
                                }
                            ]
                        });
                        expect(state.isValid()).is.true;

                        // Attempt to add the state to the existing machine, checking for the revert
                        await expect(fismo.addState(machine.id, state.toObject()))
                            .to.revertedWith(RevertReasons.CODELESS_GUARD);
                    });

                });

            });

            context("👉 updateState()", async function () {

                beforeEach( async function () {

                    // Create machine
                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

                    // Create updated state with enter and exit guards specified
                    state = State.fromObject({
                        "name": stateName,
                        "enterGuarded": true,
                        "exitGuarded": true,
                        "guardLogic": fismo.address,  // Just has to be a contract. We're not invoking any code.
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

                context("💔 Revert Reasons", async function () {

                    it("Should revert if the state id is invalid", async function () {

                        // Set state id to an invalid value
                        state.id = nameToId("not this");
                        expect(state.isValid()).is.false;

                        // Attempt to add the state to the existing machine, checking for the revert
                        await expect(fismo.updateState(machine.id, state.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_STATE_ID);
                    });

                    it("Should revert if an action id in a transition is invalid", async function () {

                        // Set action id to an invalid value
                        state.transitions[0].actionId = nameToId("not this");
                        expect(state.isValid()).is.false;

                        // Attempt to add the state to the existing machine, checking for the revert
                        await expect(fismo.addState(machine.id, state.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_ACTION_ID);
                    });

                    it("Should revert if a target state id in a transition is invalid", async function () {

                        // Set target state id to an invalid value
                        state.transitions[0].targetStateId = nameToId("not this");
                        expect(state.isValid()).is.false;

                        // Attempt to add the state to the existing machine, checking for the revert
                        await expect(fismo.addState(machine.id, state.toObject()))
                            .to.revertedWith(RevertReasons.INVALID_TARGET_ID);
                    });

                });

            });

            context("👉 addTransition()", async function () {

                beforeEach( async function () {

                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

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

                context("💔 Revert Reasons", async function () {

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
                            .to.revertedWith(RevertReasons.INVALID_ACTION_ID);

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
                            .to.revertedWith(RevertReasons.INVALID_TARGET_ID);

                    });

                });

            });

        });

        context("📋 IFismoView methods", async function () {

            context("👉 getLastPosition()", async function () {

                beforeEach( async function () {

                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

                    // Id of action to invoke
                    action = "Inhale";
                    actionId = nameToId(action);

                });

                it("Should return the last position of a user who has interacted with Fismo", async function () {

                    // Invoke the action
                    await fismo.connect(operator).invokeAction(user.address, machine.id, actionId);

                    // Request the last position of the user
                    [success, positionStruct] = await fismo.getLastPosition(user.address);

                    // Check for success as reported by the contract
                    expect(success).to.be.true;

                    // Validate the returned Position
                    position = Position.fromObject(positionStruct);
                    expect(position.isValid()).to.be.true;

                });

                it("Should return a zeroed position for a user who has not interacted with Fismo", async function () {

                    // Request the last position of the user
                    [success, positionStruct] = await fismo.getLastPosition(user.address);

                    // Check for success as reported by the contract
                    expect(success).to.be.false;

                    // Validate the returned Position (zeroed fields not considered valid)
                    position = Position.fromObject(positionStruct);
                    expect(position.isValid()).to.be.false;

                });

            });

            context("👉 getPositionHistory()", async function () {

                beforeEach( async function () {

                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

                    // Id of action to invoke
                    action = "Inhale";
                    actionId = nameToId(action);

                });

                it("Should return the position history for a user who has interacted with Fismo", async function () {

                    // In this single-state machine, the actions return to the same state and so, are repeatable

                    // Invoke the action several times
                    let totalPositions = 5;
                    for (let i = 0; i < totalPositions; i++) {
                        await fismo.connect(operator).invokeAction(user.address, machine.id, actionId);
                    }

                    // Request the position history of the user
                    [success, response] = await fismo.getPositionHistory(user.address);

                    // Check for success as reported by the contract
                    expect(success).to.be.true;

                    // Response should be an array
                    expect(Array.isArray(response));

                    // There should be an entry for the new position recorded after the each invoked action
                    expect(response.length === totalPositions).to.be.true;

                    // Validate the returned Position array
                    expect(Position.positionHistoryIsValid(response)).to.be.true;

                });

                it("Should return an empty array for a user who has not interacted with Fismo", async function () {

                    // User has never interacted, so expect...
                    let totalPositions = 0;

                    // Request the position history of the user
                    [success, response] = await fismo.getPositionHistory(user.address);

                    // Response should be an array
                    expect(Array.isArray(response));

                    // There should no positions
                    expect(response.length === totalPositions).to.be.true;

                });

            });

            context("👉 getUserState()", async function () {

                beforeEach( async function () {

                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

                    // In this single-state machine, the actions return to the same state and are repeatable
                    // Add another state for these tests, since even with no interaction, the machine's initial state
                    // would be returned.

                    // Id of action to invoke
                    action = "Transcend";
                    actionId = nameToId(action);
                    targetStateName = "Enlightenment";
                    targetStateId = nameToId(targetStateName);

                    // Define a simple end state, no transitions
                    state = State.fromObject({
                        "name": targetStateName,
                        "enterGuarded": false,
                        "exitGuarded": false
                    });

                    // Add the state to the existing machine
                    await fismo.addState(machine.id, state.toObject());

                    // Create a new transition instance
                    transition = Transition.fromObject({
                        action,
                        targetStateName
                    });

                    // Add a transition from the previous state of the machine to the new state
                    await fismo.addTransition(machine.id, stateId, transition.toObject());

                });

                it("Should return the current state of a user who has interacted with a given machine", async function () {

                    // Invoke the action
                    await fismo.connect(operator).invokeAction(user.address, machine.id, actionId);

                    // Request the current state id of the user in the given machine
                    response = await fismo.getUserState(user.address, machine.id);

                    // Flatten the current representation of the machine's single state
                    expected = state.toString();

                    // Get the state from the struct
                    state = State.fromStruct(response);

                    // Validate the returned state
                    expect(state.isValid()).to.be.true;

                    // Compare state to state
                    expect(state.toString() === expected).to.be.true;

                });

                it("Should return a machine's initial state for a user who has not interacted with a it", async function () {

                    // Flatten the current representation of the machine's single state
                    expected = machine.states[0].name;

                    // Request the current state id of the user in the given machine
                    response = await fismo.getUserState(user.address, machine.id);

                    // Get the state from the struct
                    state = State.fromStruct(response);

                    // Validate the returned state
                    expect(state.isValid()).to.be.true;

                    // Compare state name to state name
                    expect(state.name === expected).to.be.true;

                });

            });

            context("👉 getMachineURI()", async function () {

                beforeEach( async function () {

                    machine = Machine.fromObject(machineObj);
                    expect(machine.isValid()).is.true;

                    // Add machine to Fismo
                    await fismo.installMachine(machine.toObject());

                });

                it("Should return the URI for a given machine", async function () {

                    // Request the URI for the given machine
                    response = await fismo.getMachineURI(machine.id);

                    // Compare state to state
                    expect(response === uri).to.be.true;

                });

            });

        });

    }

});