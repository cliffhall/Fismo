/**
 * Reasons for Fismo transactions to revert
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
exports.RevertReasons = {

    ONLY_OWNER: "Only owner may call",
    ONLY_OPERATOR: "Only operator may call",

    MACHINE_EXISTS: "Machine already exists",

    NO_SUCH_GUARD: "No such guard",
    NO_SUCH_MACHINE: "No such machine",
    NO_SUCH_STATE: "No such state",
    NO_SUCH_ACTION: "No such action",

    INVALID_OPERATOR_ADDR: "Invalid operator address",
    INVALID_MACHINE_ID: "Invalid machine id",
    INVALID_STATE_ID: "Invalid state id",
    INVALID_ACTION_ID: "Invalid action id",
    INVALID_TARGET_ID: "Invalid target state id",

    GUARD_REVERTED: "Guard function reverted"

};