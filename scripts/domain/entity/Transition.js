const { nameToId, validateNameStrict, validateNameLax, validateId } = require("../util/name-utils");

/**
 * Fismo Domain Entity: Transition
 * The complete on-chain definition of a Transition.
 * @author Cliff Hall <cliff@futurescale.com>
 */
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
        this.actionId = action ? nameToId(action) : action;
        this.targetStateId = targetStateName ? nameToId(targetStateName) : targetStateName;
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
     * Get a new Transition instance from a struct representation
     * @param struct
     * @returns {*}
     */
    static fromStruct(struct) {
        let actionId, targetStateId, action, targetStateName;

        // destructure struct
        [actionId, targetStateId, action, targetStateName] = struct;
        return Transition.fromObject({
            actionId: actionId.toString(),
            targetStateId: targetStateId.toString(),
            action,
            targetStateName
        });
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
     * Get a struct representation of this Transition instance
     * @returns {string}
     */
    toStruct() {
        const {action, actionId, targetStateName, targetStateId} = this;
        return [
            actionId,
            targetStateId,
            action,
            targetStateName,
        ];
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
module.exports = Transition;