// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";

import { FismoStore } from "./FismoStore.sol";
import { FismoTools } from "./FismoTools.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";
import { IFismoView } from "../interface/IFismoView.sol";
import { IFismoUpdate } from "../interface/IFismoUpdate.sol";
import { IFismoOperate } from "../interface/IFismoOperate.sol";

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
     * Reverts if
     * - guard logic implementation is not defined
     *
     * @param _functionSelector - the keck
     * @return guardAddress - the address of the guard logic implementation contract
     */
    function getGuardAddress(bytes4 _functionSelector)
    public
    view
    override
    returns (address guardAddress)
    {
        guardAddress = getStore().guardLogic[_functionSelector];
        require(guardAddress != address(0), "Guard does not exist");
    }

    /**
     * @notice Get the last known machine and state ids for a given user
     *
     * TODO: Test transfer of struct from storage to memory
     *
     * @param _user - the address of the user
     * @return position - the last recorded position of the given user
     */
    function getLastPosition(address _user)
    public
    view
    override
    returns (Position memory position)
    {
        // Get the user's position historyCF
        Position[] storage history = getStore().userHistory[_user];

        // Return the last position on the stack
        bytes4 none = 0;
        position = (history.length > 0) ? history[history.length-1] : Position(none, none);
    }

    /**
     * @notice Get the entire position history for a given user
     *
     * TODO: Test transfer of struct array from storage to memory
     *
     * @param _user - the address of the user
     */
    function getPositionHistory(address _user)
    public
    view
    returns (Position[] memory history)
    {
        // Get the user's position history
        history = getStore().userHistory[_user];
    }

    /**
     * @notice Get the current state for a given user in a given machine.
     *
     * Reverts if:
     * - machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the address of the user
     *
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
     * - machine does not exist
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
        require(machine.id == _machineId, "No such machine");
    }

    /**
     * @notice Get a state by machine id and state id
     *
     * Reverts if
     * - state does not exist
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
        require(state.id == _stateId, "No such state");
    }

    /**
     * @notice Get a state's index in machine's states array
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
     * @notice Get the Fismo storage slot
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