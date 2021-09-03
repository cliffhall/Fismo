/**
 * Domain Entity: State
 * @author Cliff Hall <cliff@futurescale.com>
 */
const NODE = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
const {nameToId, validateName, validateId} = require("../util/name-utils");
const Transition = require("./Transition");

class State {

    constructor (name, transitions, exitGuarded, enterGuarded) {
        this.name = name;
        this.id = nameToId(name);
        this.transitions = transitions || [];
        this.enterGuarded = enterGuarded;
        this.exitGuarded = exitGuarded;
    }

    /**
     * Get a new State instance from a database representation
     * @param o
     * @returns {State}
     */
    static fromObject(o) {
        const {name, exitGuarded, enterGuarded} = o;
        let transitions = o.transitions ? o.transitions.map(transition => Transition.fromObject(transition)) : undefined;
        return new State(name, transitions, exitGuarded, enterGuarded) ;
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
     * Is this State instance's name field valid?
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
            this.nameIsValid() &&
            this.idIsValid() &&
            this.transitionsIsValid() &&
            this.enterGuardedIsValid() &&
            this.exitGuardedIsValid()
        );
    };

    /**
     * Clone this State
     * @returns {State}
     */
    clone () {
       return State.fromObject(this.toObject());
    }

}

// Export
if (NODE) {
    module.exports = State;
} else {
    window.Ticket = State;
}