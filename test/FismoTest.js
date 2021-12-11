const hre = require("hardhat");
const ethers = hre.ethers;
const environments = require('../environments');
const gasLimit = environments.gasLimit;
const { expect } = require("chai");
const { deployFismo } = require('../scripts/deploy/deploy-fismo');
const { deployExample } = require('../scripts/deploy/deploy-example');
const { deployTransitionGuards } = require('../scripts/deploy/deploy-guards');
const { StopWatch } = require("../scripts/constants/example-machines");
const { InterfaceIds } = require('../scripts/constants/supported-interfaces');
const { nameToId } =  require('../scripts/util/name-utils');
const Machine = require("../scripts/domain/Machine");

/**
 *  Test Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Fismo", function() {

    // Common vars
    let accounts, deployer;
    let fismo, example, machine, stateName, stateId;

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

        context("addMachine", async function () {

            it("Should accept a valid unguarded Machine", async function () {

                // Create and validate a simple, unguarded, single state machine
                stateName = "Be";
                initialStateId = nameToId(stateName);
                example = {

                    "name": "Meditate",
                    "operator": deployer.address,
                    "initialStateId": initialStateId,
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
                machine = Machine.fromObject(example);
                expect(machine.isValid()).is.true;


                // Add the machine, checking for the event
                await expect(fismo.addMachine(machine.toObject()))
                    .to.emit(fismo, 'MachineAdded')
                    .withArgs(machine.id, machine.name);
            });

            it("Should accept a valid guarded Machine", async function () {

                // Get simple, guarded example
                example = StopWatch;
                machine = Machine.fromObject(example.machine);
                machine.operator = deployer.address;

                // Deploy its transition guards
                const guards = await deployTransitionGuards(example);

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

        });


    });

});