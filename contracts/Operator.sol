// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { IFismoOperate } from "./interfaces/IFismoOperate.sol";
import { FismoConstants } from "./domain/FismoConstants.sol";
import { FismoTypes } from "./domain/FismoTypes.sol";

/**
 * @title Operator
 *
 * This is a basic, cloneable, Fismo operator contract.
 * Anyone can invoke actions.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract Operator is FismoConstants {

    /// Emitted when a user clones the Operator contract
    event OperatorCloned(
        address indexed clonedBy,
        address indexed clone,
        address indexed fismo
    );

    /// Emitted when a user invokes an action
    event ActionInvoked(
        bytes4 indexed machineId,
        bytes4 indexed actionId,
        FismoTypes.ActionResponse response
    );

    /// The Fismo instance to invoke actions upon
    IFismoOperate private fismo;

    /// Is this the original Operator instance or a clone?
    bool private isOperator;

    /**
     * @notice Constructor
     *
     * Note:
     * - Only executed in an actual contract deployment
     * - Clones have their init() method called to do same
     *
     * @param _fismo - address of the Fismo instance
     */
    constructor(address _fismo) payable {
        initialize(_fismo, true);
    }

    /**
     * @notice Initialize a cloned Operator instance.
     *
     * Reverts if:
     * - Current Fismo address is not the zero address
     *
     * Note:
     * - Must be external to be called from the Operator factory.
     * - Sets `isOperator` to false, so that `cloneOperator` will revert.
     *
     * @param  _fismo - address of the Fismo instance
     */
    function init(address _fismo)
    external
    {
        require(address(fismo) == address(0), ALREADY_INITIALIZED);
        initialize(_fismo, false);
    }

    /**
     * @notice Initialize Operator contract
     *
     * @param  _fismo - address of the Fismo instance
     * @param  _isOperator - are we initializing the a just-deployed instance?
     */
    function initialize(address _fismo, bool _isOperator) internal {
        fismo = IFismoOperate(_fismo);
        isOperator = _isOperator;
    }

    /**
     * Invoke a Fismo action
     *
     * Note:
     * - In this basic implementation anyone can invoke actions
     *
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     *
     * @return response - the response message. see {FismoTypes.ActionResponse}
     */
    function invokeAction(bytes4 _machineId, bytes4 _actionId)
    external
    returns(FismoTypes.ActionResponse memory response) {
        response = fismo.invokeAction(msg.sender, _machineId, _actionId);

        // Notify watchers of state change
        emit ActionInvoked(_machineId, _actionId, response);
    }

    /**
     * @notice Deploys and returns the address of an Operator clone.
     *
     * Emits:
     * - OperatorCloned
     *
     * @param _fismo - the address of the Fismo instance to operate
     * @return instance - the address of the Operator clone instance
     */
    function cloneOperator(address _fismo)
    external
    returns (address instance)
    {
        // Make sure this isn't a clone
        require(isOperator, MULTIPLICITY);

        // Clone the contract
        instance = clone();

        // Initialize the clone
        Operator(instance).init(_fismo);

        // Notify watchers of state change
        emit OperatorCloned(msg.sender, instance, _fismo);
    }

    /**
     * @dev Deploys and returns the address of an Operator clone
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