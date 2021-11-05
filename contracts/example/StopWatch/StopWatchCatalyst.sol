// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IFismo } from "../../interfaces/IFismo.sol";
import { FismoTypes } from "../../domain/FismoTypes.sol";

/**
 * @title StopWatchCatalyst
 *
 * In this most basic example, anyone can initiate actions
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract StopWatchCatalyst {

    IFismo internal fismo;

    /**
     * @notice Constructor
     *
     * @param _fismo - address of the Fismo contract
     */
    constructor(address _fismo) {
        fismo = IFismo(_fismo);
    }

    /**
     * Invoke a Fismo action
     *
     * @param _machineId - the id of the target FSM
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(bytes4 _machineId, bytes4 _actionId)
    external
    returns(FismoTypes.ActionResponse memory response) {
        response = fismo.invokeAction(msg.sender, _machineId, _actionId);
    }

}