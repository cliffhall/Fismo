// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoView } from "./FismoView.sol";
import { IFismoOwner } from "../interfaces/IFismoOwner.sol";

/**
 * @title FismoOwner
 *
 * @notice Fismo ownership functionality
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoOwner is IFismoOwner, FismoView {

    /**
     * @notice Modifier to only allow a method to bre called by the contract owner
     */
    modifier onlyOwner() {
        require(msg.sender == getStore().owner, ONLY_OWNER);
        _;
    }

    /**
     * @notice Get the owner of this Fismo contract
     *
     * @return the address of the contract owner
     */
    function owner()
    external
    view
    returns (address)
    {
        return getStore().owner;
    }

    /**
     * @notice Transfer ownership of the Fismo instance to another address.
     *
     * Reverts if:
     * - Caller is not contract owner
     * - New owner is zero address
     *
     * Emits:
     * - OwnershipTransferred
     *
     * @param _newOwner - the new owner's address
     */
    function transferOwnership(address _newOwner)
    external
    override
    onlyOwner
    {
        require(_newOwner != address(0), INVALID_ADDRESS);
        setOwner(_newOwner);
    }

    /**
     * @notice Set the contract owner
     *
     * Emits:
     * - OwnershipTransferred
     *
     * Used by
     * - Fismo constructor
     * - FismoClone.cloneFismo method
     * - FismoOwner.transferOwnership method
     *
     * @param _newOwner - the new contract owner address
     */
    function setOwner(address _newOwner)
    internal
    {
        address previousOwner = getStore().owner;
        getStore().owner = _newOwner;
        emit OwnershipTransferred(previousOwner, _newOwner);
    }

}