const { assert } = require("chai");
const { InterfaceIds } = require('../../scripts/constants/supported-interfaces.js');

/**
 *  Test the InterfaceInfo contract
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

    context("Interface Ids", async function () {

        it("getIFismo() should return expected id", async function () {

            const expected = InterfaceIds.IFismo;
            const actual = await interfaceInfo.getIFismo();
            assert.equal(actual, expected);

        });

    });

});