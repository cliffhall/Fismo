/**
 * Domain Entity: Transition
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const { validateId, validateNameStrict, validateNameLax, nameToId} = require("../util/name-utils");

class Transition {

    constructor (actionName, targetStateName) {
        this.actionName = actionName;
        this.targetStateName = targetStateName;
        this.actionId = nameToId(actionName);
        this.targetStateId = nameToId(targetStateName);
    }

    /**
     * Get a new Transition instance from an object representation
     * @param o
     * @returns {Transition}
     */
    static fromObject(o) {
        const {actionName, targetStateName} = o;
        return new Transition(actionName, targetStateName);
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
     * Is this Transition instance's actionId field valid?
     * @returns {boolean}
     */
    actionIdIsValid() {
        let valid = false;
        let { actionName, actionId } = this;
        try {
            valid = (
                validateId(actionName, actionId)
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
     * Is this Transition instance's actionName field valid?
     * @returns {boolean}
     */
    actionNameIsValid() {
        let valid = false;
        let { actionName } = this;
        try {
            valid = (
                actionName !== null &&
                typeof actionName !== 'undefined' &&
                typeof actionName === "string" &&
                validateNameLax(actionName)
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
            this.actionNameIsValid() &&
            this.targetStateNameIsValid()
        );
    };

    /**
     * Clone this Transition
     * @returns {Transition}
     */
    clone () {
       return Transition.fromObject(this.toObject());
    }

}

// Export
if (NODE) {
    module.exports = Transition;
} else {
    window.Transition = Transition;
}