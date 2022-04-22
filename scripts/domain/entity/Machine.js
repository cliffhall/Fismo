const {nameToId, validateNameStrict, validateId} = require("../util/name-utils");
const State = require("./State");
const eip55 = require("eip55");

/**
 * Fismo Domain Entity: Machine
 * The complete on-chain definition of a Machine.
 * @author Cliff Hall <cliff@futurescale.com>
 */
class Machine {

    /*
        struct Machine {
            address operator;         // address of approved operator contract
            bytes4 id;                // keccak256 hash of machine name
            bytes4 initialStateId;    // keccak256 hash of initial state
            string name;              // name of machine
            string uri;               // off-chain URI of metadata describing the machine
            State[] states;           // all of the valid states for this machine
        }
    */

    /**
     * Constructor
     *
     * @param operator - address of approved operator contract
     * @param name - keccak256 hash of machine name
     * @param states - all of the valid states for this machine
     * @param initialStateId - keccak256 hash of initial state
     * @param uri - off-chain URI of metadata describing the machine
     */
    constructor (operator, name, states, initialStateId, uri) {
        this.operator = operator ? eip55.encode(operator) : null;
        this.id = name ? nameToId(name) : name;
        this.name = name;
        this.initialStateId = initialStateId;
        this.states = states || []; // State[]
        this.uri = uri || "";
    }

    /**
     * Get a new Machine instance from a database representation
     * @param o
     * @returns {Machine}
     */
    static fromObject(o) {
        const {operator, name, initialStateId, uri} = o;
        let states = o.states ? o.states.map(state => State.fromObject(state)) : undefined;
        return new Machine(operator, name, states, initialStateId, uri);
    }

    /**
     * Get a new Machine instance from a returned struct representation
     * @param struct
     * @returns {*}
     */
    static fromStruct(struct) {
        let operator, id, name, initialStateId, uri, states;

        // destructure struct
        [operator, id, name, initialStateId, uri, states] = struct;
        return Machine.fromObject({
            operator,
            id,
            initialStateId: initialStateId,
            name,
            uri,
            states: states.map(state => State.fromStruct(state))
        });
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
     * Get a struct representation of this Machine instance
     * @returns {string}
     */
    toStruct() {
        const {operator, name, initialStateId, uri} = this;
        let states = this.states.map(state => state.toStruct());
        return [
            operator,
            nameToId(name),
            name,
            initialStateId,
            uri,
            states
        ];
    }

    /**
     * Clone this Machine
     * @returns {Machine}
     */
    clone () {
        return Machine.fromObject(this.toObject());
    }

    /**
     * Is this Machine instance's operator field valid?
     * Must be a eip55 compliant Ethereum address
     * @returns {boolean}
     */
    operatorIsValid() {
        let valid = false;
        let {operator} = this;
        try {
            valid = (
                typeof operator === "string" &&
                eip55.verify(operator)
            ) || (
                operator === null ||
                typeof operator === 'undefined'
            );
        } catch (e) {}
        return valid;
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
                states.length === 0 &&
                (initialStateId === null || initialStateId === undefined)
            ) || (
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
                typeof uri === "string"
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
            this.operatorIsValid() &&
            this.idIsValid() &&
            this.nameIsValid() &&
            this.initialStateIdIsValid() &&
            this.statesIsValid() &&
            this.uriIsValid()
        );
    };

    /**
     * Get the state with the given name
     * @param stateName - the name of the state to fetch
     * @return state - the state (if any) whose name matches stateName
     */
    getState(stateName) {
        return this.states.filter(state => state.name === stateName)[0];
    }

    /**
     * Get the initial state
     * @return state - the machine's initial state
     */
    getInitialState() {
        const initialStateId = this.initialStateId;
        return this.states.filter(state => state.id === initialStateId)[0];
    }

}

// Export
module.exports = Machine;