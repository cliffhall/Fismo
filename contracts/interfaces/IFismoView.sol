// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title IFismoView
 *
 * Interface for Fismo view functions
 * The ERC-165 identifier for this interface is 0xaf1a49fa
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoView is IERC165 {

    /**
     * @notice Get the owner of this Fismo contract
     *
     * @return owner - the address of the contract owner
     */
    function getOwner()
    external
    view
    returns (address owner);

    /**
     * @notice Get the implementation address for a given guard selector
     *
     * Reverts if
     * - guard logic implementation is not defined
     *
     * @param _functionSelector - the bytes4 sighash of function signature
     * @return guardAddress - the address of the guard logic implementation contract
     */
    function getGuardAddress(bytes4 _functionSelector)
    external
    view
    returns (address guardAddress);

    /**
     * @notice Get the last recorded position of the given user.
     *
     * Positions contain a machine id and state id.
     * See: {FismoTypes.Position}
     *
     * @param _user - the address of the user
     * @return success - whether any positions have been recorded for the user
     * @return position - the last recorded position of the given user
     */
    function getLastPosition(address _user)
    external
    view
    returns (bool success, FismoTypes.Position memory position);

    /**
     * @notice Get the entire position history for a given user.
     *
     * Each Position contains a machine id and state id.
     * See: {FismoTypes.Position}
     *
     * @param _user - the address of the user
     * @return success - whether any history exists for the user
     * @return history - an array of Position structs
     */
    function getPositionHistory(address _user)
    external
    view
    returns (bool success, FismoTypes.Position[] memory history);

    /**
     * @notice Get the current state for a given user in a given machine.
     *
     * Note:
     * - If the user has not interacted with the machine, the initial state
     *   for the machine is returned.
     *
     * Reverts if:
     * - Machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @return currentStateId - the user's current state in the given machine
     */
    function getUserState(address _user, bytes4 _machineId)
    external
    view
    returns (bytes4 currentStateId);

}