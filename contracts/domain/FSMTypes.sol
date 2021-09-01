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
        bytes32 id;
        bytes32 initialStateId;
        string name;
        string initialStateName;
        State[] states;
    }

    struct State {
        bytes32 id;          // keccak256 hash of name
        string name;         // must not contain spaces
        bool exitGuarded;    // is there an exit guard?
        bool enterGuarded;   // is there an enter guard?
        Transition[] transitions;
    }

    struct Action {
        bytes32 id;
        string name;
        string target;
    }

    struct Transition {
        bytes32 actionId;
        bytes32 targetStateId;
        string actionName;
        string targetStateName;
    }

}