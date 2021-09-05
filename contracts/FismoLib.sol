// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoTypes } from "./domain/FismoTypes.sol";

/**
 * @title FismoLib
 *
 * @notice FSM configuration storage
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
library FismoLib {

    bytes4 internal constant FISMO_SLOT = keccak256("fismo.storage.slot");

    struct FismoSlot {

        // Address of the action initiator
        address actionInitiator;

        // Maps machine id to a machine struct
        //      machine id => Machine struct
        mapping(bytes4 => FismoTypes.Machine) machine;

        // Maps a wallet address to a an array of Position structs
        //      machine id  => ( state id => state index )
        mapping(address => FismoTypes.Position[]) userHistory;

        // Maps a wallet address to a mapping of machine id to user's current state in that machine
        //      wallet  => ( machine id => current state id )
        mapping(address => mapping(bytes4 => bytes4)) userState;

        // Maps a machine id to a mapping of state id to index of state in machine's states array
        //      machine id  => ( state id => state index )
        mapping(bytes4 => mapping(bytes4 => uint256)) stateIndex;

        // Maps a deterministic guard function selector to an implementation address
        mapping(bytes4 => address) guardLogic;

    }

    /**
     * @notice Get the FSM Storage slot
     *
     * @return fismoSlot - FSM storage slot cast to fismoSlot
     */
    function fismoSlot()
    internal
    pure
    returns (FismoSlot storage fismoSlot) {
        bytes4 position = FISMO_SLOT;
        assembly {
            fismoSlot.slot := position
        }
    }

    /**
     * @notice Set the current state for a given user in a given machine.
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the new state within the given machine
     */
    function setUserState(address _user, bytes4 _machineId, bytes4 _stateId)
    internal
    {
        // Get the storage slot
        FismoSlot fismoSlot = fismoSlot();

        // Store the user's new state in the given machine
        fismoSlot.userState[_user][_machineId] = _stateId;

        // Push user's current location onto their history stack
        fismoSlot.userHistory[_user].push(
            FismoTypes.Location(_machineId, _stateId)
        );
    }

    /**
     * @notice Set the current state for a given user in a given machine.
     *
     * @param _user - the address of the user
     * @param _machineId - the address of the user
     *
     * @return stateId - the user's current state in the given machine
     */
    function getUserState(address _user, bytes4 _machineId)
    internal
    returns (FismoTypes.State storage state)
    {
        // Get the storage slot
        FismoSlot fismoSlot = fismoSlot();

        // Get the current state of user in given FSM
        bytes4 currentStateId = fismoSlot.userState[_user][_machineId];

        // Get that state's index in the machine's states array
        uint256 index = fismoSlot.stateIndex[_machineId][currentStateId];

        // Return the state struct
        state = machine.states[index];

    }

    /**
     * @notice Get the last known machine and state ids for a given user
     *
     * @param _user - the address of the user
     */
    function getLastPosition(address _user)
    internal
    returns (FismoTypes.Position memory position)
    {
        // Get the storage slot
        FismoSlot fismoSlot = fismoSlot();

        // Get the user's position history
        FismoTypes.Position[] storage history = fismoSlot.userHistory[_user];

        // Return the last position on the stack
        bytes4 none = 0;
        position = (stack.length) ? history[history.length-1] : Position(none,none);

    }

    /**
     * @notice Get the entire position history for a given user
     *
     * @param _user - the address of the user
     */
    function getPositionHistory(address _user)
    internal
    returns (FismoTypes.Position[] storage history)
    {
        // Get the storage slot
        FismoSlot fismoSlot = fismoSlot();

        // Get the user's position history
        history = fismoSlot.userHistory[_user];

    }


}