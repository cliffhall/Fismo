// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";

import { FismoStore } from "./FismoStore.sol";
import { FismoTools } from "./FismoTools.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";
import { IFismoView } from "../interfaces/IFismoView.sol";
import { IFismoUpdate } from "../interfaces/IFismoUpdate.sol";
import { IFismoOperate } from "../interfaces/IFismoOperate.sol";
import { console } from "hardhat/console.sol";

/**
 * @title FismoView
 *
 * @notice Fismo storage read functionality
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoView is IFismoView, FismoTools {

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
     * @return currentStateId - the user's current state in the given machine
     */
    function getUserState(address _user, bytes4 _machineId)
    public
    view
    override
    returns (bytes4 currentStateId)
    {
        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get the user's current state in the given machine, default to initialStateId if not found
        currentStateId = getStore().userState[_user][_machineId];
        if (currentStateId == bytes4(0)) currentStateId = machine.initialStateId;

    }

    /**
     * @notice Onboard implementation of ERC-165 interface detection standard.
     *
     * @param _interfaceId - the sighash of the given interface
     *
     * @return true if _interfaceId is supported
     */
    function supportsInterface(bytes4 _interfaceId)
    external
    pure
    override
    returns (bool)
    {
        return (
        _interfaceId == type(IERC165).interfaceId ||
        _interfaceId == type(IFismoOperate).interfaceId ||
        _interfaceId == type(IFismoUpdate).interfaceId ||
        _interfaceId == type(IFismoView).interfaceId
        ) ;
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
     * - State does not exist
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @return state - the state definition
     */
    function getState(bytes4 _machineId, bytes4 _stateId)
    internal
    view
    returns (State storage state) {

        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get index of state in machine's states array
        uint256 index = getStateIndex(_machineId, _stateId);

        // Get the state
        state = machine.states[index];

        // Make sure state exists
        require(state.id == _stateId, NO_SUCH_STATE);
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