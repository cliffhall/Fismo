/**
 * Fismo Domain Entity: Position
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const { validateId, validateNameStrict, validateNameLax} = require("../util/name-utils");

class Position {

    /*
        struct Position {
            bytes4 machineId;         // keccak256 hash of machine name
            bytes4 stateId;           // keccak256 hash of state name
        }
    */

    constructor (machineId, stateId) {
        this.machineId = machineId;
        this.stateId = stateId;
    }

    /**
     * Get a new Position instance from an object representation
     * @param o
     * @returns {Position}
     */
    static fromObject(o) {
        const {machineId, stateId} = o;
        return new Position(machineId, stateId);
    }

    /**
     * Validate a raw position history array
     * @param history
     * @returns {boolean}
     */
    static positionHistoryIsValid(history) {
        let valid = false;
        try {
            valid = (
                Array.isArray(history) &&
                history.reduce( (acc, position) => acc = Position.fromObject(position).isValid(), false )
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Get a database representation of this Position instance
     * @returns {object}
     */
    toObject() {
        return JSON.parse(this.toString());
    }

    /**
     * Get a string representation of this Position instance
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Clone this Position
     * @returns {Position}
     */
    clone () {
        return Position.fromObject(this.toObject());
    }

    /**
     * Is this Position instance's machineId field valid?
     * @returns {boolean}
     */
    machineIdIsValid() {
        let valid = false;
        let { machineId } = this;
        try {
            valid = (
                typeof machineId == "string" &&
                ethers.BigNumber.from(machineId).gt("0x00000000")
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Position instance's stateId field valid?
     * @returns {boolean}
     */
    stateIdIsValid() {
        let valid = false;
        let { stateId } = this;
        try {
            valid = (
                typeof stateId == "string" &&
                ethers.BigNumber.from(stateId).gt("0x00000000")
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Position instance valid?
     * @returns {boolean}
     */
    isValid() {
        return (
            this.machineIdIsValid() &&
            this.stateIdIsValid()
        );
    };

}

// Export
if (NODE) {
    module.exports = Position;
} else {
    if (window) {
        if (!window.Fismo) window.Fismo = {};
        window.Fismo.Position = Position;
    }
}