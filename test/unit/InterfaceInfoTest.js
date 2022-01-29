const hre = require("hardhat");
const ethers = hre.ethers;
const { assert } = require("chai");
const { InterfaceIds } = require('../../scripts/constants/supported-interfaces.js');

/**
 *  Test the InterfaceInfo contract
 *
 *  N.B. InterfaceInfo contract and tests are just a way to easily query the current
 *  ERC-165 interface id of a contract during development.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("InterfaceInfo", function() {

    // Shared args
    let InterfaceInfo, interfaceInfo;

    beforeEach( async function () {

        // Deploy the contract
        InterfaceInfo = await ethers.getContractFactory("InterfaceInfo");
        interfaceInfo = await InterfaceInfo.deploy();
        await interfaceInfo.deployed();

    });

    context("Interface Ids", async function () {;

        it("getIFismoOperate() should return expected id", async function () {

            const expected = InterfaceIds.IFismoOperate;
            const actual = await interfaceInfo.getIFismoOperate();
            assert.equal(actual, expected);

        });

        it("getIFismoUpdate() should return expected id", async function () {

            const expected = InterfaceIds.IFismoUpdate;
            const actual = await interfaceInfo.getIFismoUpdate();
            assert.equal(actual, expected);

        });

        it("getIFismoView() should return expected id", async function () {

            const expected = InterfaceIds.IFismoView;
            const actual = await interfaceInfo.getIFismoView();
            assert.equal(actual, expected);

        });

    });

});