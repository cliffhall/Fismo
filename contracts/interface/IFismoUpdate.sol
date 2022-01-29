// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title IFismoUpdate
 *
 * Interface for Fismo update functions
 * The ERC-165 identifier for this interface is 0x284a083c. // TODO: recalc
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoUpdate {

    /**
     * @notice Add a new Machine
     *
     * Reverts if
     * - operator address is zero
     * - machine id is not valid
     * - machine id already exists
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(FismoTypes.Machine memory _machine)
    external;

    /**
     * @notice Add a state to an existing Machine
     *
     * Reverts if
     * - state id is invalid
     * - machine does not exist
     * - any contained transition is invalid
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to add to the machine
     */
    function addState(bytes4 _machineId, FismoTypes.State memory _state)
    external;

    /**
     * @notice Update an existing state to an existing machine
     *
     * State name / id cannot be changed.
     *
     * Reverts if:
     * - machine does not exist
     * - state does not exist
     * - state id is invalid
     * - any contained transition is invalid
     *
     * Use this when:
     * - adding more than one transition
     * - removing one or more transitions
     * - changing exitGuarded and/or enterGuarded
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to update
     */
    function updateState(bytes4 _machineId, FismoTypes.State memory _state)
    external;

    /**
     * @notice Add a transition to an existing state of an existing machine
     *
     * Reverts if:
     * - machine does not exist
     * - state does not exist
     * - transition id is invalid
     * - any contained transition is invalid
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _transition - the transition to add to the state
     */
    function addTransition(bytes4 _machineId, bytes4 _stateId, FismoTypes.Transition memory _transition)
    external;

}