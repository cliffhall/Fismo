/**
 * Fismo Domain Entity: Transition
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const { validateId, validateNameStrict, validateNameLax, nameToId} = require("../util/name-utils");

class Transition {

    /*
        struct Transition {
            bytes4 actionId;          // keccak256 hash of action name
            bytes4 targetStateId;     // keccak256 hash of target state name
            string action;            // Action name. no spaces, only a-z, A-Z, 0-9, and _
            string targetStateName;   // Target State name. begin with letter, no spaces, a-z, A-Z, 0-9, and _
        }
    */

    constructor (action, targetStateName) {
        this.action = action;
        this.targetStateName = targetStateName;
        this.actionId = nameToId(action);
        this.targetStateId = nameToId(targetStateName);
    }

    /**
     * Get a new Transition instance from an object representation
     * @param o
     * @returns {Transition}
     */
    static fromObject(o) {
        const {action, targetStateName} = o;
        return new Transition(action, targetStateName);
    }

    /**
     * Get a database representation of this Transition instance
     * @returns {object}
     */
    toObject() {
        return JSON.parse(this.toString());
    }

    /**
     * Get a string representation of this Transition instance
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Clone this Transition
     * @returns {Transition}
     */
    clone () {
        return Transition.fromObject(this.toObject());
    }

    /**
     * Is this Transition instance's actionId field valid?
     * @returns {boolean}
     */
    actionIdIsValid() {
        let valid = false;
        let { action, actionId } = this;
        try {
            valid = (
                validateId(action, actionId)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Transition instance's targetStateId field valid?
     * @returns {boolean}
     */
    targetStateIdIsValid() {
        let valid = false;
        let {targetStateName, targetStateId} = this;
        try {
            valid = (
                validateId(targetStateName, targetStateId)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Transition instance's action field valid?
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
     * Is this Transition instance's targetStateName field valid?
     * @returns {boolean}
     */
    targetStateNameIsValid() {
        let valid = false;
        let { targetStateName } = this;
        try {
            valid = (
                targetStateName !== null &&
                typeof targetStateName !== 'undefined' &&
                typeof targetStateName === "string" &&
                validateNameStrict(targetStateName)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Transition instance valid?
     * @returns {boolean}
     */
    isValid() {
        return (
            this.actionIdIsValid() &&
            this.targetStateIdIsValid() &&
            this.actionIsValid() &&
            this.targetStateNameIsValid()
        );
    };

}

// Export
if (NODE) {
    module.exports = Transition;
} else {
    if (window) {
        if (!window.Fismo) window.Fismo = {};
        window.Fismo.Transition = Transition;
    }
}