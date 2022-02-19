// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @title FismoConstants
 *
 * @notice Constants used by the Fismo protocol
 */
contract FismoConstants {

    // Revert Reasons
    string internal constant ONLY_OWNER = "Only owner may call";
    string internal constant ONLY_OPERATOR = "Only operator may call";

    string internal constant MACHINE_EXISTS = "Machine already exists";

    string internal constant NO_SUCH_GUARD = "No such guard";
    string internal constant NO_SUCH_MACHINE = "No such machine";
    string internal constant NO_SUCH_STATE = "No such state";
    string internal constant NO_SUCH_ACTION = "No such action";

    string internal constant INVALID_OPERATOR_ADDR = "Invalid operator address";
    string internal constant INVALID_MACHINE_ID = "Invalid machine id";
    string internal constant INVALID_STATE_ID = "Invalid state id";
    string internal constant INVALID_ACTION_ID = "Invalid action id";
    string internal constant INVALID_TARGET_ID = "Invalid target state id";

    string internal constant CODELESS_GUARD = "Guard address not a contract";
    string internal constant GUARD_REVERTED = "Guard function reverted";

}