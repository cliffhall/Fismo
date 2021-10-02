const { expect } = require("chai");
const State = require("../../scripts/domain/State");
const { nameToId } = require("../../scripts/util/name-utils");

/**
 *  Test the State domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("State", function() {

    // Suite-wide scope
    let state, object, dehydrated, rehydrated, clone;
    let actionId, targetStateId, actionName, targetStateName;

    before( async function () {

        actionName = "Disappear in a Puff of Smoke";
        targetStateName = "Inside_Puff_of_Smoke";
        actionId = nameToId(actionName);
        targetStateId = nameToId(targetStateName);

    });

    context("Constructor", async function () {

        it("Should allow creation of valid, fully populated State instance", async function () {

            state = new State(actionId, targetStateId, actionName, targetStateName);
            expect(state.actionIdIsValid(), "Invalid actionId").is.true;
            expect(state.targetStateIdIsValid(), "Invalid targetStateId").is.true;
            expect(state.actionNameIsValid(), "Invalid actionName").is.true;
            expect(state.targetStateNameIsValid(), "Invalid targetStateName").is.true;
            expect(state.isValid()).is.true;

        });

    });

    context("Field validations", async function () {

        before( async function () {

            state = new State(actionId, targetStateId, actionName, targetStateName);

        });

        it("Always present, actionId must be a bytes4 kecckak hash of the actionName", async function() {

            // Invalid field value
            state.actionId = 12;
            expect(state.actionIdIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.actionId = "zedzdeadbaby";
            expect(state.actionIdIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field values
            state.actionId = "0";
            expect(state.actionIdIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.actionId = nameToId(actionName);
            expect(state.actionIdIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

        it("Always present, targetStateId must be a bytes4 kecckak hash of the targetStateName", async function() {

            // Invalid field value
            state.targetStateId = 12;
            expect(state.targetStateIdIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.targetStateId = "zedzdeadbaby";
            expect(state.targetStateIdIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field values
            state.targetStateId = "0";
            expect(state.targetStateIdIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.targetStateId = nameToId(targetStateName);
            expect(state.targetStateIdIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

        it("Always present, actionName must contain only characters: a-z, A-Z, 0-9, _, and space", async function() {

            // Invalid field value
            state.actionName = 12;
            expect(state.actionNameIsValid()).is.false;

            // Invalid field value
            state.actionName = "zedz-dead-baby";
            expect(state.actionNameIsValid()).is.false;

            // Valid field value
            state.actionName = "l";
            expect(state.actionNameIsValid()).is.true;

            // Valid field values
            state.actionName = "0";
            expect(state.actionNameIsValid()).is.true;

            // Valid field value
            state.actionName = "Disappear in a Puff of Smoke";
            expect(state.actionNameIsValid()).is.true;

        });

        it("Always present, targetStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _", async function() {

            // Invalid field value
            state.targetStateName = 12;
            expect(state.targetStateNameIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field values
            state.targetStateName = "0";
            expect(state.targetStateNameIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.targetStateName = "zedz-dead-baby";
            expect(state.targetStateNameIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.targetStateName = "l";
            expect(state.targetStateNameIsValid()).is.true;

            // Valid field value
            state.targetStateNameIsValid = "Inside_Puff_of_Smoke";
            expect(state.actionNameIsValid()).is.true;

        });

    });

    context("Utility functions", async function () {

        context("Static", async function () {

            before( async function () {

                state = new State(actionId, targetStateId, actionName, targetStateName);
                object = { actionId, targetStateId, actionName, targetStateName };

            });

            it("State.fromObject() should return a State instance with the same values as the given plain object", async function () {

                // Promote to instance
                const promoted = State.fromObject(object);

                // Is a State instance
                expect(promoted instanceof State).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(state)) {
                    expect(JSON.stringify(promoted[key]) === JSON.stringify(value)).is.true;
                }

            });

        });

        context("Instance", async function () {

            before( async function () {

                state = new State(actionId, targetStateId, actionName, targetStateName);

            });

            it("instance.toString() should return a JSON string representation of the State instance", async function() {

                dehydrated = state.toString();
                rehydrated = JSON.parse(dehydrated);

                for (const [key, value] of Object.entries(state)) {
                    expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.clone() should return another State instance with the same property values", async function() {

                // Get plain object
                clone = state.clone();

                // Is an State instance
                expect(clone instanceof State).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(state)) {
                    expect(JSON.stringify(clone[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.toObject() should return a plain object representation of the State instance", async function() {

                // Get plain object
                object = state.toObject();

                // Not an State instance
                expect(object instanceof State).is.false;

                // Key values all match
                for (const [key, value] of Object.entries(state)) {
                    expect(JSON.stringify(object[key]) === JSON.stringify(value)).is.true;
                }

            });

        });
    });

});