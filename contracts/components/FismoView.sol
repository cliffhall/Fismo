// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoStore } from "../domain/FismoStore.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";
import { FismoConstants } from "../domain/FismoConstants.sol";
import { IFismoClone } from "../interfaces/IFismoClone.sol";
import { IFismoView } from "../interfaces/IFismoView.sol";
import { FismoSupport } from "./FismoSupport.sol";

/**
 * @title FismoView
 *
 * @notice Fismo storage read functionality
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoView is IFismoView, FismoTypes, FismoConstants {

    //-------------------------------------------------------
    // EXTERNAL FUNCTIONS
    //-------------------------------------------------------

    /**
     * @notice Get the last recorded position of the given user.
     *
     * Each position contains a machine id and state id.
     * See: {FismoTypes.Position}
     *
     * @param _user - the address of the user
     * @return success - whether any positions have been recorded for the user
     * @return position - the last recorded position of the given user
     */
    function getLastPosition(address _user)
    public
    view
    override
    returns (bool success, Position memory position)
    {
        // Get the user's position historyCF
        Position[] storage history = getStore().userHistory[_user];

        // Return the last position on the stack
        bytes4 none = 0;
        position = (history.length > 0) ? history[history.length-1] : Position(none, none);

        // If the machine id is zero, the user has not interacted with this Fismo instance
        success = (position.machineId != 0);
    }

    /**
     * @notice Get the entire position history for a given user
     *
     * Each position contains a machine id and state id.
     * See: {FismoTypes.Position}
     *
     * @param _user - the address of the user
     * @return success - whether any history exists for the user
     * @return history - an array of Position structs
     */
    function getPositionHistory(address _user)
    public
    view
    returns (bool success, Position[] memory history)
    {
        // Return the user's position history
        history = getStore().userHistory[_user];

        // If there are no history entries, the user has not interacted with this Fismo instance
        success = history.length > 0;
    }

    /**
     * @notice Get the current state for a given user in a given machine.
     *
     * Note:
     * - If the user has not interacted with the machine, the initial state
     *   for the machine is returned.
     *
     * Reverts if:
     * - machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @return state - the user's current state in the given machine. See {FismoTypes.State}
     */
    function getUserState(address _user, bytes4 _machineId)
    external
    view
    override
    returns (State memory state)
    {
        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get the user's current state in the given machine
        bytes4 currentStateId = getUserStateId(_user, _machineId);

        // Get the installed state
        state = getState(_machineId, currentStateId, true);

        // If state is guarded, it may filter
        if (state.exitGuarded || state.enterGuarded) {

            // Visit each transition
            uint256 count;
            uint256 numTransitions = state.transitions.length;
            bool[] memory states = new bool[](numTransitions);
            Transition[] memory outgoing = new Transition[](numTransitions);
            for (uint256 i = 0; i < numTransitions; i++) {

                // Find out if the action is suppressed
                // N.B. Done as a static call so this check be done in a view method, because
                //      the isActionSuppressed method makes a delegate call so it cannot be view
                (bool success, bytes memory response) = address(this).staticcall(
                    abi.encodeWithSelector(
                            this.isActionSuppressed.selector,
                            _user,
                            state.guardLogic,
                            machine.name,
                            state.name,
                            state.transitions[i].action
                    )
                );

                // Interpret response
                bool isSuppressed = success && (bool(abi.decode(response, (bool))));
                states[i] = isSuppressed;

                // Add unsuppressed actions to outgoing list
                if (!isSuppressed) {
                    outgoing[count] = state.transitions[i];
                    count++;
                }

            }

            // Replace the state's transition list with the filtered list if needed
            if (numTransitions > count) {
                Transition[] memory filtered = new Transition[](count);
                for (uint256 i = 0; i < count; i++) { filtered[i] = outgoing[i]; }
                state.transitions = filtered;
            }

        }

    }

    /**
     * @notice Get the off-chain metadata URI for the given machine.
     *
     * Reverts if:
     * - Machine does not exist
     *
     * @param _machineId - the id of the machine
     * @return uri - the URI for the given machine
     */
    function getMachineURI(bytes4 _machineId)
    external
    view
    override
    returns (string memory uri)
    {
        // Get the machine
        Machine storage machine = getMachine(_machineId);
        uri = machine.uri;
    }

    //-------------------------------------------------------
    // INTERNAL FUNCTIONS
    //-------------------------------------------------------

    /**
     * @notice Get a machine by id
     *
     * Reverts if
     * - Machine does not exist
     *
     * @param _machineId - the id of the machine
     * @return machine - the machine configuration
     */
    function getMachine(bytes4 _machineId)
    internal
    view
    returns (Machine storage machine)
    {
        // Get the machine
        machine = getStore().machine[_machineId];

        // Make sure machine exists
        require(machine.id == _machineId, NO_SUCH_MACHINE);
    }

    /**
     * @notice Get a state by Machine id and State id.
     *
     * Reverts if
     * - _verify is true and State does not exist
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _shouldExist - true if the state should already exist
     * @return state - the state definition
     */
    function getState(bytes4 _machineId, bytes4 _stateId, bool _shouldExist)
    internal
    view
    returns (State storage state) {

        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get index of state in machine's states array
        uint256 index = getStateIndex(_machineId, _stateId);

        // Get the state
        state = machine.states[index];

        // Verify expected existence or non-existence of State
        if (_shouldExist) {
            require(state.id == _stateId, NO_SUCH_STATE);
        } else {
            require(state.id == 0, STATE_EXISTS);
        }
    }

    /**
     * @notice Get a State's index in Machine's states array.
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     *
     * @return index - the state's index in the machine's states array
     */
    function getStateIndex(bytes4 _machineId, bytes4 _stateId)
    internal
    view
    returns(uint256 index)
    {
        index = getStore().stateIndex[_machineId][_stateId];
    }

    /**
     * @notice Get the current state for a given user in a given machine.
     *
     * Note:
     * - If the user has not interacted with the machine, the initial state
     *   for the machine is returned.
     *
     * Reverts if:
     * - machine does not exist
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @return currentStateId - the user's current state id in the given machine.
     */
    function getUserStateId(address _user, bytes4 _machineId)
    internal
    view
    returns (bytes4 currentStateId)
    {
        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get the user's current state in the given machine, default to initialStateId if not found
        currentStateId = getStore().userState[_user][_machineId];
        if (currentStateId == bytes4(0)) currentStateId = machine.initialStateId;
    }

    /**
     * @notice Is the given action contextually suppressed?
     *
     * Notes:
     * - A guard contract may supply deterministically named
     *   filter function for each of the machine states it
     *   supports. This function takes the user's address and
     *   an action name, and returns true if it should be
     *   suppressed.
     *
     * Ex.
     * - MachineName_StateName_Filter(address _user, string calldata _action)
     *   external
     *   view
     *   returns (bool)
     *
     * - Enter and exit guards can store information about users
     *   as they interact with the machine, which can be used to
     *   contextually allow or suppress one or more pre-defined
     *   actions for any given state.
     *
     * @param _user - the user address the call is being invoked for
     * @param _guardLogic - the address of the guard logic contract
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     *
     * @return suppressed - list of actions to suppress
     */
    function isActionSuppressed(
        address _user,
        address _guardLogic,
        string memory _machineName,
        string memory _stateName,
        string memory _action
    )
    public
    returns (bool suppressed)
    {
        // Get the filter function selector and encode the call
        bytes4 selector = getGuardSelector(_machineName, _stateName, Guard.Filter);
        bytes memory guardCall = abi.encodeWithSelector(
            selector,
            _user,
            _action
        );

        // Invoke the filter
        (, bytes memory response) = _guardLogic.delegatecall(guardCall);

        // if the function call did not revert, decode the response message
        suppressed = abi.decode(response, (bool));

    }

    /**
     * @notice Get the function selector for an enter or exit guard guard
     *
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the type of guard (enter/exit/filter). See {FismoTypes.Guard}
     *
     * @return guardSelector - the function selector, e.g., `0x23b872dd`
     */
    function getGuardSelector(string memory _machineName, string memory _stateName, Guard _guard)
    internal
    pure
    returns (bytes4 guardSelector)
    {
        // Get the guard type as a string
        string memory guardType =
        (_guard == Guard.Filter)
        ? "_Filter"
        : (_guard == Guard.Enter) ? "_Enter" : "_Exit";

        // Get the function name
        string memory functionName = strConcat(
            strConcat(
                strConcat(_machineName, "_"),
                _stateName
            ),
            guardType
        );

        // Construct signature
        string memory guardSignature = strConcat(
            functionName,
            (_guard == Guard.Filter)
            ? "(address,string)"
            : "(address,string,string)"
        );

        // Return the hashed function selector
        guardSelector = nameToId(guardSignature);
    }

    /**
     * @notice Concatenate two strings
     * @param _a the first string
     * @param _b the second string
     * @return result the concatenation of `_a` and `_b`
     */
    function strConcat(string memory _a, string memory _b)
    internal
    pure
    returns(string memory result)
    {
        result = string(abi.encodePacked(bytes(_a), bytes(_b)));
    }

    /**
     * @notice Hash a name into a bytes4 id
     *
     * @param _name a string to hash
     *
     * @return id bytes4 sighash of _name
     */
    function nameToId(string memory _name)
    internal
    pure
    returns
    (bytes4 id)
    {
        id = bytes4(keccak256(bytes(_name)));
    }

    /**
     * @notice Get the Fismo storage slot.
     *
     * @return Fismo storage slot
     */
    function getStore()
    internal
    pure
    returns (FismoStore.FismoSlot storage)
    {
        return FismoStore.getStore();
    }

}