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

        // Address of the contract owner
        address owner;

        // Address of the action initiator contract
        address actionInitiator;

        // Maps machine id to a machine struct
        //      machine id => Machine struct
        mapping(bytes4 => FismoTypes.Machine) machine;

        // Maps a machine id to a mapping of state id to index of state in machine's states array
        //      machine id  => ( state id => state index )
        mapping(bytes4 => mapping(bytes4 => uint256)) stateIndex;

        // Maps a wallet address to a an array of Position structs
        //      machine id  => ( state id => state index )
        mapping(address => FismoTypes.Position[]) userHistory;

        // Maps a wallet address to a mapping of machine id to user's current state in that machine
        //      wallet  => ( machine id => current state id )
        mapping(address => mapping(bytes4 => bytes4)) userState;

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
     * @notice Get a machine by id
     *
     * Reverts if machine does not exist
     *
     * @param _machineId - the id of the machine
     *
     * @return machine - the machine configuration
     */
    function getMachine(bytes4 _machineId)
    public
    returns (FismoTypes.Machine storage machine)
    {
        // Get the machine
        machine = fismoSlot().machine[_machineId];

        // Make sure machine exists
        require(machine.id == _machineId, "No such machine");
    }

    /**
     * @notice Get a state by machine id and state id
     *
     * Reverts if state does not exist
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     *
     * @return state - the state definition
     */
    function getState(bytes4 _machineId, bytes4 _stateId)
    public
    returns (FismoTypes.State storage state) {

        // Get the machine
        FismoTypes.Machine storage machine = getMachine(_machineId);

        // Get index of state in machine's states array
        uint256 index = fismoSlot().stateIndex[_machineId][_state.id];

        // Get the state
        state = machine.states[index];

        // Make sure state exists
        require(state.id == _state.id, "No such state");
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
        // Store the user's new state in the given machine
        fismoSlot().userState[_user][_machineId] = _stateId;

        // Push user's current location onto their history stack
        fismoSlot().userHistory[_user].push(
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
        // Get the current state of user in given FSM
        bytes4 currentStateId = fismoSlot().userState[_user][_machineId];

        // Get that state's index in the machine's states array
        uint256 index = fismoSlot().stateIndex[_machineId][currentStateId];

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
        // Get the user's position history
        FismoTypes.Position[] storage history = fismoSlot().userHistory[_user];

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
        // Get the user's position history
        history = fismoSlot().userHistory[_user];

    }

    /**
     * @notice Get the function selector for an enter or exit guard guard
     *
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     */
    function getGuardSelector(string storage _machineName, string storage _stateName, FismoTypes.Guard _guard)
    internal
    returns (bytes4 guardSelector)
    {
        // Compute unique function signature, e.g., machineName_exit_stateName(address _user)
        string memory guardType = (_guard == FismoTypes.Guard.Enter) ? "_enter_" : "_exit_";
        string memory guardSignature = strConcat(

            // function name
            strConcat(strConcat(_machineName, guardType), _stateName),

            // Arguments
            "(address _user)"

        );

        // Return th hashed function selector
        guardSelector = keccak256(guardSignature);
    }

    /**
     * @notice update
     */
    function updateStateGuards(FismoTypes.State state)
    internal
    {
        // Map deterministic enter guard function selector to implementation
        if (state.enterGuarded) {

            // determine enter guard function signature for state
            // N.B. machineName_enter_stateName(address _user)
            string memory enterGuardName = strConcat(
                strConcat(
                    strConcat(_machine.name,"_enter_"),
                    state.name
                ),
                "(address _user)"
            );

            // Map the entrance guard function selector to the address of the guard logic implementation for this state
            fismoSlot().guardLogic[keccak256(enterGuardName)] = state.guardLogic;

        }

        // Map deterministic exit guard function selector to implementation
        if (state.exitGuarded) {

            // determine exit guard function signature for state
            // Ex. keccak256 hash of: machineName_exit_stateName(address _user)
            bytes4 exitGuardSelector = getGuardSelector(_machine.name, state.name, Guard.Exit);

            // Map the exit guard function selector to the address of the guard logic implementation for this state
            fismoSlot().guardLogic[exitGuardSelector] = state.guardLogic;

        }

    }

}