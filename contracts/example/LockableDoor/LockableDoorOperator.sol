// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IFismoOperate } from "../../interface/IFismoOperate.sol";
import { FismoTypes } from "../../domain/FismoTypes.sol";

/**
 * @title LockableDoorOperator
 *
 * In this basic example, anyone can initiate actions
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract LockableDoorOperator {

    IFismoOperate internal fismo;

    /**
     * @notice Constructor
     *
     * @param _fismo - address of the Fismo contract
     */
    constructor(address _fismo) {
        fismo = IFismoOperate(_fismo);
    }

    /**
     * Invoke a Fismo action
     *
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     *
     * @return response - the response message. see {FismoTypes.ActionResponse}
     */
    function invokeAction(bytes4 _machineId, bytes4 _actionId)
    external
    returns (FismoTypes.ActionResponse memory response) {

        response = fismo.invokeAction(msg.sender, _machineId, _actionId);

    }

}