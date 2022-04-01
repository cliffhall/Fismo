const { expect } = require("chai");
const { Transition, nameToId, State} = require("../../scripts/domain");

/**
 *  Test the Transition domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Transition", function() {

    // Suite-wide scope
    let transition, object, dehydrated, rehydrated, struct, clone;
    let actionId, targetStateId, action, targetStateName;

    beforeEach( async function () {

        action = "Disappear in a Puff of Smoke";  // Action names can have spaces as they're never part of a method name
        targetStateName = "Inside_Puff_of_Smoke"; // State names cannot have spaces
        actionId = nameToId(action);
        targetStateId = nameToId(targetStateName);

    });

    context("📋 Constructor", async function () {

        it("Should allow creation of valid, fully populated Transition instance", async function () {

            transition = new Transition(action, targetStateName);
            expect(transition.actionIdIsValid(), "Invalid actionId").is.true;
            expect(transition.targetStateIdIsValid(), "Invalid targetStateId").is.true;
            expect(transition.actionIsValid(), "Invalid action").is.true;
            expect(transition.targetStateNameIsValid(), "Invalid targetStateName").is.true;
            expect(transition.isValid()).is.true;

        });

    });

    context("📋 Field validations", async function () {

        beforeEach( async function () {

            transition = new Transition(action, targetStateName);

        });

        it("Always present, actionId must be a bytes4 kecckak hash of the action", async function() {

            // Invalid field value
            transition.actionId = 12;
            expect(transition.actionIdIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Invalid field value
            transition.actionId = "zedzdeadbaby";
            expect(transition.actionIdIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Invalid field values
            transition.actionId = "0";
            expect(transition.actionIdIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Valid field value
            transition.actionId = nameToId(action);
            expect(transition.actionIdIsValid()).is.true;
            expect(transition.isValid()).is.true;

        });

        it("Always present, action must contain only characters: a-z, A-Z, 0-9, _, and space", async function() {

            // Invalid field value
            transition.action = 12;
            expect(transition.actionIsValid()).is.false;

            // Invalid field value
            transition.action = "zedz-dead-baby";
            expect(transition.actionIsValid()).is.false;

            // Valid field value
            transition.action = "l";
            expect(transition.actionIsValid()).is.true;

            // Valid field values
            transition.action = "0";
            expect(transition.actionIsValid()).is.true;

            // Valid field value
            transition.action = "Disappear in a Puff of Smoke";
            expect(transition.actionIsValid()).is.true;

        });

        it("Always present, targetStateId must be a bytes4 kecckak hash of the targetStateName", async function() {

            // Invalid field value
            transition.targetStateId = 12;
            expect(transition.targetStateIdIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Invalid field value
            transition.targetStateId = "zedzdeadbaby";
            expect(transition.targetStateIdIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Invalid field values
            transition.targetStateId = "0";
            expect(transition.targetStateIdIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Valid field value
            transition.targetStateId = nameToId(targetStateName);
            expect(transition.targetStateIdIsValid()).is.true;
            expect(transition.isValid()).is.true;

        });

        it("Always present, targetStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _", async function() {

            // Invalid field value
            transition.targetStateName = 12;
            expect(transition.targetStateNameIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Invalid field values
            transition.targetStateName = "0";
            expect(transition.targetStateNameIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Invalid field value
            transition.targetStateName = "zedz-dead-baby";
            expect(transition.targetStateNameIsValid()).is.false;
            expect(transition.isValid()).is.false;

            // Valid field value
            transition.targetStateName = "l";
            expect(transition.targetStateNameIsValid()).is.true;
            expect(transition.isValid()).is.false;

            // Valid field value
            transition.targetStateNameIsValid = "Inside_Puff_of_Smoke";
            expect(transition.actionIsValid()).is.true;
            expect(transition.isValid()).is.false;

        });

    });

    context("📋 Utility functions", async function () {

        context("📋 Static", async function () {

            beforeEach( async function () {

                transition = new Transition(action, targetStateName);
                object = { action, targetStateName };
                struct = [ actionId, targetStateName, action, targetStateName];

            });

            it("Transition.fromObject() should return a Transition instance with the same values as the given plain object", async function () {

                // Promote to instance
                const promoted = Transition.fromObject(object);

                // Is a Transition instance
                expect(promoted instanceof Transition).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(transition)) {
                    expect(JSON.stringify(promoted[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("Transition.fromStruct() should return a Transition instance from a struct representation", async function () {

                // Get struct from instance
                transition = Transition.fromStruct(struct);

                // Ensure it is valid
                expect(transition.isValid()).to.be.true;

            });

        });

        context("👉 Instance", async function () {

            beforeEach( async function () {

                transition = new Transition(action, targetStateName);

            });

            it("instance.toString() should return a JSON string representation of the Transition instance", async function() {

                dehydrated = transition.toString();
                rehydrated = JSON.parse(dehydrated);

                for (const [key, value] of Object.entries(transition)) {
                    expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.toStruct() should return a struct representation of the Transition instance", async function () {

                // Get struct from transition
                struct = transition.toStruct();

                // Marshal back to a transition instance
                transition = Transition.fromStruct(struct);

                // Ensure it marshals back to a valid transition
                expect(transition.isValid()).to.be.true;

            });

            it("instance.toObject() should return a plain object representation of the Transition instance", async function() {

                // Get plain object
                object = transition.toObject();

                // Not an Transition instance
                expect(object instanceof Transition).is.false;

                // Key values all match
                for (const [key, value] of Object.entries(transition)) {
                    expect(JSON.stringify(object[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.clone() should return another Transition instance with the same property values", async function() {

                // Get plain object
                clone = transition.clone();

                // Is an Transition instance
                expect(clone instanceof Transition).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(transition)) {
                    expect(JSON.stringify(clone[key]) === JSON.stringify(value)).is.true;
                }

            });

        });
    });

});