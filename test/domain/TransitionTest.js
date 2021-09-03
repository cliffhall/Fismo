const { expect } = require("chai");
const Transition = require("../../scripts/domain/Transition");
const nameToId = require("../util/name-hasher");

/**
 *  Test the Transition domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Transition", function() {

    // Suite-wide scope
    let accounts, token;
    let actionName, targetStateName, actionId, targetStateId;

    before( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        creator = accounts[0].address;

    });

    context("Constructor", async function () {

        beforeEach( async function () {

            // Required constructor params
            royaltyPercentage = "1500"; // 15%
            isPhysical = true;
            id = "0";
            supply = "25";
            uri = "ipfs://QmXBB6qm5vopwJ6ddxb1mEr1Pp87AHd3BUgVbsipCf9hWU";

        });

        it("Should allow creation of valid, fully populated Transition instance", async function () {

            token = new Transition(creator, royaltyPercentage, isPhysical, id, supply, uri);
            expect(token.creatorIsValid()).is.true;
            expect(token.royaltyPercentageIsValid()).is.true;
            expect(token.isPhysicalIsValid()).is.true;
            expect(token.idIsValid()).is.true;
            expect(token.supplyIsValid()).is.true;
            expect(token.uriIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

    });

    context("Field validations", async function () {

        beforeEach( async function () {

            // Required constructor params
            royaltyPercentage = "1500"; // 15%
            isPhysical = true;
            id = "0";
            supply = "25";
            uri = "ipfs://QmXBB6qm5vopwJ6ddxb1mEr1Pp87AHd3BUgVbsipCf9hWU";

            // Create a valid token, then set fields in tests directly
            token = new Transition(creator, royaltyPercentage, isPhysical, id, supply, uri);
            expect(token.isValid()).is.true;
        });

        it("Always present, creator must be a string representation of an EIP-55 compliant address", async function() {

            // Invalid field value
            token.creator = "0xASFADF";
            expect(token.creatorIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field value
            token.creator = "zedzdeadbaby";
            expect(token.creatorIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Valid field value
            token.creator = accounts[0].address;
            expect(token.creatorIsValid()).is.true;
            expect(token.isValid()).is.true;

            // Valid field value
            token.creator = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(token.creatorIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

        it("Always present, royaltyPercentage must be the string representation of a positive BigNumber", async function() {

            // Invalid field value
            token.royaltyPercentage = 12;
            expect(token.royaltyPercentageIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field value
            token.royaltyPercentage = "zedzdeadbaby";
            expect(token.royaltyPercentageIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field values
            token.royaltyPercentage = "0"; // 0%
            expect(token.royaltyPercentageIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field values
            token.royaltyPercentage = "10001"; // 100.01%
            expect(token.royaltyPercentageIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Valid field value
            token.royaltyPercentage = "126";
            expect(token.royaltyPercentageIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

        it("Always present, isPhysical must be a boolean", async function() {

            // Invalid field value
            token.isPhysical = "0xASFADF";
            expect(token.isPhysicalIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field value
            token.isPhysical = "zedzdeadbaby";
            expect(token.isPhysicalIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field value
            token.isPhysical = accounts[0].address;
            expect(token.isPhysicalIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Valid field value
            token.isPhysical = true;
            expect(token.isPhysicalIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

        it("Always present, id must be the string representation of a BigNumber", async function() {

            // Invalid field value
            token.id = 12;
            expect(token.idIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field value
            token.id = "zedzdeadbaby";
            expect(token.idIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Valid field value
            token.id = "0";
            expect(token.idIsValid()).is.true;
            expect(token.isValid()).is.true;

            // Valid field value
            token.id = "126";
            expect(token.idIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

        it("Always present, supply must be the string representation of a positive BigNumber", async function() {

            // Invalid field value
            token.supply = 12;
            expect(token.supplyIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field value
            token.supply = "zedzdeadbaby";
            expect(token.supplyIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Invalid field values
            token.supply = "0";
            expect(token.supplyIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Valid field value
            token.supply = "126";
            expect(token.supplyIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

        it("Always present, uri must be a non-empty string", async function() {

            // Invalid field value
            token.uri = 12;
            expect(token.uriIsValid()).is.false;
            expect(token.isValid()).is.false;

            // Valid field value
            token.uri = "zedzdeadbaby";
            expect(token.uriIsValid()).is.true;
            expect(token.isValid()).is.true;

            // Valid field value
            token.uri = "https://ipfs.io/ipfs/QmXBB6qm5vopwJ6ddxb1mEr1Pp87AHd3BUgVbsipCf9hWU";
            expect(token.uriIsValid()).is.true;
            expect(token.isValid()).is.true;

        });

    })

    context("Utility functions", async function () {

        beforeEach( async function () {

            // Required constructor params
            royaltyPercentage = "1500"; // 15%
            isPhysical = true;
            id = "0";
            supply = "25";
            uri = "ipfs://QmXBB6qm5vopwJ6ddxb1mEr1Pp87AHd3BUgVbsipCf9hWU";

            // Create a valid token, then set fields in tests directly
            token = new Transition(creator, royaltyPercentage, isPhysical, id, supply, uri);
            expect(token.isValid()).is.true;

        })

        it("Transition.fromObject() should return a Transition instance with the same values as the given plain object", async function() {

            // Get plain object
            const object = {
                creator, royaltyPercentage, isPhysical, id, supply, uri
            }

            // Promote to instance
            const promoted = Transition.fromObject(object);

            // Is a Transition instance
            expect(promoted instanceof Transition).is.true;

            // Key values all match
            for (const [key, value] of Object.entries(token)) {
                expect(JSON.stringify(promoted[key]) === JSON.stringify(value)).is.true;
            }

        });

        it("instance.toString() should return a JSON string representation of the Transition instance", async function() {

            const dehydrated = token.toString();
            const rehydrated = JSON.parse(dehydrated);

            for (const [key, value] of Object.entries(token)) {
                expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
            }

        });

        it("instance.clone() should return another Transition instance with the same property values", async function() {

            // Get plain object
            const clone = token.clone();

            // Is an Transition instance
            expect(clone instanceof Transition).is.true;

            // Key values all match
            for (const [key, value] of Object.entries(token)) {
                expect(JSON.stringify(clone[key]) === JSON.stringify(value)).is.true;
            }

        });

        it("instance.toObject() should return a plain object representation of the Transition instance", async function() {

            // Get plain object
            const object = token.toObject();

            // Not an Transition instance
            expect(object instanceof Transition).is.false;

            // Key values all match
            for (const [key, value] of Object.entries(token)) {
                expect(JSON.stringify(object[key]) === JSON.stringify(value)).is.true;
            }

        });

    })

});