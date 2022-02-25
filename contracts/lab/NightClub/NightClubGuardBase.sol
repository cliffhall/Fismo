// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/IAccessControl.sol";
import { NightClubLib } from "./NightClubLib.sol";
import { NightClubConstants } from "./NightClubConstants.sol";
import "./NightClubOperator.sol";

/**
 * @notice Base functions for guards
 */
contract NightClubGuardBase is NightClubConstants {

    /**
     * Does the given user have the VIP role?
     *
     * @param _user - the address to check
     * @return isVIP - true if _user has VIP role
     */
    function isVIP(address _user)
    internal
    view
    returns (bool)
    {
        // N.B. msg.sender is NightClubOperator, which implements IAccessControl
        return IAccessControl(msg.sender).hasRole(VIP, _user);
    }

    /**
     * @notice Compare two strings
     */
    function compare(string memory a, string memory b)
    internal
    pure
    returns
    (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

}