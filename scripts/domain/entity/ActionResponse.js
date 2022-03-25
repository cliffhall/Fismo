/**
 * Fismo Domain Entity: ActionResponse
 * @author Cliff Hall <cliff@futurescale.com>
 */
const { validateNameStrict, validateNameLax } = require("../util/name-utils");

class ActionResponse {

    /*
        struct ActionResponse {
            string machineName;        // name of machine
            string action;             // name of action that triggered the transition
            string priorStateName;     // name of prior state
            string nextStateName;      // name of new state
            string exitMessage;        // response from the prior state's exit guard
            string enterMessage;       // response from the new state's enter guard
        }
    */

    constructor (machineName, action, priorStateName, nextStateName, exitMessage, enterMessage) {
        this.machineName = machineName;
        this.action = action;
        this.priorStateName = priorStateName;
        this.nextStateName = nextStateName;
        this.exitMessage = exitMessage;
        this.enterMessage = enterMessage;
    }

    static validateStruct( struct ) {
        const instance = new ActionResponse( ...struct );
        return instance.isValid();
    }

    /**
     * Get a new ActionResponse instance from an object representation
     * @param o
     * @returns {ActionResponse}
     */
    static fromObject(o) {
        const {machineName, action, priorStateName, nextStateName, exitMessage, enterMessage} = o;
        return new ActionResponse(machineName, action, priorStateName, nextStateName, exitMessage, enterMessage);
    }

    /**
     * Get a database representation of this ActionResponse instance
     * @returns {object}
     */
    toObject() {
        return JSON.parse(this.toString());
    }

    /**
     * Get a string representation of this ActionResponse instance
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Clone this ActionResponse
     * @returns {ActionResponse}
     */
    clone () {
        return ActionResponse.fromObject(this.toObject());
    }

    /**
     * Is this ActionResponse instance's machineName field valid?
     * @returns {boolean}
     */
    machineNameIsValid() {
        let valid = false;
        let {machineName} = this;
        try {
            valid = (
                typeof machineName === "string" &&
                validateNameStrict(machineName)
            );
        } catch (e) {}
        return valid;
    }


    /**
     * Is this ActionResponse instance's action field valid?
     * @returns {boolean}
     */
    actionIsValid() {
        let valid = false;
        let { action } = this;
        try {
            valid = (
                typeof action === "string" &&
                validateNameLax(action)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this ActionResponse instance's priorStateName field valid?
     * @returns {boolean}
     */
    priorStateNameIsValid() {
        let valid = false;
        let { priorStateName } = this;
        try {
            valid = (
                typeof priorStateName === "string" &&
                validateNameStrict(priorStateName)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this ActionResponse instance's nextStateName field valid?
     * @returns {boolean}
     */
    nextStateNameIsValid() {
        let valid = false;
        let { nextStateName } = this;
        try {
            valid = (
                typeof nextStateName === "string" &&
                validateNameStrict(nextStateName)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this ActionResponse instance's exitMessage field valid?
     * @returns {boolean}
     */
    exitMessageIsValid() {
        let valid = false;
        let { exitMessage } = this;
        try {
            valid = (
                exitMessage === null || typeof exitMessage === 'undefined'
            ) || (
                typeof exitMessage === "string"
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this ActionResponse instance's enterMessage field valid?
     * @returns {boolean}
     */
    enterMessageIsValid() {
        let valid = false;
        let { enterMessage } = this;
        try {
            valid = (
                enterMessage === null || typeof enterMessage === 'undefined'
            ) || (
                typeof enterMessage === "string"
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this ActionResponse instance valid?
     * @returns {boolean}
     */
    isValid() {
        return (
            this.machineNameIsValid() &&
            this.actionIsValid() &&
            this.priorStateNameIsValid() &&
            this.nextStateNameIsValid() &&
            this.exitMessageIsValid() &&
            this.enterMessageIsValid()
        );
    };

}

// Export
module.exports = ActionResponse;