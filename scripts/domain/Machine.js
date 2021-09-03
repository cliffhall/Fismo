/**
 * Domain Entity: Machine
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const {nameToId, validateName, validateId} = require("../util/name-utils");

class Machine {

    constructor (name, initialStateName, states) {
        this.name = name;
        this.id = nameToId(name);
        this.initialStateName = initialStateName;
        this.initialStateId = nameToId(initialStateName);
        this.states = states || []; // State[]
    }

    /**
     * Get a new Machine instance from a database representation
     * @param o
     * @returns {Machine}
     */
    static fromObject(o) {
        const {name, initialStateName} = o;
        let states = o.states ? o.states.map(state => State.fromObject(state)) : undefined;
        return new Machine(name, initialStateName, states) ;
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
                typeof name === "string" &&
                validateName(name)
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
     * Is this Machine instance's initialStateName field valid?
     * @returns {boolean}
     */
    initialStateNameIsValid() {
        let valid = false;
        let {initialStateName} = this;
        try {
            valid = (
                typeof initialStateName === "string" &&
                validateName(initialStateName)
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
        let {initialStateName, initialStateId} = this;
        try {
            valid = (
                this.initialStateNameIsValid() &&
                validateId(initialStateName,initialStateId)
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
                Array.isArray(states) &&
                states.length === 0 ||
                states.reduce( (prev, state) => prev && state.isValid(), true )
            );
        } catch (e) {}
        return valid;
    };

    /**
     * Is this Machine instance valid?
     * @returns {boolean}
     */
    isValid() {
        return (
            this.nameIsValid() &&
            this.idIsValid() &&
            this.initialStateNameIsValid() &&
            this.initialStateIdIsValid() &&
            this.statesIsValid()
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