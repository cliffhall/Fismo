// Environment
const hre = require("hardhat");
const ethers = hre.ethers;
const { expect } = require("chai");
const environments = require('../../environments');
const gasLimit = environments.gasLimit;

// Revert Reasons
const { RevertReasons } = require("../../scripts/domain/util/revert-reasons");

// Scripts and data
const { deployFismo } = require('../../scripts/deploy/deploy-fismo');
const { deployOperator } = require('../../scripts/deploy/deploy-operator');
const { nameToId } =  require('../../scripts/domain');

// Domain entities
const {
    Machine,
    ActionResponse
} = require("../../scripts/domain");

/**
 *  Test Operator
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Operator", function() {

    // Common vars
    let accounts, deployer, user, operator, clone;
    let fismo, machine, machineObj, response;
    let action, stateName, stateId, actionId;
    let actionResponse, actionResponseStruct;
    let implementation, instance, tx, event, IsOperator;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];

        // Deploy Fismo contract
        [fismo] = await deployFismo(gasLimit);

        // A simple, unguarded, single-state machine definition
        // The single state is the initial state, and its transitions are re-entrant
        stateName = "Be";
        stateId = nameToId(stateName);
        machineObj = {
            "name": "Meditate",
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

    describe("🔬 As a standalone contract, called directly", function() {

        beforeEach( async function () {

            // We are testing the real Fismo
            IsOperator = true;

            // Deploy basic Operator contract
            [operator] = await deployOperator(fismo, gasLimit);

            // Set the operator address in the machine definition
            machineObj.operator = operator.address;

        });

        context("📋 Cloning methods", async function () {

            context("👉 init()", async function () {

                context("💔 Revert Reasons", async function () {

                    it("Should revert if not called by cloneOperator on an instance it created", async function () {

                        // Attempt to call
                        await expect(operator.init(user.address))
                            .to.revertedWith(RevertReasons.ALREADY_INITIALIZED);

                    });

                });

            });

            context("👉 cloneOperator()", async function () {

                it("Should create a clone of the Operator contract for any caller", async function () {

                    // Clone Operator as random user
                    response = await expect(operator.connect(user).cloneOperator(fismo.address))
                        .to.emit(operator, 'OperatorCloned');

                });

                it("Should emit a OperatorCloned event with cloner, instance, and fismo addresses", async function () {

                        // Clone Operator as random user
                        tx = await operator.connect(user).cloneOperator(fismo.address);
                        response = await tx.wait();

                        // Extract the cloner and clone addresses from the event
                        event = (response.events?.filter((x) => {return x.event === "OperatorCloned"}))[0];

                        // cloner is caller
                        expect( event.args.clonedBy === user.address).to.be.true;

                        // Clone address is not the original Operator implementation
                        expect(event.args.clone === operator.address).to.be.false;

                        // Fismo address
                        expect(event.args.fismo === fismo.address).to.be.true;

                });

            });

        });

        testOperator();

    })

    describe("🔬 As a logic contract, called via clone proxy", function() {

        beforeEach( async function () {

            // We are testing a Fismo clone
            IsOperator = false;

            // Deploy basic Operator contract
            [implementation] = await deployOperator(fismo, gasLimit);

            // Clone Operator
            tx = await implementation.cloneOperator(fismo.address);
            response = await tx.wait();

            // Extract the address and cloner from the event
            event = (response.events?.filter((x) => {return x.event === "OperatorCloned"}))[0];
            clone = event.args.clone;

            // Cast clone to Operator
            operator = await ethers.getContractAt('Operator', clone);

            // Set the operator address in the machine definition
            machineObj.operator = operator.address;
        });

        context("📋 Cloning methods", async function () {

            context("👉 init()", async function () {

                context("💔 Revert Reasons", async function () {

                    it("Should revert if not called by cloneOperator on an instance it created", async function () {

                        // Attempt to call
                        await expect(operator.init(fismo.address))
                            .to.revertedWith(RevertReasons.ALREADY_INITIALIZED);

                    });

                });

            });

            context("👉 cloneOperator()", async function () {

                context("💔 Revert Reasons", async function () {

                    it("Should revert if contract is a clone", async function () {

                        // Attempt to clone, expect revert
                        response = await expect(operator.connect(user).cloneOperator(fismo.address))
                            .to.revertedWith(RevertReasons.MULTIPLICITY);

                    });

                });

            });

        });

        testOperator();

    })

    // Tests to be run against Operator and Operator clone
    function testOperator() {

        context("📋 Operating methods", async function () {

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
                    await expect(operator.connect(user).invokeAction(machine.id, actionId))
                        .to.emit(fismo, 'UserTransitioned')
                        .withArgs(user.address, machine.id, stateId, actionResponseStruct);

                    // Validate ActionResponse struct
                    actionResponse = new ActionResponse(...actionResponseStruct);
                    expect(actionResponse.isValid()).is.true;

                });


            });

        });

    }

});