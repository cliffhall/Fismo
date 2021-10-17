const { expect } = require("chai");
const State = require("../../scripts/domain/State");
const Machine = require("../../scripts/domain/Machine");
const Transition = require("../../scripts/domain/Transition");
const { nameToId } = require("../../scripts/util/name-utils");

/**
 *  Test the Machine domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Machine", function() {

    // Suite-wide scope
    let machine, object, dehydrated, rehydrated, clone;
    let name, states, initialStateId, uri;


    beforeEach( async function () {

        let stateName, guardLogic, transitions, exitGuarded, enterGuarded, uri;

        // Create states of a door that can be unlocked with a key and locked without a key
        states = [];

        // Unlocked state
        stateName = "Unlocked";
        exitGuarded = true;
        enterGuarded = false;
        transitions = [
            new Transition("Lock", "Locked")
        ];
        guardLogic = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
        uri = "The door is unlocked.";
        states.push(new State(stateName, exitGuarded, enterGuarded, transitions, guardLogic, uri));

        // Locked state
        stateName = "Locked";
        exitGuarded = true;
        enterGuarded = false;
        transitions = [
            new Transition("Unlock", "Unlocked")
        ];
        guardLogic = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
        uri = "The door is locked.";
        states.push(new State(stateName, exitGuarded, enterGuarded, transitions, guardLogic, uri));

        // Machine
        name = "Lockable_Door";
        initialStateId = states[0].id;

    });

    context("Constructor", async function () {

        it("Should allow creation of valid, fully populated Machine instance", async function () {

            machine =  new Machine(name, states, initialStateId, uri);

            expect(machine.nameIsValid(), "Invalid name").is.true;
            expect(machine.idIsValid(), "Invalid id").is.true;
            expect(machine.initialStateIdIsValid(), "Invalid initial state id").is.true;
            expect(machine.statesIsValid(), "Invalid states array").is.true;
            expect(machine.uriIsValid(), "Invalid uri").is.true;
            expect(machine.isValid()).is.true;

        });

    });

    context("Field validations", async function () {

        beforeEach( async function () {

            machine =  new Machine(name, states, initialStateId, uri);

        });

        it("Always present, id must be a bytes4 kecckak hash of the name", async function() {

            // Invalid field value
            machine.id = 12;
            expect(machine.idIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field value
            machine.id = "zedzdeadbaby";
            expect(machine.idIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field values
            machine.id = "0";
            expect(machine.idIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Valid field value
            machine.id = nameToId(name);
            expect(machine.idIsValid()).is.true;
            expect(machine.isValid()).is.true;

        });

        it("Always present, initialStateId must be a bytes4 kecckak hash of a State instance in the states array", async function() {

            // Invalid field value
            machine.initialStateId = 12;
            expect(machine.initialStateIdIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field value
            machine.initialStateId = "zedzdeadbaby";
            expect(machine.initialStateIdIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field values
            machine.initialStateId = "0";
            expect(machine.initialStateIdIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Valid field value
            machine.initialStateId = nameToId(states[0].name);
            expect(machine.initialStateIdIsValid()).is.true;
            expect(machine.isValid()).is.true;

        });

        it("Always present, name must contain only characters: a-z, A-Z, 0-9, and _", async function() {

            // Invalid field value
            machine.name = 12;
            expect(machine.nameIsValid()).is.false;

            // Invalid field value
            machine.name = "zedz-dead-baby";
            expect(machine.nameIsValid()).is.false;

            // Valid field value
            machine.name = "l";
            expect(machine.nameIsValid()).is.true;

            // Valid field values
            machine.name = "0";
            expect(machine.nameIsValid()).is.false;

            // Valid field value
            machine.name = "Loot_Cave";
            expect(machine.nameIsValid()).is.true;

        });

        it("Always present, states must be an array, containing zero or more State instances", async function() {

            // Invalid field value
            machine.states = "0xASFADF";
            expect(machine.statesIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field value
            machine.states = "zedzdeadbaby";
            expect(machine.statesIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field value
            machine.states = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(machine.statesIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Valid field value
            machine.states = [];
            expect(machine.statesIsValid()).is.true;
            expect(machine.isValid()).is.false;

            // Valid field value
            machine.states = states;
            expect(machine.statesIsValid()).is.true;
            expect(machine.isValid()).is.true;

        });

        it("If present, uri must be a string", async function() {

            // Invalid field value
            machine.uri = 12;
            expect(machine.uriIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field value
            machine.uri = false;
            expect(machine.uriIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Invalid field value
            machine.uri = new Date();
            expect(machine.uriIsValid()).is.false;
            expect(machine.isValid()).is.false;

            // Valid field value
            machine.uri = "zedzdeadbaby";
            expect(machine.uriIsValid()).is.true;
            expect(machine.isValid()).is.true;

            // Valid field value
            machine.uri = "0x7777788200B672A42421017F65EDE4Fc759564C8";
            expect(machine.uriIsValid()).is.true;
            expect(machine.isValid()).is.true;

            // Valid field value
            machine.uri = null;
            expect(machine.uriIsValid()).is.true;
            expect(machine.isValid()).is.true;

            // Valid field value
            machine.uri = undefined;
            expect(machine.uriIsValid()).is.true;
            expect(machine.isValid()).is.true;

        });

    });

    context("Utility functions", async function () {

        context("Static", async function () {

            beforeEach( async function () {

                machine =  new Machine(name, states, initialStateId, uri);
                object = { name, states, initialStateId, uri };

            });

            it("Machine.fromObject() should return a Machine instance with the same values as the given plain object", async function () {

                // Promote to instance
                const promoted = Machine.fromObject(object);

                // Is a Machine instance
                expect(promoted instanceof Machine).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(machine)) {
                    expect(JSON.stringify(promoted[key]) === JSON.stringify(value)).is.true;
                }

            });

        });

        context("Instance", async function () {

            beforeEach( async function () {

                machine =  new Machine(name, states, initialStateId, uri);

            });

            it("instance.toString() should return a JSON string representation of the Machine instance", async function() {

                dehydrated = machine.toString();
                rehydrated = JSON.parse(dehydrated);

                for (const [key, value] of Object.entries(machine)) {
                    expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.clone() should return another Machine instance with the same property values", async function() {

                // Get plain object
                clone = machine.clone();

                // Is an Machine instance
                expect(clone instanceof Machine).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(machine)) {
                    expect(JSON.stringify(clone[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.toObject() should return a plain object representation of the Machine instance", async function() {

                // Get plain object
                object = machine.toObject();

                // Not an Machine instance
                expect(object instanceof Machine).is.false;

                // Key values all match
                for (const [key, value] of Object.entries(machine)) {
                    expect(JSON.stringify(object[key]) === JSON.stringify(value)).is.true;
                }

            });

        });
    });

});