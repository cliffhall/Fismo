const { expect } = require("chai");
const { Position, nameToId } = require("../../scripts/domain");

/**
 *  Test the Position domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Position", function() {

    // Suite-wide scope
    let position, object, dehydrated, rehydrated, clone;
    let machineName, machineId, stateName, stateId;

    beforeEach( async function () {

        machineName = "Zork";
        machineId = nameToId(machineName);

        stateName = "West_of_House";
        stateId =  nameToId(stateName);

    });

    context("📋 Constructor", async function () {

        it("Should allow creation of valid, fully populated Position instance", async function () {

            position = new Position(machineId, stateId);
            expect(position.machineIdIsValid(), "Invalid machineId").is.true;
            expect(position.stateIdIsValid(), "Invalid stateId").is.true;
            expect(position.isValid()).is.true;

        });

    });

    context("📋 Field validations", async function () {

        beforeEach( async function () {

            position = new Position(machineId, stateId);

        });

        it("Always present, machineId must be a string representation of a non-zero bytes4 value", async function() {

            // Invalid field value
            position.machineId = 12;
            expect(position.machineIdIsValid()).is.false;
            expect(position.isValid()).is.false;

            // Invalid field value
            position.machineId = "zedzdeadbaby";
            expect(position.machineIdIsValid()).is.false;
            expect(position.isValid()).is.false;

            // Invalid field values
            position.machineId = "0x00000000";
            expect(position.machineIdIsValid()).is.false;
            expect(position.isValid()).is.false;

            // Valid field value
            position.machineId = nameToId(machineName);
            expect(position.machineIdIsValid()).is.true;
            expect(position.isValid()).is.true;

        });

        it("Always present, stateId must be a string representation of a non-zero bytes4 value", async function() {

            // Invalid field value
            position.stateId = 12;
            expect(position.stateIdIsValid()).is.false;
            expect(position.isValid()).is.false;

            // Invalid field value
            position.stateId = "zedzdeadbaby";
            expect(position.stateIdIsValid()).is.false;
            expect(position.isValid()).is.false;

            // Invalid field values
            position.stateId = "0x00000000";
            expect(position.stateIdIsValid()).is.false;
            expect(position.isValid()).is.false;

            // Valid field value
            position.stateId = nameToId(machineName);
            expect(position.stateIdIsValid()).is.true;
            expect(position.isValid()).is.true;

        });

    });

    context("📋 Utility functions", async function () {

        context("👉 Static", async function () {

            beforeEach( async function () {

                position = new Position(machineId, stateId);
                object = { machineId, stateId };

            });

            it("Position.fromObject() should return a Position instance with the same values as the given plain object", async function () {

                // Promote to instance
                const promoted = Position.fromObject(object);

                // Is a Position instance
                expect(promoted instanceof Position).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(position)) {
                    expect(JSON.stringify(promoted[key]) === JSON.stringify(value)).is.true;
                }

            });

        });

        context("👉 Instance", async function () {

            beforeEach( async function () {

                position = new Position(machineId, stateId);

            });

            it("instance.toString() should return a JSON string representation of the Position instance", async function() {

                dehydrated = position.toString();
                rehydrated = JSON.parse(dehydrated);

                for (const [key, value] of Object.entries(position)) {
                    expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.clone() should return another Position instance with the same property values", async function() {

                // Get plain object
                clone = position.clone();

                // Is an Position instance
                expect(clone instanceof Position).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(position)) {
                    expect(JSON.stringify(clone[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.toObject() should return a plain object representation of the Position instance", async function() {

                // Get plain object
                object = position.toObject();

                // Not an Position instance
                expect(object instanceof Position).is.false;

                // Key values all match
                for (const [key, value] of Object.entries(position)) {
                    expect(JSON.stringify(object[key]) === JSON.stringify(value)).is.true;
                }

            });

        });
    });

});