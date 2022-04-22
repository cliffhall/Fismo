const { nameToId, validateNameStrict, validateId } = require("../util/name-utils");
const Transition = require("./Transition");
const eip55 = require("eip55");
const ethers = require("ethers");

/**
 * Fismo Domain Entity: State
 * The complete on-chain definition of a State.
 * @author Cliff Hall <cliff@futurescale.com>
 */
class State {

    /*
        struct State {
            bytes4 id;                // keccak256 hash of state name
            string name;              // name of state. begin with letter, no spaces, a-z, A-Z, 0-9, and _
            bool exitGuarded;         // is there an exit guard?
            bool enterGuarded;        // is there an enter guard?
            address guardLogic;       // address of guard logic contract
            Transition[] transitions; // all of the valid transitions from this state
        }
    */

    /**
     * Constructor
     *
     * @param name - name of state. begin with letter, no spaces, a-z, A-Z, 0-9, and _
     * @param exitGuarded - is there an exit guard?
     * @param enterGuarded - is there an enter guard?
     * @param transitions - all of the valid transitions from this state
     * @param guardLogic - address of guard logic contract
     */
    constructor (name, exitGuarded, enterGuarded, transitions, guardLogic) {
        this.name = name;
        this.id = name ? nameToId(name) : name;
        this.enterGuarded = enterGuarded;
        this.exitGuarded = exitGuarded;
        this.transitions = transitions || [];
        this.guardLogic = guardLogic ? eip55.encode(guardLogic) : ethers.constants.AddressZero;
    }

    /**
     * Get a new State instance from a database representation
     * @param o
     * @returns {State}
     */
    static fromObject(o) {
        const {name, exitGuarded, enterGuarded, guardLogic} = o;
        let transitions = o.transitions ? o.transitions.map(transition => Transition.fromObject(transition)) : undefined;
        return new State(name, exitGuarded, enterGuarded, transitions, guardLogic);
    }

    /**
     * Get a new State instance from a struct representation
     * @param struct
     * @returns {*}
     */
    static fromStruct(struct) {
        let id, name, exitGuarded, enterGuarded, guardLogic, transitions;


        // destructure struct
        [id, name, exitGuarded, enterGuarded, guardLogic, transitions] = struct;
        return State.fromObject({
            id,
            name,
            exitGuarded,
            enterGuarded,
            guardLogic,
            transitions: transitions
                ? transitions.map(transition => Transition.fromStruct(transition))
                : []
        });
    }

    /**
     * Get a database representation of this State instance
     * @returns {object}
     */
    toObject() {
        return JSON.parse(this.toString());
    }

    /**
     * Get a string representation of this State instance
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Get a struct representation of this State instance
     * @returns {string}
     */
    toStruct() {
        const {name, exitGuarded, enterGuarded, guardLogic} = this;
        let transitions = this.transitions.map(transition => transition.toStruct());
        return [
            nameToId(name),
            name,
            exitGuarded,
            enterGuarded,
            guardLogic,
            transitions
        ];
    }

    /**
     * Clone this State
     * @returns {State}
     */
    clone () {
        return State.fromObject(this.toObject());
    }

    /**
     * Is this State instance's name field valid?
     * @returns {boolean}
     */
    nameIsValid() {
        let valid = false;
        let {name} = this;
        try {
            valid = (
                typeof name === "string" &&
                validateNameStrict(name)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this State instance's name field valid?
     * If present, must be a eip55 compliant Ethereum address
     * @returns {boolean}
     */
    guardLogicIsValid() {
        let valid = false;
        let {guardLogic} = this;
        try {
            valid = (
                typeof guardLogic === 'string' &&
                eip55.verify(guardLogic)
            ) || (
                guardLogic === null ||
                typeof guardLogic === 'undefined'
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this State instance's id field valid?
     * @returns {boolean}
     */
    idIsValid() {
        let valid = false;
        let {name, id} = this;
        try {
            valid = (
                this.nameIsValid() &&
                validateId(name, id)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this State instance's transitions collection valid?
     * @returns {boolean}
     */
    transitionsIsValid() {
        let valid = false;
        let {transitions} = this;
        try {
            valid = (
                Array.isArray(transitions) &&
                transitions.reduce( (prev, transition) => prev && transition.isValid(), true )
            );
        } catch (e) {}
        return valid;
    };

    /**
     * Is this State instance's enterGuarded field valid?
     * @returns {boolean}
     */
    enterGuardedIsValid() {
        let valid = false;
        let {enterGuarded} = this;
        try {
            valid = typeof enterGuarded === 'boolean'
        } catch (e) {}
        return valid;
    }

    /**
     * Is this State instance's exitGuarded field valid?
     * @returns {boolean}
     */
    exitGuardedIsValid() {
        let valid = false;
        let {exitGuarded} = this;
        try {
            valid = typeof exitGuarded === 'boolean'
        } catch (e) {}
        return valid;
    }

    /**
     * Is this State instance valid?
     * @returns {boolean}
     */
    isValid() {
        return (
            this.idIsValid() &&
            this.nameIsValid() &&
            this.enterGuardedIsValid() &&
            this.exitGuardedIsValid() &&
            this.transitionsIsValid() &&
            this.guardLogicIsValid()
        );
    };

}

// Export
module.exports = State;