// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

/**
 * @notice KeyToken is the Fismo ERC-20, which we only check for a balance of
 */
interface KeyToken {
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @notice Transition guard functions
 *
 * - Machine: LockableDoor
 * - Guards: Locked/Exit
 */
contract LockableDoorGuards {

    // -------------------------------------------------------------------------
    // MACHINE STORAGE
    // -------------------------------------------------------------------------

    // Unique storage slot id
    bytes32 internal constant LOCKABLE_DOOR_SLOT = keccak256("LockableDoor.Storage");

    // Storage slot structure
    struct LockableDoorSlot {

        // Address of the key contract
        KeyToken keyToken;

    }

    // Getter for the storage slot
    function lockableDoorSlot() internal pure returns (LockableDoorSlot storage lds) {
        bytes32 position = LOCKABLE_DOOR_SLOT;
        assembly {
            lds.slot := position
        }
    }

    // -------------------------------------------------------------------------
    // MACHINE INITIALIZER
    // -------------------------------------------------------------------------

    /**
     * @notice Machine Initializer
     *
     * @param _keyToken - The token contract where a non-zero balance represents a key
     */
    function initialize(address _keyToken)
    external
    {
        // Initialize market config params
        lockableDoorSlot().keyToken = KeyToken(_keyToken);
    }

    // -------------------------------------------------------------------------
    // TRANSITION GUARDS
    // -------------------------------------------------------------------------

    // Locked / Exit
    // Valid next states: Closed
    function LockableDoor_Locked_Exit(address _user, string calldata _nextStateName)
    public
    view
    returns(string memory)
    {
        // User must have key to unlock door
        bool hasKey = lockableDoorSlot().keyToken.balanceOf(_user) > 0;
        require(hasKey, "User must hold key to unlock.");

        // Success response message
        return "Door unlocked.";

    }

}