// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title FismoStore
 *
 * @notice Fismo storage slot configuration and accessor
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
library FismoStore {

    bytes32 internal constant FISMO_SLOT = keccak256("fismo.storage.slot");

    struct FismoSlot {

        // Address of the contract owner
        address owner;

        // Maps a deterministic guard function selector to an implementation address
        mapping(bytes4 => address) guardLogic;

        // Maps machine id to a machine struct
        //      machine id => Machine struct
        mapping(bytes4 => FismoTypes.Machine) machine;

        // Maps a machine id to a mapping of a state id to the index of that state in the machine's states array
        //  machine id =>     ( state id => state index )
        mapping(bytes4 => mapping(bytes4 => uint256)) stateIndex;

        // Maps a user's address to a mapping of a machine id to the user's current state in that machine
        //  user wallet =>   ( machine id => current state id )
        mapping(address => mapping(bytes4 => bytes4)) userState;

        // Maps a user's address to a an array of Position structs, accumulated over time
        //  user wallet => array of Positions
        mapping(address => FismoTypes.Position[]) userHistory;

    }

    /**
     * @notice Get the Fismo storage slot
     *
     * @return fismoStore - Fismo storage slot
     */
    function getStore()
    internal
    pure
    returns (FismoSlot storage fismoStore)
    {
        bytes32 position = FISMO_SLOT;
        assembly {
            fismoStore.slot := position
        }
    }

}