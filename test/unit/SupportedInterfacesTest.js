const hre = require("hardhat");
const ethers = hre.ethers;
const { assert } = require("chai");
const { InterfaceIds } = require('../../scripts/config/supported-interfaces.js');

/**
 *  Test the SupportedInterfaces contract
 *
 *  SupportedInterfaces contract and tests are a way to easily query
 *  the current ERC-165 interface id of a contract during development.
 *  
 * When you need to add or update an interface, recalculate its ERC165 interfaceId:
 * 
 *  - Add a method to return the id in SupportedInterfaces.sol
 *  - If interface is new, add to supported-interfaces.js with the a placeholder id.
 *  - Add unit test for in this file, which will fail with the actual interface id.
 *  - Update supported-interfaces.js with the actual id.
 *  - Update the ERC165 comment in the interface file itself with its actual id
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("SupportedInterfaces", function() {

    // Shared args
    let SupportedInterfaces, supportedInterfaces;

    beforeEach( async function () {

        // Deploy the contract
        SupportedInterfaces = await ethers.getContractFactory("SupportedInterfaces");
        supportedInterfaces = await SupportedInterfaces.deploy();
        await supportedInterfaces.deployed();

    });

    context("📋 Supported Interfaces", async function () {

        it("getIFismoClone() should return expected id", async function () {

            const expected = InterfaceIds.IFismoClone;
            const actual = await supportedInterfaces.getIFismoClone();
            assert.equal(actual, expected);

        });

        it("getIFismoOperate() should return expected id", async function () {

            const expected = InterfaceIds.IFismoOperate;
            const actual = await supportedInterfaces.getIFismoOperate();
            assert.equal(actual, expected);

        });

        it("getIFismoUpdate() should return expected id", async function () {

            const expected = InterfaceIds.IFismoUpdate;
            const actual = await supportedInterfaces.getIFismoUpdate();
            assert.equal(actual, expected);

        });

        it("getIFismoView() should return expected id", async function () {

            const expected = InterfaceIds.IFismoView;
            const actual = await supportedInterfaces.getIFismoView();
            assert.equal(actual, expected);

        });

    });

});