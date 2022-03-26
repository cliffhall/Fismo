// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

/**
 * @title IFismoOwner
 *
 * @notice ERC-173 Contract Ownership Standard
 * The ERC-165 identifier for this interface is 0x7f5828d0
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoOwner {

    /// Emitted when ownership of the Fismo instance is transferred
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @notice Get the address of the owner
     *
     * @return The address of the owner.
     */
    function owner() view external returns(address);

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
    function transferOwnership (
        address _newOwner
    )
    external;

}