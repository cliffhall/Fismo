// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title IFismoClone
 *
 * @notice Create and initialize a Fismo clone
 * The ERC-165 identifier for this interface is 0x08a9f5ec
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoClone {

    /// Emitted when a user clones the Fismo contract
    event FismoCloned(
        address indexed owner,
        address indexed instance
    );

    /**
     * @notice Initialize this Fismo instance.
     *
     * Reverts if:
     * - Owner is not zero address
     *
     * Note:
     * Must be external to be called from the Fismo factory.
     *
     * @param _owner - the owner of the cloned Fismo instance
     */
    function init(address _owner) external;


    /**
     * @notice Deploys and returns the address of a Fismo clone.
     *
     * Emits:
     * - FismoCloned
     *
     * @return instance - the address of the Fismo clone instance
     */
    function cloneFismo() external returns (address instance);

}