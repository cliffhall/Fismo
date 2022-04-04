// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "../../domain/FismoStore.sol";
import "../../domain/FismoConstants.sol";

/**
 * @notice KeyToken is the Fismo ERC-20, which we only check for a balance of
 */
interface KeyToken {
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @notice Lockable Door Guard Logic
 *
 * - Machine: LockableDoor
 * - Init: Validate and store key token address
 * - States guarded: Locked
 * - Transition Guards: Exit
 * - Action Filter: Suppress 'Unlock' action if user doesn't have key
 */
contract LockableDoorGuards is FismoConstants {

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
        // Make sure _keyToken isn't the zero address
        // Note: specifically testing a revert with no reason here
        require(_keyToken != address(0));

        // Make sure _keyToken address has code
        // Note: specifically testing a revert with a reason here
        requireContractCode(_keyToken, CODELESS_INITIALIZER);

        // Initialize market config params
        lockableDoorSlot().keyToken = KeyToken(_keyToken);
    }

    // -------------------------------------------------------------------------
    // ACTION FILTER
    // -------------------------------------------------------------------------

    // Filter actions contextually
    function LockableDoor_Locked_Filter(address _user, string calldata _action)
    external
    view
    returns(bool suppress)
    {
        // User must have key to unlock door
        bool hasKey = isKeyHolder(_user);

        // For unlock action only, suppress if user does not have key
        suppress = (
            keccak256(abi.encodePacked(_action)) ==
            keccak256(abi.encodePacked("Unlock"))
        ) ? !(hasKey) : false;
    }

    // -------------------------------------------------------------------------
    // TRANSITION GUARDS
    // -------------------------------------------------------------------------

    // Locked / Exit
    // Valid next states: Closed
    function LockableDoor_Locked_Exit(address _user, string calldata _nextStateName)
    external
    view
    returns(string memory)
    {
        // Make sure _user isn't the owner address
        // Note: specifically testing a revert with no reason here
        require(_user != FismoStore.getStore().owner);

        // User must have key to unlock door
        bool hasKey = isKeyHolder(_user);
        require(hasKey);

        // Success response message
        return "Door unlocked.";

    }

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    /**
     * @notice Determine if user holds the key
     *
     * @param _user - the user to check
     *
     * @return true if the user holds a balance of the key token
     */
    function isKeyHolder(address _user)
    internal
    view
    returns (bool)
    {
        return lockableDoorSlot().keyToken.balanceOf(_user) > 0;
    }

    /**
     * @notice Verify an address is a contract and not an EOA
     *
     * Reverts if address has no contract code
     *
     * @param _contract - the contract to check
     * @param _errorMessage - the revert reason to throw
     */
    function requireContractCode(address _contract, string memory _errorMessage) internal view {
        uint256 contractSize;
        assembly {
            contractSize := extcodesize(_contract)
        }
        require(contractSize > 0, _errorMessage);
    }

}