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

        // Maps a user's wallet address to a mapping of FSM id to current state
        //      wallet  => ( fsm id => current state id )
        mapping(address => mapping(bytes32 => bytes32)) userStates;

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

    function setUserState(address _user, bytes32 _fsmId, bytes32 _currentState) internal {
        FSMStorage fsms = fsmStorage();

        fsms[_user][_fsmId] = _currentState;
    }

}
