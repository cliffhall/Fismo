// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @title FismoTypes
 *
 * @notice Enums and structs used by Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoTypes {

    enum Guard {
        Enter,
        Exit,
        Filter // only valid internally
    }

    struct Machine {
        address operator;         // address of approved operator (can be contract or EOA)
        bytes4 id;                // keccak256 hash of machine name
        bytes4 initialStateId;    // keccak256 hash of initial state
        string name;              // name of machine
        string uri;               // off-chain URI of metadata describing the machine
        State[] states;           // all of the valid states for this machine
    }

    struct State {
        bytes4 id;                // keccak256 hash of state name
        string name;              // name of state. begin with letter, no spaces, a-z, A-Z, 0-9, and _
        bool exitGuarded;         // is there an exit guard?
        bool enterGuarded;        // is there an enter guard?
        address guardLogic;       // address of guard logic contract
        Transition[] transitions; // all of the valid transitions from this state
    }

    struct Position {
        bytes4 machineId;         // keccak256 hash of machine name
        bytes4 stateId;           // keccak256 hash of state name
    }

    struct Transition {
        bytes4 actionId;          // keccak256 hash of action name
        bytes4 targetStateId;     // keccak256 hash of target state name
        string action;            // Action name. no spaces, only a-z, A-Z, 0-9, and _
        string targetStateName;   // Target State name. begin with letter, no spaces, a-z, A-Z, 0-9, and _
    }

    struct ActionResponse {
        string machineName;        // name of machine
        string action;             // name of action that triggered the transition
        string priorStateName;     // name of prior state
        string nextStateName;      // name of new state
        string exitMessage;        // response from the prior state's exit guard
        string enterMessage;       // response from the new state's enter guard
    }

}