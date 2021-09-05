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
        Exit
    }

    struct Machine {
        address owner;            // address of machine owner
        bytes4 id;               // keccak256 hash of machine name
        bytes4 initialStateId;   // keccak256 hash of initial state
        string name;              // name of machine
        string uri;               // off-chain URI of metadata describing the machine
        State[] states;           // all of the valid states for this machine
    }

    struct State {
        bytes4 id;               // keccak256 hash of state name
        string name;              // name of state. must not contain spaces
        bool exitGuarded;         // is there an exit guard?
        bool enterGuarded;        // is there an enter guard?
        address guardLogic;       // address of guard logic contract
        Transition[] transitions; // all of the valid transitions from this state
    }

    struct Action {
        bytes4 id;               // keccak256 hash of Action name
        bytes4 targetStateId;    // keccak256 hash of target state name
        string name;              // Action name. must not contain spaces
    }

    struct Portal {
        bytes4 id;               // keccak256 hash of Portal name
        string name;              // portal name. must not contain spaces
        Position position;        // target position (machine/state)
    }

    struct Transition {
        bytes4 actionId;         // keccak256 hash of action name
        bytes4 targetStateId;    // keccak256 hash of target state name
    }

    struct Position {
        bytes4 machineId;        // keccak256 hash of machine name
        bytes4 stateId;          // keccak256 hash of state name
    }

}