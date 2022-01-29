// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoView } from "./FismoView.sol";
import { FismoStore } from "./FismoStore.sol";
import { FismoEvents } from "../domain/FismoEvents.sol";

/**
 * @title FismoControl
 *
 * @notice Fismo access control
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoAccess is FismoView {

    modifier onlyOwner() {
        require(msg.sender == FismoStore.getStore().owner, "Only owner may call");
        _;
    }

    modifier onlyOperator(bytes4 _machineId) {
        Machine storage machine = getMachine(_machineId);
        require(msg.sender == machine.operator, "Only operator may call");
        _;
    }

}