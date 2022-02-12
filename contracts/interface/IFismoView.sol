// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title IFismoView
 *
 * Interface for Fismo view functions
 * The ERC-165 identifier for this interface is 0x284a083c. // TODO: recalc
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoView is IERC165 {

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
    external
    view
    returns (address guardAddress);

    /**
     * @notice Get the last known machine and state ids for a given user
     *
     * @param _user - the address of the user
     * @return position - the last recorded position of the given user
     */
    function getLastPosition(address _user)
    external
    view
    returns (FismoTypes.Position memory position);

    /**
     * @notice Get the current state for a given user in a given machine.
     *
     * Reverts if:
     * - machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the address of the user
     * @return currentStateId - the user's current state in the given machine
     */
    function getUserState(address _user, bytes4 _machineId)
    external
    view
    returns (bytes4 currentStateId);

}