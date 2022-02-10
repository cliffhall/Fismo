const { expect } = require("chai");
const ActionResponse = require("../../scripts/domain/ActionResponse");

/**
 *  Test the ActionResponse domain object
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("ActionResponse", function() {

    // Suite-wide scope
    let actionResponse, object, dehydrated, rehydrated, clone;
    let machineName, priorStateName, nextStateName, action, exitMessage, enterMessage

    beforeEach( async function () {

        machineName = "The_Matrix";
        action = "Take the red pill";
        priorStateName = "Sheeple";
        nextStateName = "Awakened";
        exitMessage = "You swallow the pill.";
        enterMessage = "Now lets see how deep the rabbit hole goes."

    });

    context("📋 Constructor", async function () {

        it("Should allow creation of valid, fully populated ActionResponse instance", async function () {

            actionResponse = new ActionResponse(
                machineName,
                action,
                priorStateName,
                nextStateName,
                exitMessage,
                enterMessage
            );
            expect(actionResponse.machineNameIsValid(), "Invalid machineName").is.true;
            expect(actionResponse.actionIsValid(), "Invalid action").is.true;
            expect(actionResponse.priorStateNameIsValid(), "Invalid priorStateName").is.true;
            expect(actionResponse.nextStateNameIsValid(), "Invalid nextStateName").is.true;
            expect(actionResponse.exitMessageIsValid(), "Invalid exitMessage").is.true;
            expect(actionResponse.enterMessageIsValid(), "Invalid enterMessage").is.true;
            expect(actionResponse.isValid()).is.true;

        });

    });

    context("📋 Field validations", async function () {

        beforeEach( async function () {

            actionResponse = new ActionResponse(
                machineName,
                action,
                priorStateName,
                nextStateName,
                exitMessage,
                enterMessage
            );

        });

        it("Always present, machineName must start with a letter and contain only characters: a-z, A-Z, 0-9, and ", async function() {

            // Invalid field value
            actionResponse.machineName = 12;
            expect(actionResponse.machineNameIsValid()).is.false;

            // Invalid field value
            actionResponse.machineName = "zedz-dead-baby";
            expect(actionResponse.machineNameIsValid()).is.false;

            // Valid field value
            actionResponse.machineName = "l";
            expect(actionResponse.machineNameIsValid()).is.true;

            // Valid field values
            actionResponse.machineName = "0";
            expect(actionResponse.machineNameIsValid()).is.false;

            // Valid field value
            actionResponse.machineName = "Ninja_Battle";
            expect(actionResponse.machineNameIsValid()).is.true;

        });
        
        it("Always present, action must contain only characters: a-z, A-Z, 0-9, _, and space", async function() {

            // Invalid field value
            actionResponse.action = 12;
            expect(actionResponse.actionIsValid()).is.false;

            // Invalid field value
            actionResponse.action = "zedz-dead-baby";
            expect(actionResponse.actionIsValid()).is.false;

            // Valid field value
            actionResponse.action = "l";
            expect(actionResponse.actionIsValid()).is.true;

            // Valid field values
            actionResponse.action = "0";
            expect(actionResponse.actionIsValid()).is.true;

            // Valid field value
            actionResponse.action = "Dissapear in a puff of smoke";
            expect(actionResponse.actionIsValid()).is.true;

        });

        it("Always present, priorStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _", async function() {

            // Invalid field value
            actionResponse.priorStateName = 12;
            expect(actionResponse.priorStateNameIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field values
            actionResponse.priorStateName = "0";
            expect(actionResponse.priorStateNameIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field value
            actionResponse.priorStateName = "zedz-dead-baby";
            expect(actionResponse.priorStateNameIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Valid field value
            actionResponse.priorStateName = "l";
            expect(actionResponse.priorStateNameIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

            // Valid field value
            actionResponse.priorStateName = "Surrounded_by_ninjas";
            expect(actionResponse.priorStateNameIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

        });

        it("Always present, nextStateName must start with a letter and contain only characters: a-z, A-Z, 0-9, and _", async function() {

            // Invalid field value
            actionResponse.nextStateName = 12;
            expect(actionResponse.nextStateNameIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field values
            actionResponse.nextStateName = "0";
            expect(actionResponse.nextStateNameIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field value
            actionResponse.nextStateName = "zedz-dead-baby";
            expect(actionResponse.nextStateNameIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Valid field value
            actionResponse.nextStateName = "l";
            expect(actionResponse.nextStateNameIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

            // Valid field value
            actionResponse.nextStateName = "Inside_puff_of_smoke";
            expect(actionResponse.nextStateNameIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

        });

        it("If present, exitMessage must be a string", async function() {

            // Invalid field value
            actionResponse.exitMessage = 12;
            expect(actionResponse.exitMessageIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field values
            actionResponse.exitMessage = Date.now();
            expect(actionResponse.exitMessageIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field value
            actionResponse.exitMessage = ["zedz", "dead", "baby"];
            expect(actionResponse.exitMessageIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Valid field value
            actionResponse.exitMessage = "42";
            expect(actionResponse.exitMessageIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

            // Valid field value
            actionResponse.exitMessage = "l";
            expect(actionResponse.exitMessageIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

            // Valid field value
            actionResponse.exitMessage = "The ninjas are confounded as you vanish into a puff of smoke.";
            expect(actionResponse.exitMessageIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

        });

        it("If present, enterMessage must be a string", async function() {

            // Invalid field value
            actionResponse.enterMessage = 12;
            expect(actionResponse.enterMessageIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field values
            actionResponse.enterMessage = Date.now();
            expect(actionResponse.enterMessageIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Invalid field value
            actionResponse.enterMessage = ["zedz", "dead", "baby"];
            expect(actionResponse.enterMessageIsValid()).is.false;
            expect(actionResponse.isValid()).is.false;

            // Valid field value
            actionResponse.enterMessage = "42";
            expect(actionResponse.enterMessageIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

            // Valid field value
            actionResponse.enterMessage = "l";
            expect(actionResponse.enterMessageIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

            // Valid field value
            actionResponse.enterMessage = "The ninjas are confounded as you vanish into a puff of smoke.";
            expect(actionResponse.enterMessageIsValid()).is.true;
            expect(actionResponse.isValid()).is.true;

        });

    });

    context("📋 Utility functions", async function () {

        context("👉 Static", async function () {

            beforeEach( async function () {

                actionResponse = new ActionResponse(
                    machineName,
                    action,
                    priorStateName,
                    nextStateName,
                    exitMessage,
                    enterMessage
            );
                object = { machineName,
                    action,
                    priorStateName,
                    nextStateName,
                    exitMessage,
                    enterMessage
                };

            });

            it("ActionResponse.fromObject() should return a ActionResponse instance with the same values as the given plain object", async function () {

                // Promote to instance
                const promoted = ActionResponse.fromObject(object);

                // Is a ActionResponse instance
                expect(promoted instanceof ActionResponse).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(actionResponse)) {
                    expect(JSON.stringify(promoted[key]) === JSON.stringify(value)).is.true;
                }

            });

        });

        context("👉 Instance", async function () {

            beforeEach( async function () {

                actionResponse = new ActionResponse(
                machineName,
                action,
                priorStateName,
                nextStateName,
                exitMessage,
                enterMessage
            );

            });

            it("instance.toString() should return a JSON string representation of the ActionResponse instance", async function() {

                dehydrated = actionResponse.toString();
                rehydrated = JSON.parse(dehydrated);

                for (const [key, value] of Object.entries(actionResponse)) {
                    expect(JSON.stringify(rehydrated[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.clone() should return another ActionResponse instance with the same property values", async function() {

                // Get plain object
                clone = actionResponse.clone();

                // Is an ActionResponse instance
                expect(clone instanceof ActionResponse).is.true;

                // Key values all match
                for (const [key, value] of Object.entries(actionResponse)) {
                    expect(JSON.stringify(clone[key]) === JSON.stringify(value)).is.true;
                }

            });

            it("instance.toObject() should return a plain object representation of the ActionResponse instance", async function() {

                // Get plain object
                object = actionResponse.toObject();

                // Not an ActionResponse instance
                expect(object instanceof ActionResponse).is.false;

                // Key values all match
                for (const [key, value] of Object.entries(actionResponse)) {
                    expect(JSON.stringify(object[key]) === JSON.stringify(value)).is.true;
                }

            });

        });
    });

});