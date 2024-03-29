// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoSupport } from "./FismoSupport.sol";
import { IFismoOperate } from "../interfaces/IFismoOperate.sol";

/**
 * @title FismoOperate
 *
 * Operate Fismo state machines
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoOperate is IFismoOperate, FismoSupport  {

    /**
     * @notice Modifier to only allow a method to be called by a machine's operator
     */
    modifier onlyOperator(bytes4 _machineId) {
        Machine storage machine = getMachine(_machineId);
        require(msg.sender == machine.operator, ONLY_OPERATOR);
        _;
    }

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
     *
     * @return response - the response from the action. See {FismoTypes.ActionResponse}
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

        // Get the user's current state in the given machine
        bytes4 currentStateId = getUserStateId(_user, _machineId);

        // Get the state
        State storage state = getState(_machineId, currentStateId, true);

        // Find the transition triggered by the given action
        bool found = false;
        Transition memory transition;
        for (uint256 i = 0; i < state.transitions.length; i++) {

            // We found it...
            if (state.transitions[i].actionId == _actionId) {
                found = true;
                transition = state.transitions[i];
                break;
            }

        }

        // Determine if action is suppressed
        bool suppressed =
            !found || (                                      // invalid action
                (state.exitGuarded || state.enterGuarded) && // state is guarded and thus may filter
                isActionSuppressed(_user, state.guardLogic, machine.name, state.name, transition.action)
            );

        // Make sure transition was found and not suppressed
        require(!suppressed, NO_SUCH_ACTION);

        // Get the next state
        State storage nextState = getState(_machineId, transition.targetStateId, true);

        // Create the action response
        response.machineName = machine.name;
        response.action = transition.action;
        response.priorStateName = state.name;
        response.nextStateName = nextState.name;

        // if there is exit guard logic for the current state, call it
        if (state.exitGuarded) {
            response.exitMessage = invokeGuard(_user, state.guardLogic, machine.name, state.name, transition.action, Guard.Exit);
        }

        // if there is enter guard logic for the next state, call it
        if (nextState.enterGuarded) {
            response.enterMessage = invokeGuard(_user, nextState.guardLogic, machine.name, nextState.name, transition.action, Guard.Enter);
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
     * @param _guardLogic - the address of the guard logic contract
     * @param _machineName - the name of the machine
     * @param _action - the name of the state
     * @param _targetStateName - the name of the target state
     * @param _guard - the guard type (enter/exit) See: {FismoTypes.Guard}
     *
     * @return guardResponse - the message (if any) returned from the guard
     */
    function invokeGuard(
        address _user,
        address _guardLogic,
        string memory _machineName,
        string memory _targetStateName,
        string memory _action,
        Guard _guard
    )
    internal
    returns (string memory guardResponse)
    {
        // Get the function selector and encode the call
        bytes4 selector = getGuardSelector(_machineName, _targetStateName, _guard);
        bytes memory guardCall = abi.encodeWithSelector(
            selector,
            _user,
            _action,
            _targetStateName
        );

        // Invoke the guard
        (bool success, bytes memory response) = _guardLogic.delegatecall(guardCall);

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