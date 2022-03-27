// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoStore } from "../domain/FismoStore.sol";

import { IFismoClone } from "../interfaces/IFismoClone.sol";

import { FismoOperate } from "./FismoOperate.sol";

/**
 * @title FismoClone
 *
 * Create and initialize a Fismo clone
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoClone is IFismoClone, FismoOperate  {

    /**
     * @notice Initialize a cloned Fismo instance.
     *
     * Reverts if:
     * - Owner is not zero address
     *
     * Note:
     * - Must be external to be called from the Fismo factory.
     *
     * @param _owner - the owner of the cloned Fismo instance
     */
    function init(address _owner)
    external
    override
    {
        address owner = getStore().owner;
        require(owner == address(0), ALREADY_INITIALIZED);
        setOwner(_owner);
        setIsFismo(false);
    }

    function cloneFismo()
    external
    override
    returns (address instance)
    {
        // Make sure this isn't a clone
        require(getStore().isFismo, MULTIPLICITY);

        // Clone the contract
        instance = clone();

        // Initialize the clone
        IFismoClone(instance).init(msg.sender);

        // Notify watchers of state change
        emit FismoCloned(msg.sender, instance);
    }

    /**
     * @dev Deploys and returns the address of a Fismo clone
     *
     * Note:
     * - This function uses the create opcode, which should never revert.
     *
     * @return instance - the address of the Fismo clone
     */
    function clone()
    internal
    returns (address instance) {

        // Clone this contract
        address implementation = address(this);

        // solhint-disable-next-line no-inline-assembly
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(0x60, implementation))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            instance := create(0, ptr, 0x37)
        }
        require(instance != address(0), "ERC1167: create failed");
    }

}