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

    bytes32 internal constant FISMO_SLOT = keccak256("fismo.storage.slot");

    struct FismoSlot {

        // Address of the contract owner
        address owner;

        // Address of the action initiator contract
        address actionInitiator;

        // Maps a deterministic guard function selector to an implementation address
        mapping(bytes4 => address) guardLogic;

        // Maps machine id to a machine struct
        //      machine id => Machine struct
        mapping(bytes4 => FismoTypes.Machine) machine;

        // Maps a machine id to a mapping of a state id to the index of that state in the machine's states array
        //  machine id =>     ( state id => state index )
        mapping(bytes4 => mapping(bytes4 => uint256)) stateIndex;

        // Maps a user's address to a mapping of a machine id to the user's current state in that machine
        //  user wallet =>   ( machine id => current state id )
        mapping(address => mapping(bytes4 => bytes4)) userState;

        // Maps a user's address to a an array of Position structs, accumulated over time
        //  user wallet => array of Positions
        mapping(address => FismoTypes.Position[]) userHistory;

    }

    /**
     * @notice Get the Fismo storage slot
     *
     * @return fismoStorage - Fismo storage slot
     */
    function fismoSlot()
    internal
    pure
    returns (FismoSlot storage fismoStorage)
    {
        bytes32 position = FISMO_SLOT;
        assembly {
            fismoStorage.slot := position
        }
    }

    /**
     * @notice Configure approved access
     *
     * @param _owner - the contract owner
     * @param _actionInitiator - the approved action initiator address
     */
    function configureAccess(address _owner, address _actionInitiator)
    internal
    {
        fismoSlot().actionInitiator = _actionInitiator;
        fismoSlot().owner = _owner;
    }

    /**
     * @notice Hash a name into a bytes4 id
     *
     */
    function nameToId(string memory _name)
    internal
    pure
    returns
    (bytes4 id)
    {
        id = bytes4(keccak256(bytes(_name)));
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
    internal
    view
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
    internal
    view
    returns (FismoTypes.State storage state) {

        // Get the machine
        FismoTypes.Machine storage machine = getMachine(_machineId);

        // Get index of state in machine's states array
        uint256 index = getStateIndex(_machineId, _stateId);

        // Get the state
        state = machine.states[index];

        // Make sure state exists
        require(state.id == _stateId, "No such state");
    }

    /**
     * @notice Map a state's index in machine's states array
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     * @param _index - the index of the state within the array
     */
    function mapStateIndex(bytes4 _machineId, bytes4 _stateId, uint256 _index)
    internal
    {
        // Add mapping: machine id => state id => states array index
        fismoSlot().stateIndex[_machineId][_stateId] = _index;
    }

    /**
     * @notice Get a state's index in machine's states array
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     */
    function getStateIndex(bytes4 _machineId, bytes4 _stateId)
    internal
    view
    returns(uint256 index)
    {
        index = fismoSlot().stateIndex[_machineId][_stateId];
    }

    /**
     * @notice Get the function signature for an enter or exit guard guard
     *
     * @param _machineName - the name of the machine, e.g., `NightClub`
     * @param _stateName - the name of the state, e.g., `VIP_Lounge`
     * @param _guard - the type of guard (enter/exit). See {FismoTypes.Guard}
     * @return guardSignature - a string representation of the function signature
     * e.g.,
     * `Nightclub_VIP_Lounge_Enter(address _user, string memory priorStateName)`
     */
    function getGuardSignature(string memory _machineName, string memory _stateName, FismoTypes.Guard _guard)
    internal
    pure
    returns (string memory guardSignature) {
        string memory guardType = (_guard == FismoTypes.Guard.Enter) ? "_Enter" : "_Exit";
        string memory functionName = strConcat(strConcat(_machineName, _stateName), guardType);
        string memory functionParams = strConcat(
            "(address _user, string ",
            (_guard == FismoTypes.Guard.Enter)
            ? "_priorStateName)"
            : "_nextStateName)"
        );

        guardSignature = strConcat(functionName, functionParams);
    }

    /**
     * @notice Get the function selector for an enter or exit guard guard
     *
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the type of guard (enter/exit). See {FismoTypes.Guard}
     * @return guardSelector - the function selector, e.g., `0x23b872dd`
     */
    function getGuardSelector(string memory _machineName, string memory _stateName, FismoTypes.Guard _guard)
    internal
    pure
    returns (bytes4 guardSelector)
    {
        // Get the signature
        string memory guardSignature = getGuardSignature(_machineName, _stateName, _guard);

        // Return the hashed function selector
        guardSelector = nameToId(guardSignature);
    }

    /**
     * @notice Get the implementation address for a given guard selector
     *
     * Reverts if guard logic implementation is not defined
     *
     * @param _functionSelector - the keck
     * @return guardAddress - the address of the guard logic implementation contract
     */
    function getGuardAddress(bytes4 _functionSelector)
    internal
    view
    returns (address guardAddress)
    {
        guardAddress = fismoSlot().guardLogic[_functionSelector];
        require(guardAddress != address(0), "Guard logic implementation does not exist");
    }

    /**
     * @notice Update state guards
     *
     */
    function updateStateGuards(FismoTypes.Machine memory _machine, FismoTypes.State memory _state)
    internal
    {
        // determine enter guard function signature for state
        // Ex. keccak256 hash of: machineName_enter_stateName(address _user)
        bytes4 enterGuardSelector = getGuardSelector(_machine.name, _state.name, FismoTypes.Guard.Enter);

        // Map the enter guard function selector to the address of the guard logic implementation for this state
        fismoSlot().guardLogic[enterGuardSelector] = (_state.enterGuarded) ? _state.guardLogic : address(0);

        // determine exit guard function signature for state
        // Ex. keccak256 hash of: machineName_exit_stateName(address _user)
        bytes4 exitGuardSelector = getGuardSelector(_machine.name, _state.name, FismoTypes.Guard.Exit);

        // Map the exit guard function selector to the address of the guard logic implementation for this state
        fismoSlot().guardLogic[exitGuardSelector] = (_state.exitGuarded) ?  _state.guardLogic : address(0);
    }

    /**
     * @notice Set the current state for a given user in a given machine.
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     */
    function setUserState(address _user, bytes4 _machineId, bytes4 _stateId)
    internal
    {
        // Store the user's new state in the given machine
        fismoSlot().userState[_user][_machineId] = _stateId;

        // Push user's current location onto their history stack
        fismoSlot().userHistory[_user].push(
            FismoTypes.Position(_machineId, _stateId)
        );
    }

    /**
     * @notice Set the current state for a given user in a given machine.
     *
     * @param _user - the address of the user
     * @param _machineId - the address of the user
     *
     * @return state - the user's current state in the given machine
     */
    function getUserState(address _user, bytes4 _machineId)
    internal
    view
    returns (FismoTypes.State storage state)
    {
        // Get the current state of user in given FSM
        bytes4 currentStateId = fismoSlot().userState[_user][_machineId];

        // Get that state's index in the machine's states array
        uint256 index = fismoSlot().stateIndex[_machineId][currentStateId];

        // Get the machine
        FismoTypes.Machine storage machine = getMachine(_machineId);

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
    view
    returns (FismoTypes.Position memory position)
    {
        // Get the user's position history
        FismoTypes.Position[] storage history = fismoSlot().userHistory[_user];

        // Return the last position on the stack
        bytes4 none = 0;
        position = (history.length > 0) ? history[history.length-1] : FismoTypes.Position(none, none);
    }

    /**
     * @notice Get the entire position history for a given user
     *
     * @param _user - the address of the user
     */
    function getPositionHistory(address _user)
    internal
    view
    returns (FismoTypes.Position[] storage history)
    {
        // Get the user's position history
        history = fismoSlot().userHistory[_user];
    }

    /**
     * @notice Concatenate two strings
     * @param _a the first string
     * @param _b the second string
     * @return result the concatenation of `_a` and `_b`
     */
    function strConcat(string memory _a, string memory _b)
    internal
    pure
    returns(string memory result)
    {
        result = string(abi.encodePacked(bytes(_a), bytes(_b)));
    }

}