// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoOperate } from "../components/FismoOperate.sol";

/**
 * @title MockFismo
 *
 * Allow testing of internal Fismo methods
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract MockFismo is FismoOperate  {

    /**
     * Constructor
     *
     * Sets the initial contract owner
     *
     * @param _owner the address of the contract owner
     */
    constructor(address _owner) payable {
        setOwner( _owner);
    }

    /**
     * @notice Invoke the specified guard function
     *
     * Reverts if
     * - Guard logic decides to disallow transition
     * - delegatecall attempt fails
     *
     * @param _user - the user address the call is being invoked for
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the guard type (enter/exit) See: {Guard}
     *
     * @return guardResponse - the message (if any) returned from the guard
     */
    function callGuard(
        address _user,
        string memory _machineName,
        string memory _stateName,
        Guard _guard
    )
    public
    returns (string memory guardResponse)
    {

        return invokeGuard(_user, _machineName, _stateName, _guard);

    }

}