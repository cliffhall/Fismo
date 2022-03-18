// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoView } from "./FismoView.sol";

/**
 * @title FismoControl
 *
 * @notice Fismo access control
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoAccess is FismoView {

    modifier onlyOwner() {
        require(msg.sender == getStore().owner, ONLY_OWNER);
        _;
    }

    modifier onlyOperator(bytes4 _machineId) {
        Machine storage machine = getMachine(_machineId);
        require(msg.sender == machine.operator, ONLY_OPERATOR);
        _;
    }

}