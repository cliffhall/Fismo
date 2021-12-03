const hre = require("hardhat");
const ethers = hre.ethers;
const environments = require('../environments');
const gasLimit = environments.gasLimit;
const { expect } = require("chai");
const { deployFismo } = require('../scripts/deploy/deploy-fismo.js');
const { deployExample } = require('../scripts/deploy/deploy-example.js');
const { StopWatch, Meditation } = require("../scripts/constants/example-machines");
const { InterfaceIds } = require('../scripts/constants/supported-interfaces.js');
const Machine = require("../scripts/domain/Machine");

/**
 *  Test Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Fismo", function() {

    // Common vars
    let accounts, deployer;
    let fismo, example, machine;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];

        // Deploy Fismo
        [fismo] = await deployFismo(deployer.address, gasLimit);

        // Deploy examples
/*
        const examples = [StopWatch];
        for (const example of examples) {
           await deployExample(deployer.address, fismo.address, example, gasLimit);
        }
*/

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

            it("Should accept a valid Machine instance", async function () {

                // Create and validate the machine
                example = Meditation.machine;
                example.operator = deployer.address;
                machine = Machine.fromObject(example);
                expect (machine.isValid()).is.true;

                // Add the machine, checking for the event
                await expect(fismo.addMachine(machine.toObject()))
                    .to.emit(fismo, 'MachineAdded')
                    .withArgs(machine.id, machine.name);
            });

        });

    });

});