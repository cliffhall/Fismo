/**
 * Domain Entity: Machine
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const {nameToId, validateNameStrict, validateId} = require("../util/name-utils");
const State = require("./State");

class Machine {

    /*
        struct Machine {
            bytes4 id;                // keccak256 hash of machine name
            bytes4 initialStateId;    // keccak256 hash of initial state
            string name;              // name of machine
            string uri;               // off-chain URI of metadata describing the machine
            State[] states;           // all of the valid states for this machine
        }
    */

    constructor (name, states, initialStateId, uri) {
        this.id = nameToId(name);
        this.name = name;
        this.initialStateId = initialStateId;
        this.states = states || []; // State[]
        this.uri = uri;
    }

    /**
     * Get a new Machine instance from a database representation
     * @param o
     * @returns {Machine}
     */
    static fromObject(o) {
        const {name, initialStateId, uri} = o;
        let states = o.states ? o.states.map(state => State.fromObject(state)) : undefined;
        return new Machine(name, states, initialStateId, uri);
    }

    /**
     * Get a database representation of this Machine instance
     * @returns {object}
     */
    toObject() {
        return JSON.parse(this.toString());
    }

    /**
     * Get a string representation of this Machine instance
     * @returns {boolean}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Is this Machine instance's name field valid?
     * @returns {boolean}
     */
    nameIsValid() {
        let valid = false;
        let {name} = this;
        try {
            valid = (
                name !== null &&
                typeof name !== 'undefined' &&
                typeof name === "string" &&
                validateNameStrict(name)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Machine instance's id field valid?
     * @returns {boolean}
     */
    idIsValid() {
        let valid = false;
        let {name, id} = this;
        try {
            valid = (
                this.nameIsValid() &&
                validateId(name,id)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Machine instance's initialStateId field valid?
     * @returns {boolean}
     */
    initialStateIdIsValid() {
        let valid = false;
        let {initialStateId, states} = this;
        try {
            valid = (
                typeof initialStateId === "string" &&
                !!states.find(state => state.id === initialStateId)
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Machine instance's states collection valid?
     * @returns {boolean}
     */
    statesIsValid() {
        let valid = false;
        let {states} = this;
        try {
            valid = (
                Array.isArray(states)
            ) && (
                states.length === 0 ||
                states.reduce( (prev, state) => prev && state.isValid(), true )
            );
        } catch (e) {}
        return valid;
    };

    /**
     * Is this Machine instance's uri field valid?
     * @returns {boolean}
     */
    uriIsValid() {
        let valid = false;
        let {uri} = this;
        try {
            valid = (
                typeof uri === "string" &&
                uri.length >= 1
            ) || (
                uri === null ||
                typeof uri === 'undefined'
            );
        } catch (e) {}
        return valid;
    }

    /**
     * Is this Machine instance valid?
     * @returns {boolean}
     */
    isValid() {
        return (
            this.idIsValid() &&
            this.nameIsValid() &&
            this.initialStateIdIsValid() &&
            this.statesIsValid() &&
            this.uriIsValid()
        );
    };

    /**
     * Clone this Machine
     * @returns {Machine}
     */
    clone () {
       return Machine.fromObject(this.toObject());
    }

}

// Export
if (NODE) {
    module.exports = Machine;
} else {
    window.Volley = Machine;
}