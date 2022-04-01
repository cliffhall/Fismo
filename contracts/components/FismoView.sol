// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoStore } from "../domain/FismoStore.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";
import { FismoConstants } from "../domain/FismoConstants.sol";
import { IFismoClone } from "../interfaces/IFismoClone.sol";
import { IFismoView } from "../interfaces/IFismoView.sol";
import { FismoSupport } from "./FismoSupport.sol";

/**
 * @title FismoView
 *
 * @notice Fismo storage read functionality
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoView is IFismoView, FismoTypes, FismoConstants {

    /**
     * @notice Get the implementation address for a given guard selector
     *
     * @param _functionSelector - the bytes4 sighash of function signature
     * @return guardAddress - the address of the guard logic implementation contract
     */
    function getGuardAddress(bytes4 _functionSelector)
    public
    view
    override
    returns (address guardAddress)
    {
        guardAddress = getStore().guardLogic[_functionSelector];
    }

    /**
     * @notice Get the last recorded position of the given user.
     *
     * Each position contains a machine id and state id.
     * See: {FismoTypes.Position}
     *
     * @param _user - the address of the user
     * @return success - whether any positions have been recorded for the user
     * @return position - the last recorded position of the given user
     */
    function getLastPosition(address _user)
    public
    view
    override
    returns (bool success, Position memory position)
    {
        // Get the user's position historyCF
        Position[] storage history = getStore().userHistory[_user];

        // Return the last position on the stack
        bytes4 none = 0;
        position = (history.length > 0) ? history[history.length-1] : Position(none, none);

        // If the machine id is zero, the user has not interacted with this Fismo instance
        success = (position.machineId != 0);
    }

    /**
     * @notice Get the entire position history for a given user
     *
     * Each position contains a machine id and state id.
     * See: {FismoTypes.Position}
     *
     * @param _user - the address of the user
     * @return success - whether any history exists for the user
     * @return history - an array of Position structs
     */
    function getPositionHistory(address _user)
    public
    view
    returns (bool success, Position[] memory history)
    {
        // Return the user's position history
        history = getStore().userHistory[_user];

        // If there are no history entries, the user has not interacted with this Fismo instance
        success = history.length > 0;
    }

    /**
     * @notice Get the current state for a given user in a given machine.
     *
     * Note:
     * - If the user has not interacted with the machine, the initial state
     *   for the machine is returned.
     *
     * Reverts if:
     * - machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @return state - the user's current state in the given machine. See {FismoTypes.State}
     */
    function getUserState(address _user, bytes4 _machineId)
    external
    view
    override
    returns (State memory state)
    {
        // Get the user's current state in the given machine
        bytes4 currentStateId = getUserStateId(_user, _machineId);

        // Get the state
        state = getState(_machineId, currentStateId, true);
    }

    /**
     * @notice Get a machine by id
     *
     * Reverts if
     * - Machine does not exist
     *
     * @param _machineId - the id of the machine
     * @return machine - the machine configuration
     */
    function getMachine(bytes4 _machineId)
    internal
    view
    returns (Machine storage machine)
    {
        // Get the machine
        machine = getStore().machine[_machineId];

        // Make sure machine exists
        require(machine.id == _machineId, NO_SUCH_MACHINE);
    }

    /**
     * @notice Get a state by Machine id and State id.
     *
     * Reverts if
     * - _verify is true and State does not exist
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _shouldExist - true if the state should already exist
     * @return state - the state definition
     */
    function getState(bytes4 _machineId, bytes4 _stateId, bool _shouldExist)
    internal
    view
    returns (State storage state) {

        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get index of state in machine's states array
        uint256 index = getStateIndex(_machineId, _stateId);

        // Get the state
        state = machine.states[index];

        // Verify expected existence or non-existence of State
        if (_shouldExist) {
            require(state.id == _stateId, NO_SUCH_STATE);
        } else {
            require(state.id == 0, STATE_EXISTS);
        }
    }

    /**
     * @notice Get a State's index in Machine's states array.
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     *
     * @return index - the state's index in the machine's states array
     */
    function getStateIndex(bytes4 _machineId, bytes4 _stateId)
    internal
    view
    returns(uint256 index)
    {
        index = getStore().stateIndex[_machineId][_stateId];
    }

    /**
 * @notice Get the current state for a given user in a given machine.
     *
     * Note:
     * - If the user has not interacted with the machine, the initial state
     *   for the machine is returned.
     *
     * Reverts if:
     * - machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @return currentStateId - the user's current state id in the given machine.
     */
    function getUserStateId(address _user, bytes4 _machineId)
    internal
    view
    returns (bytes4 currentStateId)
    {
        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get the user's current state in the given machine, default to initialStateId if not found
        currentStateId = getStore().userState[_user][_machineId];
        if (currentStateId == bytes4(0)) currentStateId = machine.initialStateId;

    }


    /**
     * @notice Get the function signature for an enter or exit guard guard
     *
     * e.g.,
     * `NightClub_Dancefloor_Enter(address _user, string memory _priorStateName)`
     *
     * @param _machineName - the name of the machine, e.g., `NightClub`
     * @param _stateName - the name of the state, e.g., `Dancefloor`
     * @param _guard - the type of guard (enter/exit). See {FismoTypes.Guard}
     *
     * @return guardSignature - a string representation of the function signature
     */
    function getGuardSignature(string memory _machineName, string memory _stateName, Guard _guard)
    internal
    pure
    returns (string memory guardSignature) {
        string memory guardType = (_guard == Guard.Enter) ? "_Enter" : "_Exit";
        string memory functionName = strConcat(
            strConcat(
                strConcat(_machineName, "_"),
                _stateName
            ),
            guardType
        );

        // Construct signature
        guardSignature = strConcat(functionName, "(address,string)");
    }

    /**
     * @notice Get the function selector for an enter or exit guard guard
     *
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the type of guard (enter/exit). See {FismoTypes.Guard}
     *
     * @return guardSelector - the function selector, e.g., `0x23b872dd`
     */
    function getGuardSelector(string memory _machineName, string memory _stateName, Guard _guard)
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

    /**
     * @notice Hash a name into a bytes4 id
     *
     * @param _name a string to hash
     *
     * @return id bytes4 sighash of _name
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
     * @notice Get the Fismo storage slot.
     *
     * @return Fismo storage slot
     */
    function getStore()
    internal
    pure
    returns (FismoStore.FismoSlot storage)
    {
        return FismoStore.getStore();
    }

}