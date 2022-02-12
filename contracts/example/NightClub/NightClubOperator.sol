// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import { IFismoOperate } from "../../interface/IFismoOperate.sol";
import { NightClubConstants } from "./NightClubConstants.sol";
import { FismoTypes } from "../../domain/FismoTypes.sol";

/**
 * @title NightClubOperator
 *
 * N.B. This is only an example a few ways that a Operator can control access
 * to Fismo machines.
 *
 * In this example, the user is either
 * - A VIP, who gets in the door for free
 * - A pleb, who has to pay a fee at the door
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract NightClubOperator is NightClubConstants, AccessControl {

    IFismoOperate internal fismo;

    /**
     * @notice Constructor
     *
     * Grants ADMIN role to deployer.
     * Sets ADMIN as role admin for all other roles.
     */
    constructor(address _fismo) {
        fismo = IFismoOperate(_fismo);
        _setupRole(ADMIN, msg.sender);
        _setRoleAdmin(ADMIN, ADMIN);
        _setRoleAdmin(VIP, ADMIN);
    }

    /**
     * Invoke a Fismo action, only if they have VIP role.
     *
     * Reverts if caller does not have the VIP role.
     *
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     */
    function invokeActionVIP(bytes4 _machineId, bytes4 _actionId)
    external
    onlyRole(VIP)
    returns(FismoTypes.ActionResponse memory response) {
        response = fismo.invokeAction(msg.sender, _machineId, _actionId);
    }

    /**
     * Invoke an action on a configured machine
     *
     * Reverts if caller hasn't sent the fee
     *
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     */
    function invokeActionPleb(bytes4 _machineId, bytes4 _actionId)
    external
    payable
    returns(FismoTypes.ActionResponse memory response) {
        require(msg.value == DOOR_FEE, "Send the fee");
        response = fismo.invokeAction(msg.sender, _machineId, _actionId);
    }

}