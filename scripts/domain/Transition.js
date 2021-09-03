/**
 * Domain Entity: Transition
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const {nameToId, validateName, validateId} = require("../util/name-utils");
const State = require("./State");

class Transition {

    constructor (actionName, targetStateName) {
        this.actionName = actionName;
        this.actionId = nameToId(actionName);
        this.targetStateName = targetStateName;
        this.targetStateId = nameToId(targetStateName);
    }

    /**
     * Get a new Transition instance from a database representation
     * @param o
     * @returns {Transition}
     */
    static fromObject(o) {
        const {name, exitGuarded, enterGuarded} = o;
        let transitions = o.transitions ? o.transitions.map(transition => Transition.fromObject(transition)) : undefined;
        return new Transition(name, transitions, exitGuarded, enterGuarded) ;
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
     * Is this Transition instance's actionName field valid?
     * @returns {boolean}
     */
    actionNameIsValid() {
        let valid = false;
        let {actionName} = this;
        try {
            valid = (
                typeof actionName === "string" &&
                validateName(actionName)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Transition instance's actionId field valid?
     * @returns {boolean}
     */
    actionIdIsValid() {
        let valid = false;
        let {actionName, actionId} = this;
        try {
            valid = (
                this.nameIsValid() &&
                validateId(actionName, actionId)
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
        let {targetStateName} = this;
        try {
            valid = (
                typeof targetStateName === "string" &&
                validateName(targetStateName)
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
                this.nameIsValid() &&
                validateId(targetStateName, targetStateId)
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
            this.actionNameIsValid() &&
            this.actionIdIsValid() &&
            this.targetStateNameIsValid() &&
            this.targetStateIdIsValid()
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
    window.Ticket = Transition;
}