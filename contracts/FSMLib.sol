// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FSMTypes } from "./domain/FSMTypes.sol";

/**
 * @title FSMLib
 *
 * @notice FSM configuration storage
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
library FSMLib {

    bytes32 constant FSM_STORAGE_POSITION = keccak256("fsm.storage");

    struct FSMStorage {

        // Address of the action initiator
        address actionInitiator;

        // Maps machine id to a machine struct
        mapping(bytes32 => FSMTypes.Machine) machines;

        // Maps machine id to a current state id
        mapping(bytes23 => bytes32) machineStates;

    }

    /**
     * @notice Get the FSM Storage slot
     *
     * @return fsms - FSM storage slot cast to FSMStorage
     */
    function fsmStorage() internal pure returns (FSMStorage storage fsms) {
        bytes32 position = FSM_STORAGE_POSITION;
        assembly {
            fsms.slot := position
        }
    }

}
