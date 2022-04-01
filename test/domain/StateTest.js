const { expect } = require("chai");
const { State, Transition, nameToId, Machine} = require("../../scripts/domain");

/**
 *  Test the State domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("State", function() {

    // Suite-wide scope
    let state, object, dehydrated, rehydrated, struct, clone;
    let id, name, guardLogic, transitions, exitGuarded, enterGuarded;

    beforeEach( async function () {

        // Locked state of a door that can be unlocked with a key and locked without a key
        name = "Locked";
        id = nameToId(name);
        exitGuarded = true;
        enterGuarded = false;
        transitions = [
            new Transition("Unlock", "Unlocked"),
            new Transition("Batter", "Broken")
        ];
        guardLogic = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

    });

    context("📋 Constructor", async function () {

        it("Should allow creation of valid, fully populated State instance", async function () {

            state = new State(name, exitGuarded, enterGuarded, transitions, guardLogic);

            expect(state.nameIsValid(), "Invalid name").is.true;
            expect(state.idIsValid(), "Invalid id").is.true;
            expect(state.guardLogicIsValid(), "Invalid guard logic address").is.true;
            expect(state.transitionsIsValid(), "Invalid transitions array").is.true;
            expect(state.exitGuardedIsValid(), "Invalid exit guarded flag").is.true;
            expect(state.enterGuardedIsValid(), "Invalid enter guarded flag").is.true;
            expect(state.isValid()).is.true;

        });

    });

    context("📋 Field validations", async function () {

        beforeEach( async function () {

            state = new State(name, exitGuarded, enterGuarded, transitions, guardLogic);

        });

        it("Always present, id must be a bytes4 kecckak hash of the name", async function() {

            // Invalid field value
            state.id = 12;
            expect(state.idIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.id = "zedzdeadbaby";
            expect(state.idIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field values
            state.id = "0";
            expect(state.idIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.id = nameToId(name);
            expect(state.idIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

        it("Always present, name must start with a letter and contain only characters: a-z, A-Z, 0-9, and ", async function() {

            // Invalid field value
            state.name = 12;
            expect(state.nameIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.name = "zedz-dead-baby";
            expect(state.nameIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.name = "l";
            expect(state.nameIsValid()).is.true;
            expect(state.isValid()).is.false;

            // Valid field values
            state.name = "0";
            expect(state.nameIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.name = "Lair_of_Dragon";
            expect(state.nameIsValid()).is.true;
            expect(state.isValid()).is.false;

        });

        it("Always present, exitGuarded must be a boolean", async function() {

            // Invalid field value
            state.exitGuarded = "0xASFADF";
            expect(state.exitGuardedIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.exitGuarded = "zedzdeadbaby";
            expect(state.exitGuardedIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.exitGuarded = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(state.exitGuardedIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.exitGuarded = true;
            expect(state.exitGuardedIsValid()).is.true;

            // Valid field value
            state.exitGuarded = false;
            expect(state.exitGuardedIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

        it("Always present, enterGuarded must be a boolean", async function() {

            // Invalid field value
            state.enterGuarded = "0xASFADF";
            expect(state.enterGuardedIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.enterGuarded = "zedzdeadbaby";
            expect(state.enterGuardedIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.enterGuarded = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(state.enterGuardedIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.enterGuarded = true;
            expect(state.enterGuardedIsValid()).is.true;
            expect(state.isValid()).is.true;

            // Valid field value
            state.enterGuarded = false;
            expect(state.enterGuardedIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

        it("Always present, transitions must be an array, containing zero or more Transition instances", async function() {

            // Invalid field value
            state.transitions = "0xASFADF";
            expect(state.transitionsIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.transitions = "zedzdeadbaby";
            expect(state.transitionsIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.transitions = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(state.transitionsIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.transitions = transitions;
            expect(state.transitionsIsValid()).is.true;
            expect(state.isValid()).is.true;

            // Valid field value
            state.transitions = transitions;
            expect(state.transitionsIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

        it("If present, guardLogic must be a string representation of an EIP-55 compliant address", async function() {

            // Invalid field value
            state.guardLogic = "0xASFADF";
            expect(state.guardLogicIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Invalid field value
            state.guardLogic = "zedzdeadbaby";
            expect(state.guardLogicIsValid()).is.false;
            expect(state.isValid()).is.false;

            // Valid field value
            state.guardLogic = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(state.guardLogicIsValid()).is.true;
            expect(state.isValid()).is.true;

            // Valid field value
            state.guardLogic = null;
            expect(state.guardLogicIsValid()).is.true;
            expect(state.isValid()).is.true;

            // Valid field value
            state.guardLogic = undefined;
            expect(state.guardLogicIsValid()).is.true;
            expect(state.isValid()).is.true;

        });

    });

    context("📋 Utility functions", async function () {

        context("👉 Static", async function () {

            beforeEach( async function () {

                state = new State(name, exitGuarded, enterGuarded, transitions, guardLogic);
                object = { id, name, transitions, exitGuarded, enterGuarded, guardLogic };
                struct = [ id, name, exitGuarded, enterGuarded, guardLogic, transitions.map(transition => transition.toStruct()) ];

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

            it("State.fromStruct() should return a State instance from a struct representation", async function () {

                // Get struct from instance
                state = State.fromStruct(struct);

                // Ensure it is valid
                expect(state.isValid()).to.be.true;

            });

        });

        context("👉 Instance", async function () {

            beforeEach( async function () {

                state = new State(name, exitGuarded, enterGuarded, transitions, guardLogic);

            });

            it("instance.toString() should return a JSON string representation of the State instance", async function() {

                dehydrated = state.toString();
                rehydrated = JSON.parse(dehydrated);

                for (const [key, value] of Object.entries(state)) {
                    expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.toStruct() should return a struct representation of the State instance", async function () {

                // Get struct from state
                struct = state.toStruct();

                // Marshal back to a state instance
                state = State.fromStruct(struct);

                // Ensure it marshals back to a valid state
                expect(state.isValid()).to.be.true;

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

        });
    });

});