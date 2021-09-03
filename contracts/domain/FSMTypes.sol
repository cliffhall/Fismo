// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @title FSMTypes
 *
 * @notice Enums and structs used by the FSM
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FSMTypes {

    enum Guard {
        Enter,
        Exit
    }

    struct Machine {
        string name;
        string initialStateName;
        bytes32 id;
        bytes32 initialStateId;
        State[] states;
    }

    struct State {
        string name;         // must not contain spaces
        bytes32 id;          // keccak256 hash of name
        bool exitGuarded;    // is there an exit guard?
        bool enterGuarded;   // is there an enter guard?
        Transition[] transitions;
    }

    struct Action {
        string name;
        string target;
        bytes32 id;
    }

    struct Transition {
        string actionName;
        string targetStateName;
        bytes32 actionId;
        bytes32 targetStateId;
    }

}