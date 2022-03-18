// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoUpdate } from "./FismoUpdate.sol";
import { IFismoOperate } from "../interfaces/IFismoOperate.sol";

/**
 * @title FismoOperate
 *
 * Operate Fismo state machines
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoOperate is IFismoOperate, FismoUpdate  {

    /**
     * Invoke an action on a configured Machine.
     *
     * Emits:
     * - UserTransitioned
     *
     * Reverts if:
     * - Caller is not the machine's operator
     * - Machine does not exist
     * - Action is not valid for the user's current State in the given Machine
     * - any invoked Guard logic reverts
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(
        address _user,
        bytes4 _machineId,
        bytes4 _actionId
    )
    external
    override
    onlyOperator(_machineId)
    returns(ActionResponse memory response)
    {
        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get the user's current state id in the machine
        bytes4 currentStateId = getUserState(_user, _machineId);

        // Get that state's index in the machine's states array
        uint256 index = getStateIndex(_machineId, currentStateId);

        // Get the state
        State storage state = machine.states[index];

        // Find the transition triggered by the given action
        Transition memory transition;
        bool valid = false;
        for (uint32 i = 0; i < state.transitions.length; i++) {
            if (state.transitions[i].actionId == _actionId) {
                valid = true;
                transition = state.transitions[i];
                break;
            }
        }

        // Make sure transition was found
        require(valid == true, NO_SUCH_ACTION);

        // Get the next state
        State storage nextState = getState(_machineId, transition.targetStateId, true);

        // Create the action response
        response.machineName = machine.name;
        response.action = transition.action;
        response.priorStateName = state.name;
        response.nextStateName = nextState.name;

        // if there is exit guard logic for the current state, call it
        if (state.exitGuarded) {
            response.exitMessage = invokeGuard(_user, machine.name, state.name, Guard.Exit);
        }

        // if there is enter guard logic for the next state, call it
        if (nextState.enterGuarded) {
            response.enterMessage = invokeGuard(_user, machine.name, nextState.name, Guard.Enter);
        }

        // if we made it this far, set the new state
        setUserState(_user, _machineId, nextState.id);

        // Alert listeners to change of state
        emit UserTransitioned(_user, _machineId, nextState.id, response);

    }

    /**
     * @notice Make a delegatecall to the specified guard function
     *
     * Reverts if:
     * - guard logic implementation is not defined
     * - guard logic reverts
     * - delegatecall attempt fails for any other reason
     *
     * @param _user - the user address the call is being invoked for
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the guard type (enter/exit) See: {Guard}
     *
     * @return guardResponse - the message (if any) returned from the guard
     */
    function invokeGuard(
        address _user,
        string memory _machineName,
        string memory _stateName,
        Guard _guard
    )
    internal
    returns (string memory guardResponse)
    {
        // Get the function selector and encode the call
        bytes4 selector = getGuardSelector(_machineName, _stateName, _guard);
        bytes memory guardCall = abi.encodeWithSelector(
            selector,
            _user,
            _stateName
        );

        // Get the guard implementation address
        address guardAddress = getGuardAddress(selector);
        require(guardAddress != address(0), NO_SUCH_GUARD);

        // Invoke the guard
        (bool success, bytes memory response) = guardAddress.delegatecall(guardCall);

        // if the function call reverted
        if (success == false) {
            // if there is a return reason string
            if (response.length > 0) {
                // bubble up any reason for revert
                assembly {
                    let response_size := mload(response)
                    revert(add(32, response), response_size)
                }
            } else {
                revert(GUARD_REVERTED);
            }
        }

        // Decode the response message
        (guardResponse) = abi.decode(response, (string));

        // Revert with guard message as reason if invocation not successful
        require(success, guardResponse);

    }

}